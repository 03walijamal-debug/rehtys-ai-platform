import { v } from "convex/values";
import { query, mutation, QueryCtx } from "./_generated/server";
import { api } from "./_generated/api";

// ─── TEXT CHUNKING ───────────────────────────────────────
function chunkText(text: string, maxChunkSize: number = 1500): string[] {
  const sentences = text
    .replace(/\n+/g, " ")
    .split(/(?<=[.!?])\s+/)
    .filter((s) => s.trim().length > 0);

  const chunks: string[] = [];
  let currentChunk = "";

  for (const sentence of sentences) {
    if (
      (currentChunk + " " + sentence).length > maxChunkSize &&
      currentChunk
    ) {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk = currentChunk
        ? currentChunk + " " + sentence
        : sentence;
    }
  }

  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks.length > 0 ? chunks : [text.slice(0, maxChunkSize)];
}

// ─── HELPER: Get current user (Clerk JWT subject) ────────
async function getCurrentUser(ctx: QueryCtx) {
  let tokenId: string | null = null;
  try {
    tokenId = (await ctx.auth.getUserIdentity())?.subject ?? null;
  } catch {
    return null;
  }
  if (!tokenId) return null;

  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenId))
    .first();
}

// ─── GET ALL DOCUMENTS FOR CURRENT USER ──────────────────
export const getMyDocuments = query({
  args: { agentId: v.optional(v.id("agents")) },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];

    if (args.agentId) {
      // Verify the agent belongs to this user
      const agent = await ctx.db.get(args.agentId);
      if (!agent || agent.userId !== user._id) return [];

      return await ctx.db
        .query("documents")
        .withIndex("by_agentId", (q) =>
          q.eq("agentId", args.agentId!)
        )
        .collect();
    }

    return await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();
  },
});

// ─── ADD FAQ ENTRY ───────────────────────────────────────
export const addFaq = mutation({
  args: {
    agentId: v.id("agents"),
    question: v.string(),
    answer: v.string(),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const agent = await ctx.db.get(args.agentId);
    if (!agent || agent.userId !== user._id)
      throw new Error("Not authorized");

    // Check document limit
    const existingDocs = await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    if (existingDocs.length >= (user.documentsLimit || 5)) {
      throw new Error(
        `Document limit reached (${user.documentsLimit || 5}). Upgrade!`
      );
    }

    const content = `Q: ${args.question}\nA: ${args.answer}`;
    const chunks = chunkText(content);

    const docId = await ctx.db.insert("documents", {
      userId: user._id,
      agentId: args.agentId,
      name: `FAQ: ${args.question.slice(0, 50)}`,
      fileType: "faq",
      rawContent: content,
      chunkCount: chunks.length,
      status: "processing",
      createdAt: Date.now(),
    });

    for (let i = 0; i < chunks.length; i++) {
      await ctx.db.insert("chunks", {
        documentId: docId,
        agentId: args.agentId,
        userId: user._id,
        content: chunks[i],
        embedding: [],
        tokenCount: Math.ceil(chunks[i].length / 4),
        chunkIndex: i,
        createdAt: Date.now(),
      });
    }

    // Generate embeddings in the background so the chunks become
    // searchable and the document status flips processing → ready.
    await ctx.scheduler.runAfter(0, api.embeddings.embedDocument, {
      documentId: docId,
    });

    return docId;
  },
});

// ─── ADD DOCUMENT ────────────────────────────────────────
export const addDocument = mutation({
  args: {
    agentId: v.id("agents"),
    name: v.string(),
    content: v.string(),
    fileType: v.union(
      v.literal("faq"),
      v.literal("document"),
      v.literal("url"),
      v.literal("text")
    ),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const agent = await ctx.db.get(args.agentId);
    if (!agent || agent.userId !== user._id)
      throw new Error("Not authorized");

    const existingDocs = await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    if (existingDocs.length >= (user.documentsLimit || 5)) {
      throw new Error(
        `Document limit reached (${user.documentsLimit || 5}). Upgrade!`
      );
    }

    const chunks = chunkText(args.content);

    const docId = await ctx.db.insert("documents", {
      userId: user._id,
      agentId: args.agentId,
      name: args.name,
      fileType: args.fileType,
      rawContent: args.content,
      chunkCount: chunks.length,
      status: "processing",
      createdAt: Date.now(),
    });

    for (let i = 0; i < chunks.length; i++) {
      await ctx.db.insert("chunks", {
        documentId: docId,
        agentId: args.agentId,
        userId: user._id,
        content: chunks[i],
        embedding: [],
        tokenCount: Math.ceil(chunks[i].length / 4),
        chunkIndex: i,
        createdAt: Date.now(),
      });
    }

    // Generate embeddings in the background so the chunks become
    // searchable and the document status flips processing → ready.
    await ctx.scheduler.runAfter(0, api.embeddings.embedDocument, {
      documentId: docId,
    });

    return docId;
  },
});

// ─── MARK DOCUMENT AS READY ──────────────────────────────
export const markDocumentReady = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, { status: "ready" });
  },
});

// ─── MARK DOCUMENT AS ERROR ──────────────────────────────
export const markDocumentError = mutation({
  args: {
    documentId: v.id("documents"),
    errorMessage: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.documentId, {
      status: "error",
      errorMessage: args.errorMessage,
    });
  },
});

// ─── UPDATE CHUNK EMBEDDING ──────────────────────────────
export const updateChunkEmbedding = mutation({
  args: { chunkId: v.id("chunks"), embedding: v.array(v.number()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.chunkId, { embedding: args.embedding });
  },
});

// ─── DELETE DOCUMENT ─────────────────────────────────────
export const deleteDocument = mutation({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    if (!user) throw new Error("Not authenticated");

    const doc = await ctx.db.get(args.documentId);
    if (!doc || doc.userId !== user._id)
      throw new Error("Not authorized");

    const chunks = await ctx.db
      .query("chunks")
      .withIndex("by_documentId", (q) =>
        q.eq("documentId", args.documentId)
      )
      .collect();

    for (const chunk of chunks) {
      await ctx.db.delete(chunk._id);
    }

    await ctx.db.delete(args.documentId);
    return true;
  },
});

// ─── GET CHUNKS FOR AN AGENT ─────────────────────────────
export const getAgentChunks = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chunks")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .collect();
  },
});

// ─── GET SINGLE DOCUMENT ─────────────────────────────────
export const getDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.documentId);
  },
});

// ─── GET CHUNKS FOR A DOCUMENT ───────────────────────────
export const getChunksByDocument = query({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("chunks")
      .withIndex("by_documentId", (q) => q.eq("documentId", args.documentId))
      .order("asc")
      .collect();
  },
});
