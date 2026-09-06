import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// ─────────────────────────────────────────────────────────
// PUBLIC WIDGET API (v2 — flat routes)
// IMPORTANT: every dynamic path parameter is the LAST segment
// (e.g. /api/agent/:embedToken). Nested params like
// /widget/agent/:token/conversation are avoided on purpose.
//
// /health is a diagnostic route: if it returns 200 the router is
// deployed; if the agent route 404s while /health works, the issue
// is route matching, not deployment.
// ─────────────────────────────────────────────────────────

function jsonHeaders(): Headers {
  return new Headers({
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
}

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), { status, headers: jsonHeaders() });
}

function jsonError(status: number, message: string): Response {
  return jsonResponse({ error: message }, status);
}

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

function lastSegment(pathname: string): string {
  return pathname.split("/").filter(Boolean).pop() ?? "";
}

const http = httpRouter();

// ─── GET /health ─────────────────────────────────────────
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({ ok: true, service: "rehtys-widget-api", time: Date.now() });
  }),
});

// ─── GET /api/agent/:embedToken ──────────────────────────
http.route({
  path: "/api/agent/:embedToken",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const embedToken = lastSegment(new URL(request.url).pathname);
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

// ─── POST /api/create-conversation/:embedToken ───────────
http.route({
  path: "/api/create-conversation/:embedToken",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const embedToken = lastSegment(new URL(request.url).pathname);
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

// ─── GET /api/messages/:conversationId?visitorId=... ─────
http.route({
  path: "/api/messages/:conversationId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const conversationId = lastSegment(url.pathname);
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

// ─── POST /api/message/:conversationId ───────────────────
http.route({
  path: "/api/message/:conversationId",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const conversationId = lastSegment(new URL(request.url).pathname);
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
