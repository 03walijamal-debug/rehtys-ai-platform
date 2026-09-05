import { ConvexError, v } from "convex/values";
import { action } from "./_generated/server";
import { api } from "./_generated/api";
import { Doc } from "./_generated/dataModel";

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
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey)
      throw new ConvexError(
        "No Gemini API key found. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in Convex dashboard → Settings → Environment Variables → Production."
      );

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: args.text }] },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new ConvexError(
        `Embedding API error (${response.status}): ${errText.slice(0, 200)}`
      );
    }

    const data = await response.json();
    return data.embedding.values;
  },
});

// ─── GENERATE EMBEDDINGS FOR DOCUMENT ────────────────────
// On any failure the document is marked "error" instead of staying stuck
// on "processing" forever.
export const embedDocument = action({
  args: { documentId: v.id("documents") },
  handler: async (ctx, args): Promise<boolean> => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      await ctx.runMutation(api.documents.markDocumentError, {
        documentId: args.documentId,
        errorMessage:
          "No Gemini API key found. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in Convex dashboard → Settings → Environment Variables → Production.",
      });
      return false;
    }

    // Short delay avoids a 503 hit on the very first call during high demand.
    await new Promise((r) => setTimeout(r, 5000));

    try {
      const doc = await ctx.runQuery(
        api.documents.getDocument,
        { documentId: args.documentId }
      );
      if (!doc) throw new ConvexError("Document not found");

      // Get chunks for this document
      const allChunks = await ctx.runQuery(
        api.documents.getChunksByDocument,
        { documentId: args.documentId }
      );

      for (const chunk of allChunks) {
        if (chunk.embedding.length > 0) continue; // Skip already embedded

        try {
          const response = await fetch(
            `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "models/gemini-embedding-001",
                content: { parts: [{ text: chunk.content }] },
              }),
            }
          );

          if (!response.ok) {
            // 429/503 means rate limit / high demand — a short wait often
            // resolves it, so retry once before giving up on this chunk.
            if ([429, 503].includes(response.status)) {
              await new Promise((r) => setTimeout(r, 5000));
              const retry = await fetch(
                `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    model: "models/gemini-embedding-001",
                    content: { parts: [{ text: chunk.content }] },
                  }),
                }
              );
              if (!retry.ok) continue;
              const data = await retry.json();
              const embedding = data.embedding.values;
              await ctx.runMutation(
                api.documents.updateChunkEmbedding,
                { chunkId: chunk._id, embedding }
              );
              continue;
            } else {
              continue;
            }
          }

          const data = await response.json();
          const embedding = data.embedding.values;

          // Update chunk with embedding
          await ctx.runMutation(
            api.documents.updateChunkEmbedding,
            { chunkId: chunk._id, embedding }
          );
        } catch (error) {
          console.error("Embedding failed for chunk:", chunk._id, error);
        }
      }

      // Mark document as ready
      await ctx.runMutation(
        api.documents.markDocumentReady,
        { documentId: args.documentId }
      );

      return true;
    } catch (error: any) {
      const message =
        typeof error?.data === "string" && error.data
          ? error.data
          : error?.message || "Embedding failed";
      await ctx.runMutation(api.documents.markDocumentError, {
        documentId: args.documentId,
        errorMessage: message.slice(0, 500),
      });
      return false;
    }
  },
});

// ─── VECTOR SEARCH (FIND RELEVANT CHUNKS) ────────────────
export const searchRelevantChunks = action({
  args: {
    agentId: v.id("agents"),
    query: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (
    ctx,
    args
  ): Promise<Array<Doc<"chunks"> & { score: number }>> => {
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey)
      throw new ConvexError(
        "No Gemini API key found. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in Convex dashboard → Settings → Environment Variables → Production."
      );

    // Generate embedding for the query
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-embedding-001:embedContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "models/gemini-embedding-001",
          content: { parts: [{ text: args.query }] },
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      throw new ConvexError(
        `Embedding API error (${response.status}): ${errText.slice(0, 200)}`
      );
    }

    const data = await response.json();
    const queryEmbedding = data.embedding.values;

    // Get all chunks for this agent
    const chunks = await ctx.runQuery(
      api.documents.getAgentChunks,
      { agentId: args.agentId }
    );

    // Filter chunks that already have embeddings
    const embeddedChunks = chunks.filter((c) => c.embedding.length > 0);

    // Score each chunk by cosine similarity to the query embedding
    const scored = embeddedChunks.map((chunk) => ({
      ...chunk,
      score: cosineSimilarity(queryEmbedding, chunk.embedding),
    }));

    scored.sort((a, b) => b.score - a.score);

    // Return the top N most relevant chunks
    const limit = args.limit || 5;
    return scored.slice(0, limit);
  },
});
