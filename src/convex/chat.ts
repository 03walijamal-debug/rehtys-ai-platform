import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";

// ─── SEND MESSAGE (Main Chat Flow) ───────────────────────
export const sendMessage = action({
  args: {
    agentId: v.id("agents"),
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (ctx, args) => {
    const startTime = Date.now();

    // 1. Get agent details
    const agent = await ctx.runQuery(
      (await import("./_generated/server")).api.getAgent,
      { agentId: args.agentId }
    );
    if (!agent) throw new Error("Agent not found");
    if (!agent.isActive) throw new Error("Agent is not active");

    // 2. Check message limit (agent owner)
    const user = await ctx.runQuery(
      (await import("./_generated/server")).api.getUserById,
      { userId: agent.userId as Id<"users"> }
    );
    if (user && (user.messagesUsed || 0) >= (user.messagesLimit || 1000)) {
      throw new Error("Message limit reached. Please upgrade your plan.");
    }

    // 3. Save user message
    await ctx.runMutation(
      (await import("./_generated/server")).api.saveMessage,
      {
        conversationId: args.conversationId,
        role: "user",
        content: args.content,
      }
    );

    // 4. RAG: Search for relevant knowledge base chunks
    let ragContext = "";
    try {
      const relevantChunks = await ctx.runAction(
        (await import("./_generated/server")).api.searchRelevantChunks,
        {
          agentId: args.agentId,
          query: args.content,
          limit: 5,
        }
      );

      if (relevantChunks && relevantChunks.length > 0) {
        ragContext = "\n\nRELEVANT KNOWLEDGE:\n";
        for (const chunk of relevantChunks) {
          ragContext += `- ${chunk.content}\n`;
        }
      }
    } catch (error) {
      console.error("RAG search failed:", error);
    }

    // 5. Build the full prompt
    const systemPrompt = agent.systemPrompt + ragContext;

    // 6. Call Gemini API
    const apiKey = process.env.GOOGLE_API_KEY;
    if (!apiKey) throw new Error("GOOGLE_API_KEY not set");

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system_instruction: {
            parts: [{ text: systemPrompt }],
          },
          contents: [
            {
              role: "user",
              parts: [{ text: args.content }],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            topP: 0.9,
            maxOutputTokens: 1024,
          },
        }),
      }
    );

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API error: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const aiResponse =
      geminiData.candidates?.[0]?.content?.parts?.[0]?.text ||
      "I'm sorry, I couldn't generate a response. Please try again.";

    const responseTime = Date.now() - startTime;

    // 7. Save AI response
    await ctx.runMutation(
      (await import("./_generated/server")).api.saveMessage,
      {
        conversationId: args.conversationId,
        role: "assistant",
        content: aiResponse,
        responseTime,
      }
    );

    // 8. Update message count
    await ctx.runMutation(
      (await import("./_generated/server")).api.incrementMessageCount,
      { conversationId: args.conversationId }
    );

    // 9. Update user's messages used
    if (user) {
      await ctx.runMutation(
        (await import("./_generated/server")).api.incrementUserMessagesUsed,
        { userId: user._id }
      );
    }

    return { response: aiResponse, responseTime };
  },
});

// ─── SAVE MESSAGE ────────────────────────────────────────
export const saveMessage = mutation({
  args: {
    conversationId: v.id("conversations"),
    role: v.union(
      v.literal("user"),
      v.literal("assistant"),
      v.literal("system")
    ),
    content: v.string(),
    responseTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const messageId = await ctx.db.insert("messages", {
      conversationId: args.conversationId,
      role: args.role,
      content: args.content,
      responseTime: args.responseTime,
      createdAt: Date.now(),
    });

    await ctx.db.patch(args.conversationId, {
      lastMessageAt: Date.now(),
    });

    return messageId;
  },
});

// ─── INCREMENT MESSAGE COUNT ─────────────────────────────
export const incrementMessageCount = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (convo) {
      await ctx.db.patch(args.conversationId, {
        messageCount: convo.messageCount + 1,
      });
    }
  },
});

// ─── INCREMENT USER MESSAGES USED ────────────────────────
export const incrementUserMessagesUsed = mutation({
  args: { userId: v.id("users") },
  handler: async (ctx, args) => {
    const user = await ctx.db.get(args.userId);
    if (user) {
      await ctx.db.patch(args.userId, {
        messagesUsed: (user.messagesUsed || 0) + 1,
      });
    }
  },
});

// ─── GET CONVERSATION MESSAGES ───────────────────────────
export const getConversationMessages = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .order("asc")
      .collect();
  },
});

// ─── GET AGENT CONVERSATIONS ─────────────────────────────
export const getAgentConversations = query({
  args: { agentId: v.id("agents") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("conversations")
      .withIndex("by_agentId", (q) => q.eq("agentId", args.agentId))
      .order("desc")
      .collect();
  },
});

// ─── CREATE CONVERSATION ─────────────────────────────────
export const createConversation = mutation({
  args: {
    agentId: v.id("agents"),
    visitorId: v.string(),
    visitorName: v.optional(v.string()),
    visitorEmail: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const agent = await ctx.db.get(args.agentId);
    if (!agent) throw new Error("Agent not found");

    const conversationId = await ctx.db.insert("conversations", {
      agentId: args.agentId,
      userId: agent.userId,
      visitorId: args.visitorId,
      visitorName: args.visitorName,
      visitorEmail: args.visitorEmail,
      status: "active",
      messageCount: 0,
      startedAt: Date.now(),
      lastMessageAt: Date.now(),
    });

    await ctx.db.patch(args.agentId, {
      totalConversations: agent.totalConversations + 1,
    });

    return conversationId;
  },
});

// ─── CLOSE CONVERSATION ──────────────────────────────────
export const closeConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.conversationId, { status: "closed" });
  },
});
