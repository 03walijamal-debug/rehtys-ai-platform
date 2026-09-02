import { query, mutation, QueryCtx } from "./_generated/server";
import { v } from "convex/values";

// ─── PLAN CONFIGURATIONS ─────────────────────────────────
const PLAN_LIMITS = {
  free: {
    messagesLimit: 1000,
    agentsLimit: 1,
    documentsLimit: 5,
  },
  starter: {
    messagesLimit: 10000,
    agentsLimit: 3,
    documentsLimit: 50,
  },
  pro: {
    messagesLimit: 100000,
    agentsLimit: 10,
    documentsLimit: 500,
  },
};

// ─── GET CURRENT USER (Convex Auth) ──────────────────────
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    return user;
  },
});

/**
 * Internal helper to get current user.
 * Uses Convex Auth — looks up user by session.
 */
export const getCurrentUser = async (ctx: QueryCtx) => {
  const identity = await ctx.auth.getUserIdentity();
  if (!identity) return null;

  // Try to find user by email (Convex Auth stores email)
  const user = await ctx.db
    .query("users")
    .filter((q) => q.eq(q.field("email"), identity.email))
    .first();

  return user || null;
};

// ─── UPSERT USER (Create or update on login) ─────────────
export const upsertUser = mutation({
  args: {
    email: v.string(),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Try to find existing user
    const existingUser = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (existingUser) {
      // Update last login
      await ctx.db.patch(existingUser._id, {
        name: args.name || existingUser.name,
      });
      return existingUser._id;
    }

    // New user — free plan
    return await ctx.db.insert("users", {
      email: args.email,
      name: args.name,
      plan: "free",
      messagesUsed: 0,
      messagesLimit: PLAN_LIMITS.free.messagesLimit,
      agentsLimit: PLAN_LIMITS.free.agentsLimit,
      documentsLimit: PLAN_LIMITS.free.documentsLimit,
    });
  },
});

// ─── UPDATE USER PLAN ────────────────────────────────────
export const updateUserPlan = mutation({
  args: {
    email: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), args.email))
      .first();

    if (!user) throw new Error("User not found");

    const limits = PLAN_LIMITS[args.plan];

    await ctx.db.patch(user._id, {
      plan: args.plan,
      messagesLimit: limits.messagesLimit,
      agentsLimit: limits.agentsLimit,
      documentsLimit: limits.documentsLimit,
      planExpiry: Date.now() + 30 * 24 * 60 * 60 * 1000,
    });

    return user._id;
  },
});

// ─── CHECK LIMITS ────────────────────────────────────────
export const checkLimits = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .filter((q) => q.eq(q.field("email"), identity.email))
      .first();

    if (!user) return null;

    // Count current agents
    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    // Count current documents
    const documents = await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", identity.subject))
      .collect();

    return {
      agents: {
        used: agents.length,
        limit: user.agentsLimit || 1,
        canCreate: agents.length < (user.agentsLimit || 1),
      },
      messages: {
        used: user.messagesUsed || 0,
        limit: user.messagesLimit || 1000,
        canSend:
          (user.messagesUsed || 0) < (user.messagesLimit || 1000),
        percentage: Math.round(
          ((user.messagesUsed || 0) / (user.messagesLimit || 1000)) * 100
        ),
      },
      documents: {
        used: documents.length,
        limit: user.documentsLimit || 5,
        canAdd: documents.length < (user.documentsLimit || 5),
      },
    };
  },
});

// ─── GET ALL USERS (Admin) ───────────────────────────────
export const getAllUsers = query({
  handler: async (ctx) => {
    return await ctx.db.query("users").collect();
  },
});
