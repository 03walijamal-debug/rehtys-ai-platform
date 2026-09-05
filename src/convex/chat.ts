import { ConvexError, v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { Id } from "./_generated/dataModel";
import { api } from "./_generated/api";

// ─── SEND MESSAGE (Main Chat Flow) ───────────────────────
export const sendMessage = action({
  args: {
    agentId: v.id("agents"),
    conversationId: v.id("conversations"),
    content: v.string(),
  },
  handler: async (
    ctx,
    args
  ): Promise<{ response: string; responseTime: number }> => {
    const startTime = Date.now();

    // 1. Get agent details
    const agent = await ctx.runQuery(
      api.agents.getAgent,
      { agentId: args.agentId }
    );
    if (!agent) throw new ConvexError("Agent not found");
    if (!agent.isActive) throw new ConvexError("Agent is not active");
    if (!agent.systemPrompt) throw new ConvexError("Agent has no instructions yet. Open Settings and save a system prompt first.");

    // 2. Check message limit (agent owner)
    const user = await ctx.runQuery(
      api.users.getUserById,
      { userId: agent.userId as Id<"users"> }
    );
    const used = user ? (user.messagesUsed || 0) : 0;
    const limit = user ? (user.messagesLimit || 1000) : 1000;

    if (used >= limit) {
      throw new ConvexError(
        `Message limit complete. Tumne ${used} / ${limit} messages istemal kar liye. Ab is agent se baat karne ke liye plan upgrade karo ya billing cycle reset hone do.`
      );
    }

    // 3. Save user message
    await ctx.runMutation(
      api.chat.saveMessage,
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
        api.embeddings.searchRelevantChunks,
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
    // Accept both names — the dashboard key may be called GEMINI_API_KEY
    // or GOOGLE_API_KEY. Either one works.
    const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    if (!apiKey) {
      throw new ConvexError(
        "No Gemini API key found. Set GEMINI_API_KEY (or GOOGLE_API_KEY) in the Convex dashboard → Settings → Environment Variables → Production. This is not the same as any Vercel env var."
      );
    }

    // Try models in order. Google RETIRES old model names over time
    // (gemini-1.5 family now returns 404 — it no longer exists), and
    // individual endpoints sometimes return 503 under high demand. The
    // chain holds current, stable model IDs and a 404/429/5xx on one
    // model falls through to the next candidate. Override with the
    // GEMINI_MODEL env var to pin one specific model.
    const models = process.env.GEMINI_MODEL
      ? [process.env.GEMINI_MODEL]
      : [
          "gemini-2.5-flash", // stable workhorse
          "gemini-2.5-flash-lite", // cheapest, separate capacity
          "gemini-flash-latest", // alias that always points to the newest flash
        ];

    let geminiData: any = null;
    let lastError = "";

    for (const model of models) {
      let geminiResponse: Response;
      try {
        geminiResponse = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
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
      } catch (e: any) {
        lastError = `Network error calling Gemini (${model}): ${e?.message || String(e)}`;
        continue;
      }

      if (!geminiResponse.ok) {
        const errBody = await geminiResponse.text();
        const statusText = `${geminiResponse.status} ${geminiResponse.statusText}`;
        lastError = `Gemini API error (${statusText}) on ${model}: ${errBody.slice(0, 300)}`;

        // 404: model retired / not available for this key → try next model.
        // 429: per-model rate limit → next model has a separate bucket.
        // 5xx: temporary overload → next model.
        if (
          geminiResponse.status === 404 ||
          geminiResponse.status === 429 ||
          geminiResponse.status >= 500
        ) {
          continue;
        }

        // 400/401/403 are key/request problems — retrying other models
        // with the same key will not help. Surface the error immediately.
        throw new ConvexError(lastError);
      }

      geminiData = await geminiResponse.json();
      break;
    }

    let aiResponse =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // 6b. FALLBACK: OpenRouter (optional, zero-cost tier).
    // Agar saare Gemini models fail ho jayein AUR OpenRouter key set hai,
    // to wahi request OpenRouter ke free-model router pe jati hai.
    // Key na ho to ye block silently skip hota hai — Gemini hi primary rahta hai.
    if (!aiResponse && process.env.OPENROUTER_API_KEY) {
      const orKey = process.env.OPENROUTER_API_KEY;
      const orModels = ["openrouter/free", "openrouter/free"]; // second = one retry
      for (let i = 0; i < orModels.length; i++) {
        try {
          const orResp = await fetch(
            "https://openrouter.ai/api/v1/chat/completions",
            {
              method: "POST",
              headers: {
                Authorization: `Bearer ${orKey}`,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                model: orModels[i],
                messages: [
                  { role: "system", content: systemPrompt },
                  { role: "user", content: args.content },
                ],
                max_tokens: 1024,
                temperature: 0.7,
              }),
            }
          );

          if (orResp.ok) {
            const orData = await orResp.json();
            aiResponse = orData.choices?.[0]?.message?.content || "";
            if (aiResponse) break;
          } else {
            const orErr = await orResp.text();
            lastError += ` | OpenRouter fallback (${orResp.status}): ${orErr.slice(0, 200)}`;
            // 429 = free tier rate limit — thoda ruk kar ek retry.
            if (orResp.status === 429 && i === 0) {
              await new Promise((r) => setTimeout(r, 3000));
              continue;
            }
            break;
          }
        } catch (e: any) {
          lastError += ` | OpenRouter network error: ${e?.message || String(e)}`;
          break;
        }
      }
    }

    if (!aiResponse) {
      throw new ConvexError(
        lastError ||
          "AI providers failed to respond. Gemini models are busy/unavailable and no OpenRouter fallback key is configured."
      );
    }

    const responseTime = Date.now() - startTime;

    // 7. Save AI response
    await ctx.runMutation(
      api.chat.saveMessage,
      {
        conversationId: args.conversationId,
        role: "assistant",
        content: aiResponse,
        responseTime,
      }
    );

    // 8. Update message count
    await ctx.runMutation(
      api.chat.incrementMessageCount,
      { conversationId: args.conversationId }
    );

    // 9. Update user's messages used
    if (user) {
      await ctx.runMutation(
        api.chat.incrementUserMessagesUsed,
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

// ─── GET CONVERSATION (minimal public fields) ────────────
// Used by the embeddable widget's HTTP endpoints to resolve a
// conversation without exposing the full document to clients.
export const getConversation = query({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) return null;
    return {
      agentId: convo.agentId,
      visitorId: convo.visitorId,
      status: convo.status,
    };
  },
});

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

// ─── DELETE CONVERSATION ─────────────────────────────────
// Deletes a conversation and all of its messages (owned by the agent's
// owner only, so one user can't delete another user's conversations).
export const deleteConversation = mutation({
  args: { conversationId: v.id("conversations") },
  handler: async (ctx, args) => {
    const convo = await ctx.db.get(args.conversationId);
    if (!convo) throw new Error("Conversation not found");

    // Only the agent owner can delete
    const agent = await ctx.db.get(convo.agentId);
    if (!agent) throw new Error("Agent not found");

    const identity = await ctx.auth.getUserIdentity();
    const tokenId = identity?.subject ?? null;
    if (!tokenId) throw new Error("Not authenticated");

    const user = await ctx.db
      .query("users")
      .withIndex("by_tokenIdentifier", (q) => q.eq("tokenIdentifier", tokenId))
      .first();
    if (!user || agent.userId !== user._id) throw new Error("Not authorized");

    // Delete all messages in the conversation
    const msgs = await ctx.db
      .query("messages")
      .withIndex("by_conversationId", (q) =>
        q.eq("conversationId", args.conversationId)
      )
      .collect();
    for (const msg of msgs) {
      await ctx.db.delete(msg._id);
    }

    await ctx.db.delete(args.conversationId);
    return true;
  },
});
