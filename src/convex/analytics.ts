import { v } from "convex/values";
import { query, QueryCtx } from "./_generated/server";

// ─── HELPER: Get current user (Clerk JWT subject) ────────
async function getUser(ctx: QueryCtx) {
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

// ─── GET DASHBOARD STATS ─────────────────────────────────
export const getDashboardStats = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;

    // Get all agents for this user
    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const activeAgents = agents.filter((a) => a.isActive);

    let totalConversations = 0;
    let totalMessages = 0;
    let activeConversations = 0;

    for (const agent of agents) {
      const conversations = await ctx.db
        .query("conversations")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent._id))
        .collect();

      totalConversations += conversations.length;
      activeConversations += conversations.filter(
        (c) => c.status === "active"
      ).length;

      for (const convo of conversations) {
        totalMessages += convo.messageCount;
      }
    }

    const documents = await ctx.db
      .query("documents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    return {
      totalAgents: agents.length,
      activeAgents: activeAgents.length,
      totalConversations,
      activeConversations,
      totalMessages,
      messagesUsed: user.messagesUsed || 0,
      messagesLimit: user.messagesLimit || 1000,
      totalDocuments: documents.length,
      plan: user.plan || "free",
    };
  },
});

// ─── GET MESSAGE CHART DATA (Last 7 Days) ────────────────
export const getMessageChartData = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const allConversations = [];
    for (const agent of agents) {
      const convos = await ctx.db
        .query("conversations")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent._id))
        .collect();
      allConversations.push(...convos);
    }

    const now = Date.now();
    const sevenDaysAgo = now - 7 * 24 * 60 * 60 * 1000;

    const dailyCounts: Record<string, number> = {};

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const key = date.toISOString().split("T")[0];
      dailyCounts[key] = 0;
    }

    for (const convo of allConversations) {
      if (convo.startedAt < sevenDaysAgo) continue;

      const messages = await ctx.db
        .query("messages")
        .withIndex("by_conversationId", (q) =>
          q.eq("conversationId", convo._id)
        )
        .collect();

      for (const msg of messages) {
        if (msg.createdAt >= sevenDaysAgo) {
          const date = new Date(msg.createdAt);
          const key = date.toISOString().split("T")[0];
          if (dailyCounts[key] !== undefined) {
            dailyCounts[key]++;
          }
        }
      }
    }

    return Object.entries(dailyCounts).map(([date, count]) => ({
      date,
      messages: count,
    }));
  },
});

// ─── GET AGENT PERFORMANCE ───────────────────────────────
export const getAgentPerformance = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const performance = [];

    for (const agent of agents) {
      const conversations = await ctx.db
        .query("conversations")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent._id))
        .collect();

      let totalResponseTime = 0;
      let responseCount = 0;

      for (const convo of conversations) {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", convo._id)
          )
          .collect();

        for (const msg of messages) {
          if (msg.role === "assistant" && msg.responseTime) {
            totalResponseTime += msg.responseTime;
            responseCount++;
          }
        }
      }

      performance.push({
        agentId: agent._id,
        name: agent.name,
        conversations: conversations.length,
        messages: agent.totalMessages,
        avgResponseTime:
          responseCount > 0
            ? Math.round(totalResponseTime / responseCount)
            : 0,
        isActive: agent.isActive,
      });
    }

    return performance;
  },
});

// ─── GET RECENT ACTIVITY ─────────────────────────────────
export const getRecentActivity = query({
  args: { limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const user = await getUser(ctx);
    if (!user) return [];

    const limit = args.limit || 10;

    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    const activities = [];

    for (const agent of agents) {
      const convos = await ctx.db
        .query("conversations")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent._id))
        .order("desc")
        .take(5);

      for (const convo of convos) {
        activities.push({
          type: "conversation" as const,
          agentName: agent.name,
          visitorName: convo.visitorName || "Anonymous",
          status: convo.status,
          messageCount: convo.messageCount,
          timestamp: convo.startedAt,
        });
      }
    }

    activities.sort((a, b) => b.timestamp - a.timestamp);
    return activities.slice(0, limit);
  },
});

// ─── GET USAGE BREAKDOWN ─────────────────────────────────
export const getUsageBreakdown = query({
  handler: async (ctx) => {
    const user = await getUser(ctx);
    if (!user) return null;

    const agents = await ctx.db
      .query("agents")
      .withIndex("by_userId", (q) => q.eq("userId", user._id))
      .collect();

    let totalTokens = 0;
    let totalResponseTime = 0;
    let responseCount = 0;

    for (const agent of agents) {
      const convos = await ctx.db
        .query("conversations")
        .withIndex("by_agentId", (q) => q.eq("agentId", agent._id))
        .collect();

      for (const convo of convos) {
        const messages = await ctx.db
          .query("messages")
          .withIndex("by_conversationId", (q) =>
            q.eq("conversationId", convo._id)
          )
          .collect();

        for (const msg of messages) {
          if (msg.tokenCount) totalTokens += msg.tokenCount;
          if (msg.role === "assistant" && msg.responseTime) {
            totalResponseTime += msg.responseTime;
            responseCount++;
          }
        }
      }
    }

    return {
      messagesUsed: user.messagesUsed || 0,
      messagesLimit: user.messagesLimit || 1000,
      messagesPercentage: Math.round(
        ((user.messagesUsed || 0) / (user.messagesLimit || 1000)) * 100
      ),
      totalTokens,
      avgResponseTime:
        responseCount > 0
          ? Math.round(totalResponseTime / responseCount)
          : 0,
      plan: user.plan || "free",
    };
  },
});
