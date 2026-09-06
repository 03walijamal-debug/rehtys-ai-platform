import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

// ─────────────────────────────────────────────────────────
// PUBLIC WIDGET API (v3 — catch-all /api/* dispatcher)
//
// WHY v3: v2 used Convex path parameters ("/api/agent/:embedToken").
// On the production deployment those routes returned "No matching
// routes found" even though /health (a static route in the same
// router) returned 200 — the router was deployed but parameter
// matching never ran. v3 avoids parameter syntax entirely: ONE
// catch-all route with a static pathPrefix receives every /api/*
// request and dispatches on the raw pathname. Same external URLs,
// works on every Convex version.
//
// External API (unchanged from v2):
//   GET  /health
//   GET  /api/agent/:embedToken
//   POST /api/create-conversation/:embedToken
//   GET  /api/messages/:conversationId?visitorId=...
//   POST /api/message/:conversationId
//
// CORS: every response carries Access-Control-Allow-Origin: * so the
// widget works from any website. The widget sends POST bodies as
// text/plain JSON, which browsers treat as a "simple request" — no
// preflight (OPTIONS) needed. Unknown /api/* paths also get CORS
// headers, so failures always reach the widget as a readable error
// instead of an opaque CORS block.
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

// "/api/agent/tok123" → { action: "agent", id: "tok123" }
function parseApiPath(pathname: string): { action: string; id: string } {
  const parts = pathname.split("/").filter(Boolean); // ["api", "agent", "tok123"]
  return { action: parts[1] ?? "", id: parts.slice(2).join("/") };
}

const http = httpRouter();

// ─── GET /health ─────────────────────────────────────────
// Diagnostic: proves the HTTP router itself is deployed. The version
// field lets us confirm from the outside which http.ts is live.
http.route({
  path: "/health",
  method: "GET",
  handler: httpAction(async () => {
    return jsonResponse({
      ok: true,
      service: "rehtys-widget-api",
      version: 3,
      time: Date.now(),
    });
  }),
});

// ─── Catch-all GET /api/* ────────────────────────────────
http.route({
  pathPrefix: "/api/",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const { action, id } = parseApiPath(url.pathname);

    // GET /api/agent/:embedToken — public agent info
    if (action === "agent" && id) {
      const agent = await ctx.runQuery(api.agents.getAgentByEmbedToken, {
        embedToken: id,
      });
      if (!agent) return jsonError(404, "Agent not found or inactive");
      return jsonResponse({
        id: agent._id,
        name: agent.name,
        description: agent.description,
        isActive: agent.isActive,
        language: agent.language || "English",
      });
    }

    // GET /api/messages/:conversationId?visitorId=... — history
    if (action === "messages" && id) {
      const visitorId = url.searchParams.get("visitorId") || "";
      const conversation = await ctx.runQuery(api.chat.getConversation, {
        conversationId: id as any,
      });
      if (!conversation) return jsonError(404, "Conversation not found");
      if (conversation.visitorId !== visitorId) {
        return jsonError(403, "Not authorized");
      }
      const messages = await ctx.runQuery(api.chat.getConversationMessages, {
        conversationId: id as any,
      });
      return jsonResponse({
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
          createdAt: m.createdAt,
        })),
      });
    }

    return jsonError(404, `Unknown API route: ${url.pathname}`);
  }),
});

// ─── Catch-all POST /api/* ───────────────────────────────
http.route({
  pathPrefix: "/api/",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const url = new URL(request.url);
    const { action, id } = parseApiPath(url.pathname);

    // POST /api/create-conversation/:embedToken
    // Body: { visitorId, visitorName?, visitorEmail? }
    if (action === "create-conversation" && id) {
      const agent = await ctx.runQuery(api.agents.getAgentByEmbedToken, {
        embedToken: id,
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
    }

    // POST /api/message/:conversationId
    // Body: { visitorId, content } — same pipeline as the dashboard
    // chat (RAG + Gemini + OpenRouter fallback + quota check).
    if (action === "message" && id) {
      const body = await readJson(request);
      const visitorId = String(body.visitorId || "").slice(0, 128);
      const content = String(body.content || "").slice(0, 2000).trim();
      if (!visitorId) return jsonError(400, "visitorId is required");
      if (!content) return jsonError(400, "content is required");

      const conversation = await ctx.runQuery(api.chat.getConversation, {
        conversationId: id as any,
      });
      if (!conversation) return jsonError(404, "Conversation not found");
      if (conversation.visitorId !== visitorId) {
        return jsonError(403, "Not authorized");
      }

      try {
        const result = await ctx.runAction(api.chat.sendMessage, {
          agentId: conversation.agentId,
          conversationId: id as any,
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
    }

    return jsonError(404, `Unknown API route: ${url.pathname}`);
  }),
});

// ─── OPTIONS /api/* (preflight safety) ───────────────────
http.route({
  pathPrefix: "/api/",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, { status: 204, headers: jsonHeaders() });
  }),
});

export default http;
