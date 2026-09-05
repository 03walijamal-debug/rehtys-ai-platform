import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// ─────────────────────────────────────────────────────────
// PUBLIC WIDGET API
// The embeddable chat widget (public/widget.js) talks to these
// unauthenticated HTTP endpoints. They expose only what a visitor on a
// customer's website needs: agent info, creating a conversation,
// sending a message, and reading the conversation history.
//
// CORS: every response carries Access-Control-Allow-Origin: * so the
// widget works from any website. The widget sends POST bodies as
// text/plain JSON, which browsers treat as a "simple request" — no
// preflight (OPTIONS) needed.
// ─────────────────────────────────────────────────────────

function jsonHeaders(): Headers {
  const headers = new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  return headers;
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: jsonHeaders(),
  });
}

function jsonError(status: number, message: string): Response {
  return jsonResponse({ error: message }, status);
}

// The widget posts JSON with Content-Type: text/plain (to skip CORS
// preflight), so parse from the raw text instead of request.json().
async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const text = await request.text();
    if (!text) return {};
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const http = httpRouter();

// ─── GET /widget/agent/:embedToken ───────────────────────
// Public info about an agent. Only active agents are returned.
http.route({
  path: "/widget/agent/:embedToken",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const path = new URL(request.url).pathname;
    const parts = path.split("/").filter(Boolean); // ["widget","agent","<token>"]
    const embedToken = parts[2];
    if (!embedToken) return jsonError(400, "Missing embed token");

    const agent = await ctx.runQuery(api.agents.getAgentByEmbedToken, {
      embedToken,
    });
    if (!agent) return jsonError(404, "Agent not found or inactive");

    return jsonResponse({
      id: agent._id,
      name: agent.name,
      description: agent.description,
      isActive: agent.isActive,
      language: agent.language || "English",
    });
  }),
});

// ─── POST /widget/agent/:embedToken/conversation ─────────
// Body: { visitorId, visitorName?, visitorEmail? }
// Creates (or returns) a conversation for a visitor.
http.route({
  path: "/widget/agent/:embedToken/conversation",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const path = new URL(request.url).pathname;
    const parts = path.split("/").filter(Boolean);
    const embedToken = parts[2];
    if (!embedToken) return jsonError(400, "Missing embed token");

    const agent = await ctx.runQuery(api.agents.getAgentByEmbedToken, {
      embedToken,
    });
    if (!agent) return jsonError(404, "Agent not found or inactive");

    const body = await readJson(request);
    const visitorId = String(body.visitorId || "").slice(0, 128);
    if (!visitorId) return jsonError(400, "visitorId is required");

    const conversationId = await ctx.runMutation(
      api.chat.createConversation,
      {
        agentId: agent._id,
        visitorId,
        visitorName: body.visitorName
          ? String(body.visitorName).slice(0, 100)
          : undefined,
        visitorEmail: body.visitorEmail
          ? String(body.visitorEmail).slice(0, 200)
          : undefined,
      }
    );

    return jsonResponse({ conversationId });
  }),
});

// ─── GET /widget/conversation/:conversationId?visitorId= ─
// Message history for a conversation (only if the visitor owns it).
http.route({
  path: "/widget/conversation/:conversationId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const conversationId = parts[2];
    const visitorId = url.searchParams.get("visitorId") || "";
    if (!conversationId) return jsonError(400, "Missing conversation id");

    const conversation = await ctx.runQuery(
      api.chat.getConversation,
      { conversationId: conversationId as any }
    );
    if (!conversation) return jsonError(404, "Conversation not found");
    if (conversation.visitorId !== visitorId) {
      return jsonError(403, "Not authorized");
    }

    const messages = await ctx.runQuery(
      api.chat.getConversationMessages,
      { conversationId: conversationId as any }
    );

    return jsonResponse({
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        createdAt: m.createdAt,
      })),
    });
  }),
});

// ─── POST /widget/conversation/:conversationId/message ───
// Body: { visitorId, content }
// Sends a message through the same pipeline as the dashboard chat
// (RAG + Gemini + OpenRouter fallback + quota check).
http.route({
  path: "/widget/conversation/:conversationId/message",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const parts = url.pathname.split("/").filter(Boolean);
    const conversationId = parts[2];
    if (!conversationId) return jsonError(400, "Missing conversation id");

    const body = await readJson(request);
    const visitorId = String(body.visitorId || "").slice(0, 128);
    const content = String(body.content || "").slice(0, 2000).trim();
    if (!visitorId) return jsonError(400, "visitorId is required");
    if (!content) return jsonError(400, "content is required");

    const conversation = await ctx.runQuery(
      api.chat.getConversation,
      { conversationId: conversationId as any }
    );
    if (!conversation) return jsonError(404, "Conversation not found");
    if (conversation.visitorId !== visitorId) {
      return jsonError(403, "Not authorized");
    }

    try {
      const result = await ctx.runAction(api.chat.sendMessage, {
        agentId: conversation.agentId,
        conversationId: conversationId as any,
        content,
      });
      return jsonResponse(result);
    } catch (error: any) {
      const message =
        error?.message ||
        error?.data?.message ||
        "The assistant is busy right now. Please try again in a moment.";
      return jsonError(500, message);
    }
  }),
});

export default http;
