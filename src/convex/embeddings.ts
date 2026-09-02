import { v } from "convex/values";
import { action, query } from "./_generated/server";

// ─── COSINE SIMILARITY ───────────────────────────────────
function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }

  if (normA === 0 || normB === 0) return 0;
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// ─── GENERATE EMBEDDING (GEMINI) ─────────────────────────
export const generateEmbedding = action({
  args: { text: v.string() },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text: args.text }] },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    return data.embedding.values;
  },
});

// ─── GENERATE EMBEDDINGS FOR DOCUMENT ────────────────────
export const embedDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

    // Get all chunks for this document
    const chunks = await ctx.runQuery(
      (await import("./_generated/server")).api.getAgentChunks,
      { agentId: (await ctx.runQuery((await import("./_generated/server")).api.getDocument, { documentId: args.documentId }))?.agentId }
    );

    // Actually, let's get chunks directly
    const doc = await ctx.runQuery((await import("./_generated/server")).api.getDocument, { documentId: args.documentId });
    if (!doc) throw new Error("Document not found");

    // Get chunks from the document
    const allChunks = await ctx.runQuery(
      (await import("./_generated/server")).api.getChunksByDocument,
      { documentId: args.documentId }
    );

    for (const chunk of allChunks) {
      if (chunk.embedding.length > 0) continue; // Skip already embedded

      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              model: "models/text-embedding-004",
              content: { parts: [{ text: chunk.content }] },
            }),
          }
        );

        if (!response.ok) continue;

        const data = await response.json();
        const embedding = data.embedding.values;

        // Update chunk with embedding
        await ctx.runMutation(
          (await import("./_generated/server")).api.updateChunkEmbedding,
          { chunkId: chunk._id, embedding }
        );
      } catch (error) {
        console.error("Embedding failed for chunk:", chunk._id, error);
      }
    }

    // Mark document as ready
    await ctx.runMutation(
      (await import("./_generated/server")).api.markDocumentReady,
      { documentId: args.documentId }
    );

    return true;
  },
});

// ─── VECTOR SEARCH (FIND RELEVANT CHUNKS) ────────────────
export const searchRelevantChunks = action({
  args: {
    agentId: v.id("agents"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

    // Generate embedding for the query
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/text-embedding-004:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/text-embedding-004",
          content: { parts: [{ text: args.query }] },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Embedding API error: ${response.statusText}`);
    }

    const data = await response.json();
    const queryEmbedding = data.embedding.values;

    // Get all chunks for this agent
    const chunks = await ctx.runQuery(
      (await import("./_generated/server")).api.getAgentChunks,
      { agentId: args.agentId }
    );

    // Filter chunks with embeddings
    const embeddedChunks = chunks.filter(
      (c: { embedding: number[] }) => c.embedding.length > 0
    );

    // Calculate similarity and sort
    const scored = embeddedChunks.map(
      (chunk: { _id: any; content: string; embedding: number[] }) => ({
        ...chunk,
        score: cosineSimilarity(queryEmbedding, chunk.embedding),
      })
    );

    scored.sort(
      (a: { score: number }, b: { score: number }) => b.score - a.score
    );

    // Return top N results
    const limit = args.limit || 5;
    return scored.slice(0, limit);
  },
});
