import { useState } from "react";
import { motion } from "framer-motion";
import { X, Copy, Check, Code2, ExternalLink } from "lucide-react";

type EmbedModalProps = {
  agent: { _id: string; name: string; embedToken: string };
  onClose: () => void;
};

function escapeAttr(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default function EmbedModal({ agent, onClose }: EmbedModalProps) {
  const [copied, setCopied] = useState(false);

  // HTTP actions live on the *.convex.site URL (not *.convex.cloud).
  // Vercel's Convex integration sets VITE_CONVEX_SITE_URL for us.
  const convexUrl =
    (import.meta.env.VITE_CONVEX_SITE_URL as string) ||
    (import.meta.env.VITE_CONVEX_URL as string);
  const widgetSrc = `${window.location.origin}/widget.js`;

  const snippet = `<script
  src="${widgetSrc}"
  data-rehtys-widget
  data-agent="${escapeAttr(agent.embedToken)}"
  data-convex-url="${escapeAttr(convexUrl)}"
  data-title="${escapeAttr(agent.name)}"
  data-primary-color="#8C7AE6"
  data-position="right"
  defer
></script>`;

  const previewHtml = `<!doctype html><html><head><meta charset="utf-8"><title>Preview</title></head>
<body style="margin:0;min-height:100vh;background:linear-gradient(135deg,#1e1b4b,#0f0a2e);font-family:sans-serif;display:flex;align-items:center;justify-content:center;">
  <div style="text-align:center;color:#c7d2fe;max-width:420px;padding:24px;">
    <div style="font-size:28px;font-weight:700;color:#fff;margin-bottom:10px;">Your website here</div>
    <div style="font-size:14px;line-height:1.7;opacity:.8;">This is a live preview of the widget. Click the chat button below and ask your agent a question — exactly how your visitors will experience it.</div>
  </div>
  ${snippet}
</body></html>`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(snippet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers / non-secure contexts
      const ta = document.createElement("textarea");
      ta.value = snippet;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 pb-4 border-b border-slate-800">
          <div>
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Code2 className="w-5 h-5 text-cyan-400" />
              Embed "{agent.name}"
            </h2>
            <p className="text-slate-400 text-sm mt-1">
              Put this agent on any website with one script tag
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Steps */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { n: "1", t: "Copy the code", d: "Click the copy button on the right" },
              { n: "2", t: "Paste in your site", d: "Right before </body> in your HTML" },
              { n: "3", t: "Done", d: "Your trained agent appears as a chat widget" },
            ].map((s) => (
              <div key={s.n} className="bg-slate-800/50 border border-slate-800 rounded-xl p-4">
                <div className="w-7 h-7 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 flex items-center justify-center text-sm font-bold mb-2">
                  {s.n}
                </div>
                <p className="text-white text-sm font-semibold">{s.t}</p>
                <p className="text-slate-400 text-xs mt-1 leading-relaxed">{s.d}</p>
              </div>
            ))}
          </div>

          {/* Code + copy */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-slate-300">Embed code</p>
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center gap-2 ${
                  copied
                    ? "bg-green-500/15 text-green-400 border border-green-500/30"
                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy code
                  </>
                )}
              </button>
            </div>
            <pre className="bg-[#0B1120] border border-slate-800 rounded-xl p-4 text-xs text-cyan-200/90 overflow-x-auto leading-relaxed whitespace-pre-wrap break-all">
{snippet}
            </pre>
          </div>

          {/* Live preview */}
          <div>
            <p className="text-sm font-medium text-slate-300 mb-2 flex items-center gap-2">
              <ExternalLink className="w-4 h-4 text-slate-500" />
              Live preview
            </p>
            <div className="rounded-xl overflow-hidden border border-slate-800 h-[380px]">
              <iframe
                title="Widget preview"
                srcDoc={previewHtml}
                className="w-full h-full bg-slate-950"
                sandbox="allow-scripts allow-same-origin allow-forms"
              />
            </div>
          </div>

          <p className="text-xs text-slate-500 leading-relaxed">
            Tip: visitors keep the same conversation when they come back — no login needed. You can
            watch every visitor conversation in the dashboard's Chat tab.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
