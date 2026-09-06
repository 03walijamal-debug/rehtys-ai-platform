/*!
 * Rehtys Widget v1.1 (flat /api/* routes) — embeddable AI chat widget.
 * Drop this script on any website with:
 *
 *   <script
 *     src="https://YOUR-SITE/widget.js"
 *     data-rehtys-widget
 *     data-agent="agent_xxxxxxxxxxxxxxxx"
 *     data-convex-url="https://your-deployment.convex.site"
 *     data-title="My Assistant"
 *     data-primary-color="#8C7AE6"
 *     data-position="right"
 *     defer
 *   ></script>
 *
 * Zero dependencies — vanilla JS, inline styles, works on any page.
 */
(function () {
  "use strict";

  // ── Config ─────────────────────────────────────────────
  var script = document.querySelector("script[data-rehtys-widget]");
  if (!script) return;

  var AGENT_TOKEN = script.getAttribute("data-agent") || "";
  var CONVEX_URL = script.getAttribute("data-convex-url") || "";
  var TITLE = script.getAttribute("data-title") || "AI Assistant";
  var COLOR = script.getAttribute("data-primary-color") || "#8C7AE6";
  var POSITION = script.getAttribute("data-position") === "left" ? "left" : "right";
  var GREETING =
    script.getAttribute("data-greeting") ||
    "Hi! 👋 How can I help you today?";

  if (!AGENT_TOKEN || !CONVEX_URL) {
    console.error("[Rehtys Widget] data-agent and data-convex-url are required.");
    return;
  }

  // ── Helpers ────────────────────────────────────────────
  function post(path, body) {
    return fetch(CONVEX_URL + path, {
      method: "POST",
      // text/plain = "simple request" → no CORS preflight
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify(body),
    }).then(function (r) {
      return r.text().then(function (t) {
        var data = {};
        try { data = JSON.parse(t); } catch (e) {}
        if (!r.ok) {
          var err = new Error(data.error || "Request failed (" + r.status + ")");
          err.status = r.status;
          throw err;
        }
        return data;
      });
    });
  }

  function get(path) {
    return fetch(CONVEX_URL + path).then(function (r) {
      return r.text().then(function (t) {
        var data = {};
        try { data = JSON.parse(t); } catch (e) {}
        if (!r.ok) {
          var err = new Error(data.error || "Request failed (" + r.status + ")");
          err.status = r.status;
          throw err;
        }
        return data;
      });
    });
  }

  function uuid() {
    if (window.crypto && window.crypto.randomUUID) {
      return window.crypto.randomUUID();
    }
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
      var r = (Math.random() * 16) | 0;
      var v = c === "x" ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  function visitorId() {
    var key = "rehtys:visitor:" + AGENT_TOKEN;
    var id = localStorage.getItem(key);
    if (!id) {
      id = uuid();
      localStorage.setItem(key, id);
    }
    return id;
  }

  function convoKey() { return "rehtys:convo:" + AGENT_TOKEN; }

  function esc(text) {
    var div = document.createElement("div");
    div.textContent = text == null ? "" : String(text);
    return div.innerHTML;
  }

  // ── Styles ─────────────────────────────────────────────
  var style = document.createElement("style");
  style.textContent =
    ".rehtys-fab{position:fixed;bottom:20px;" + (POSITION === "left" ? "left:20px;" : "right:20px;") +
    "z-index:2147483000;width:58px;height:58px;border-radius:50%;border:none;cursor:pointer;" +
    "box-shadow:0 6px 24px rgba(0,0,0,.28);display:flex;align-items:center;justify-content:center;" +
    "transition:transform .15s ease;color:#fff;}" +
    ".rehtys-fab:hover{transform:scale(1.08);}" +
    ".rehtys-fab svg{width:26px;height:26px;}" +
    ".rehtys-panel{position:fixed;bottom:90px;" + (POSITION === "left" ? "left:20px;" : "right:20px;") +
    "z-index:2147483001;width:370px;max-width:calc(100vw - 28px);height:540px;max-height:calc(100vh - 130px);" +
    "display:flex;flex-direction:column;border-radius:16px;overflow:hidden;" +
    "background:#0f1120;color:#e8eaf2;box-shadow:0 16px 60px rgba(0,0,0,.4);" +
    "border:1px solid rgba(255,255,255,.08);font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;" +
    "animation:rehtysPop .18s ease-out;}" +
    "@keyframes rehtysPop{from{opacity:0;transform:translateY(12px) scale(.97);}to{opacity:1;transform:none;}}" +
    ".rehtys-head{display:flex;align-items:center;gap:11px;padding:14px 16px;" +
    "background:linear-gradient(135deg,#171a30,#0f1120);border-bottom:1px solid rgba(255,255,255,.07);}" +
    ".rehtys-avatar{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;" +
    "color:#fff;font-weight:700;font-size:16px;flex-shrink:0;}" +
    ".rehtys-head-t{flex:1;min-width:0;}" +
    ".rehtys-title{font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}" +
    ".rehtys-status{font-size:11px;opacity:.7;display:flex;align-items:center;gap:5px;}" +
    ".rehtys-dot{width:7px;height:7px;border-radius:50%;background:#34d399;display:inline-block;}" +
    ".rehtys-x{border:none;background:none;color:#9aa0b4;cursor:pointer;font-size:18px;line-height:1;padding:4px;}" +
    ".rehtys-x:hover{color:#fff;}" +
    ".rehtys-body{flex:1;overflow-y:auto;padding:14px;display:flex;flex-direction:column;gap:10px;" +
    "scrollbar-width:thin;scrollbar-color:rgba(255,255,255,.15) transparent;}" +
    ".rehtys-bubble{max-width:82%;padding:9px 13px;border-radius:14px;font-size:13.5px;line-height:1.5;" +
    "white-space:pre-wrap;word-wrap:break-word;animation:rehtysPop .15s ease-out;}" +
    ".rehtys-bot{align-self:flex-start;background:rgba(255,255,255,.07);border-bottom-left-radius:4px;}" +
    ".rehtys-user{align-self:flex-end;color:#fff;border-bottom-right-radius:4px;}" +
    ".rehtys-typing{display:flex;gap:4px;align-items:center;padding:12px 14px;}" +
    ".rehtys-typing span{width:7px;height:7px;border-radius:50%;background:#9aa0b4;animation:rehtysBlink 1s infinite;}" +
    ".rehtys-typing span:nth-child(2){animation-delay:.15s;}" +
    ".rehtys-typing span:nth-child(3){animation-delay:.3s;}" +
    "@keyframes rehtysBlink{0%,80%,100%{opacity:.3;}40%{opacity:1;}}" +
    ".rehtys-foot{display:flex;gap:8px;padding:10px 12px;border-top:1px solid rgba(255,255,255,.07);}" +
    ".rehtys-input{flex:1;min-width:0;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);" +
    "border-radius:10px;padding:10px 12px;color:#e8eaf2;font-size:13.5px;outline:none;}" +
    ".rehtys-input:focus{border-color:" + COLOR + ";}" +
    ".rehtys-input::placeholder{color:#6b7085;}" +
    ".rehtys-send{border:none;border-radius:10px;padding:0 16px;cursor:pointer;color:#fff;font-weight:600;font-size:13px;" +
    "transition:opacity .15s;}" +
    ".rehtys-send:disabled{opacity:.4;cursor:not-allowed;}" +
    ".rehtys-err{padding:12px 14px;font-size:13px;line-height:1.5;color:#fca5a5;" +
    "background:rgba(239,68,68,.1);border:1px solid rgba(239,68,68,.25);border-radius:12px;margin:10px;}" +
    "@media(max-width:480px){.rehtys-panel{bottom:80px;height:calc(100vh - 110px);}}";
  document.head.appendChild(style);

  // ── DOM ────────────────────────────────────────────────
  var FAB_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>';
  var X_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  var fab = document.createElement("button");
  fab.className = "rehtys-fab";
  fab.style.background = COLOR;
  fab.setAttribute("aria-label", "Open chat");
  fab.innerHTML = FAB_ICON;

  var panel = document.createElement("div");
  panel.className = "rehtys-panel";
  panel.style.display = "none";
  panel.innerHTML =
    '<div class="rehtys-head">' +
    '<div class="rehtys-avatar" style="background:' + COLOR + '">' + esc((TITLE || "A").charAt(0).toUpperCase()) + "</div>" +
    '<div class="rehtys-head-t">' +
    '<div class="rehtys-title">' + esc(TITLE) + "</div>" +
    '<div class="rehtys-status"><span class="rehtys-dot"></span>Online</div>' +
    "</div>" +
    '<button class="rehtys-x" aria-label="Close chat">' + X_ICON + "</button>" +
    "</div>" +
    '<div class="rehtys-body"></div>' +
    '<div class="rehtys-foot">' +
    '<input class="rehtys-input" type="text" placeholder="Type a message..." autocomplete="off" />' +
    '<button class="rehtys-send" style="background:' + COLOR + '" disabled>Send</button>' +
    "</div>";

  document.body.appendChild(fab);
  document.body.appendChild(panel);

  var bodyEl = panel.querySelector(".rehtys-body");
  var inputEl = panel.querySelector(".rehtys-input");
  var sendBtn = panel.querySelector(".rehtys-send");
  var closeBtn = panel.querySelector(".rehtys-x");

  // ── State ──────────────────────────────────────────────
  var open = false;
  var loaded = false;
  var busy = false;
  var agentInfo = null;

  function bubble(role, text) {
    var b = document.createElement("div");
    b.className = "rehtys-bubble " + (role === "user" ? "rehtys-user" : "rehtys-bot");
    b.style.background = role === "user" ? COLOR : "";
    b.textContent = text;
    bodyEl.appendChild(b);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return b;
  }

  function typingBubble() {
    var t = document.createElement("div");
    t.className = "rehtys-typing rehtys-bubble rehtys-bot";
    t.innerHTML = "<span></span><span></span><span></span>";
    bodyEl.appendChild(t);
    bodyEl.scrollTop = bodyEl.scrollHeight;
    return t;
  }

  function showError(message) {
    var existing = panel.querySelector(".rehtys-err");
    if (existing) existing.remove();
    var e = document.createElement("div");
    e.className = "rehtys-err";
    e.textContent = message;
    panel.insertBefore(e, panel.querySelector(".rehtys-foot"));
  }

  function loadHistory(conversationId) {
    return get(
      "/api/messages/" + encodeURIComponent(conversationId) +
      "?visitorId=" + encodeURIComponent(visitorId())
    ).then(function (data) {
      (data.messages || []).forEach(function (m) {
        if (m.role === "user" || m.role === "assistant") {
          bubble(m.role === "user" ? "user" : "bot", m.content);
        }
      });
    });
  }

  var convoPromise = null;
  function ensureConversation() {
    var existing = localStorage.getItem(convoKey());
    if (existing) return Promise.resolve(existing);
    // If a create request is already in flight (widget just opened and the
    // visitor instantly sends a message), reuse it instead of creating two.
    if (convoPromise) return convoPromise;
    convoPromise = post(
      "/api/create-conversation/" + encodeURIComponent(AGENT_TOKEN),
      { visitorId: visitorId() }
    )
      .then(function (data) {
        localStorage.setItem(convoKey(), data.conversationId);
        return data.conversationId;
      })
      .catch(function (err) {
        convoPromise = null;
        throw err;
      });
    return convoPromise;
  }

  function openPanel() {
    open = true;
    panel.style.display = "flex";
    fab.innerHTML = X_ICON;
    if (loaded) return;
    loaded = true;

    bubble("bot", GREETING);

    if (!agentInfo) {
      get("/api/agent/" + encodeURIComponent(AGENT_TOKEN))
        .then(function (info) {
          agentInfo = info;
          var titleEl = panel.querySelector(".rehtys-title");
          if (info.name && titleEl) titleEl.textContent = info.name;
        })
        .catch(function () { /* widget still works */ });
    }

    ensureConversation()
      .then(function (conversationId) {
        return loadHistory(conversationId);
      })
      .catch(function (err) {
        showError(err.message || "Could not start the conversation.");
      });
  }

  function closePanel() {
    open = false;
    panel.style.display = "none";
    fab.innerHTML = FAB_ICON;
  }

  function send(text) {
    var content = (text != null ? text : inputEl.value).trim();
    if (!content || busy || !open) return;
    inputEl.value = "";
    sendBtn.disabled = true;

    bubble("user", content);
    var typing = typingBubble();
    busy = true;

    ensureConversation()
      .then(function (conversationId) {
        return post(
          "/api/message/" + encodeURIComponent(conversationId),
          { visitorId: visitorId(), content: content }
        );
      })
      .then(function (data) {
        typing.remove();
        bubble("bot", data.response || "…");
      })
      .catch(function (err) {
        typing.remove();
        showError(err.message || "The assistant is busy. Please try again.");
      })
      .finally(function () {
        busy = false;
        sendBtn.disabled = !inputEl.value.trim();
      });
  }

  // ── Events ─────────────────────────────────────────────
  fab.addEventListener("click", function () {
    if (open) closePanel();
    else openPanel();
  });

  closeBtn.addEventListener("click", closePanel);

  sendBtn.addEventListener("click", function () { send(); });

  inputEl.addEventListener("keydown", function (e) {
    if (e.key === "Enter") { e.preventDefault(); send(); }
  });

  inputEl.addEventListener("input", function () {
    sendBtn.disabled = !inputEl.value.trim() || busy;
  });
})();
