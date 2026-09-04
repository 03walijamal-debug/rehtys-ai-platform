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

// ─── HELPER: Clerk user id from the JWT token ────────────
// Clerk sessions are trusted by Convex, so getSubject()
// returns the Clerk userId (e.g. "user_2abc...") for logged-in users.
export async function getTokenIdentifier(ctx: QueryCtx): Promise<string | null> {
  try {
    return await ctx.auth.getSubject();
  } catch {
    return null;
  }
}

// ─── GET CURRENT USER ────────────────────────────────────
export const currentUser = query({
  args: {},
  handler: async (ctx) => {
    return await getCurrentUser(ctx);
  },
});

export const getCurrentUser = async (ctx: QueryCtx) => {
  const tokenId = await getTokenIdentifier(ctx);
  if (!tokenId) return null;
  return await ctx.db
    .query("users")
    .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenId))
    .first();
};

// ─── UPSERT USER (Create or update on login) ─────────────
// Called from the frontend after Clerk sign-in so every user
// has a matching row in the Convex users table.
export const upsertUser = mutation({
  args: {
    tokenIdentifier: v.string(),
    email: v.optional(v.string()),
    name: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
      .first();

    if (existingUser) {
      await ctx.db.patch(existingUser._id, {
        name: args.name ?? existingUser.name,
        email: args.email ?? existingUser.email,
      });
      return existingUser._id;
    }

    // New user — free plan
    return await ctx.db.insert("users", {
      tokenIdentifier: args.tokenIdentifier,
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
    tokenIdentifier: v.string(),
    plan: v.union(v.literal("free"), v.literal("starter"), v.literal("pro")),
  },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) =>
        q.eq("tokenIdentifier", args.tokenIdentifier)
      )
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

// ─── GET USER BY ID (used by actions via runQuery) ───────
export const getUserById = query({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.userId);
  },
});

// ─── CHECK LIMITS ────────────────────────────────────────
export const checkLimits = query({
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return null;

    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
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
