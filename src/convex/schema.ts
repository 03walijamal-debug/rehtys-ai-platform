import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// ─── ROLES (Original) ────────────────────────────────────
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER)
);

export type Role = Infer<typeof roleValidator>;

// ─── SCHEMA ──────────────────────────────────────────────
const schema = defineSchema(
  {
    // ── AUTH TABLES (DO NOT REMOVE) ──────────────────────
    ...authTables,

    // ── USERS TABLE (Extended from auth) ─────────────────
    users: defineTable({
      name: v.optional(v.string()),
      image: v.optional(v.string()),
      email: v.optional(v.string()),
      emailVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()),
      role: v.optional(roleValidator),
      // ── REHTYS FIELDS ──
      plan: v.optional(
        v.union(v.literal("free"), v.literal("starter"), v.literal("pro"))
      ),
      planExpiry: v.optional(v.number()),
      lemonCustomerId: v.optional(v.string()),
      messagesUsed: v.optional(v.number()),
      messagesLimit: v.optional(v.number()),
      agentsLimit: v.optional(v.number()),
      documentsLimit: v.optional(v.number()),
    }).index("email", ["email"]),

    // ── AGENTS ───────────────────────────────────────────
    agents: defineTable({
      userId: v.string(),
      name: v.string(),
      description: v.string(),
      systemPrompt: v.string(),
      model: v.union(v.literal("gemini-flash"), v.literal("gemini-pro")),
      isActive: v.boolean(),
      embedToken: v.string(),
      tone: v.optional(v.string()),
      language: v.optional(v.string()),
      totalConversations: v.number(),
      totalMessages: v.number(),
      createdAt: v.number(),
      updatedAt: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_embedToken", ["embedToken"]),

    // ── DOCUMENTS ────────────────────────────────────────
    documents: defineTable({
      userId: v.string(),
      agentId: v.id("agents"),
      name: v.string(),
      fileType: v.union(
        v.literal("faq"),
        v.literal("document"),
        v.literal("url"),
        v.literal("text")
      ),
      rawContent: v.string(),
      chunkCount: v.number(),
      status: v.union(
        v.literal("processing"),
        v.literal("ready"),
        v.literal("error")
      ),
      errorMessage: v.optional(v.string()),
      createdAt: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_agentId", ["agentId"]),

    // ── CHUNKS (Embeddings for RAG) ─────────────────────
    chunks: defineTable({
      documentId: v.id("documents"),
      agentId: v.id("agents"),
      userId: v.string(),
      content: v.string(),
      embedding: v.array(v.number()),
      tokenCount: v.number(),
      chunkIndex: v.number(),
      createdAt: v.number(),
    })
      .index("by_userId", ["userId"])
      .index("by_agentId", ["agentId"])
      .index("by_documentId", ["documentId"]),

    // ── CONVERSATIONS ────────────────────────────────────
    conversations: defineTable({
      agentId: v.id("agents"),
      userId: v.string(),
      visitorId: v.string(),
      visitorName: v.optional(v.string()),
      visitorEmail: v.optional(v.string()),
      status: v.union(
        v.literal("active"),
        v.literal("closed"),
        v.literal("archived")
      ),
      messageCount: v.number(),
      startedAt: v.number(),
      lastMessageAt: v.number(),
    })
      .index("by_agentId", ["agentId"])
      .index("by_userId", ["userId"])
      .index("by_visitorId", ["visitorId"]),

    // ── MESSAGES ─────────────────────────────────────────
    messages: defineTable({
      conversationId: v.id("conversations"),
      role: v.union(
        v.literal("user"),
        v.literal("assistant"),
        v.literal("system")
      ),
      content: v.string(),
      tokenCount: v.optional(v.number()),
      responseTime: v.optional(v.number()),
      createdAt: v.number(),
    }).index("by_conversationId", ["conversationId"]),

    // ── API KEYS ─────────────────────────────────────────
    apiKeys: defineTable({
      userId: v.string(),
      name: v.string(),
      key: v.string(),
      lastUsed: v.optional(v.number()),
      createdAt: v.number(),
      isActive: v.boolean(),
    })
      .index("by_userId", ["userId"])
      .index("by_key", ["key"]),
  },
  {
    schemaValidation: false,
  }
);

export default schema;
