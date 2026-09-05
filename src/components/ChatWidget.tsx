import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";

// Rehtys Landing Chat — smart rule-based assistant.
// Answers common questions WITHOUT any API call:
// pure frontend logic → zero cost, instant replies.

type Msg = {
  role: "user" | "agent";
  text: string;
  action?: { label: string; href: string };
};

const WELCOME: Omit<Msg, "role"> = {
  text: "Hi! 👋 I'm the Rehtys assistant. Ask me about pricing, the free trial, or how to build your own AI support agent.",
};

const SUGGESTIONS = [
  "What are your pricing plans?",
  "Is there a free trial?",
  "How do I create an agent?",
  "Can I embed it on my website?",
];

type BotReply = Omit<Msg, "role">;

// Keyword rules → answers. First matching rule wins.
const RULES: { patterns: RegExp[]; reply: BotReply }[] = [
  {
    patterns: [
      /\b(hi|hello|hey|salam|assalam|asalam|aoa|namaste|hola)\b/i,
      /^(good\s*(morning|evening|afternoon))/i,
    ],
    reply: {
      text: "Hello! 👋 Welcome to Rehtys. Ask me about pricing, the free trial, or how to build your own AI support agent.",
    },
  },
  {
    patterns: [/(price|pricing|plan|cost|how much|kitna|kitne|rate|subscription|charge|paise)/i],
    reply: {
      text: "We have 3 plans: Starter ($89/mo), Pro ($199/mo) and Business ($499/mo). Every plan includes a 14-day free trial — no credit card required. Full details are in the Pricing section below. 👇",
    },
  },
  {
    patterns: [/(trial|demo|test|free|maft)/i],
    reply: {
      text: "Yes! Every plan comes with a 14-day free trial — no credit card required. Create your account, build your first agent, and see it answer real customer questions before you pay anything.",
      action: { label: "Start free trial →", href: "/auth" },
    },
  },
  {
    patterns: [
      /(create|build|make|setup|set\s?up|banao|banana).*(agent|bot|assistant|chatbot)/i,
      /(agent|bot|assistant|chatbot).*(create|build|make|banao|kaise|how)/i,
    ],
    reply: {
      text: "It takes about 3 minutes: 1) Sign up, 2) Click \"Create Agent\" and give it a name + personality, 3) Add FAQs or documents so it knows your business. Your agent is live instantly.",
      action: { label: "Create your free account →", href: "/auth" },
    },
  },
  {
    patterns: [/(embed|widget|script|install|apni website|my website|landing page)/i],
    reply: {
      text: "Yes — every agent gets a unique embed code. Copy one <script> tag into your website and the same trained agent appears as a chat widget for your visitors. The embed dashboard is rolling out in the next update.",
    },
  },
  {
    patterns: [/(knowledge|document|upload|train|faq|file|paste|sikhao)/i],
    reply: {
      text: "Your agent's brain is its knowledge base. After creating an agent, open Knowledge Base and add FAQs or paste documents — the agent instantly starts answering from them (this is called RAG: Retrieval-Augmented Generation).",
    },
  },
  {
    patterns: [/(how.*(work|does|it)|kya hai|kaise|what is rehtys|who are you|rehtys.*kya)/i],
    reply: {
      text: "Rehtys lets you build an AI support agent trained on YOUR business. Upload your FAQs and documents, and the agent answers customer questions from that knowledge — in 95+ languages, 24/7, on your website.",
    },
  },
  {
    patterns: [/(feature|what can|rag|language|multilingual|zaban)/i],
    reply: {
      text: "Agents built with Rehtys can: answer from your own documents (RAG), speak 95+ languages, match your brand tone, and soon take actions like booking meetings. You monitor everything from your dashboard.",
    },
  },
  {
    patterns: [/(human|real person|support|contact|email|team|sales|baat karni)/i],
    reply: {
      text: "I'm the demo assistant, but a real human is one message away! Email support@rehtys.app and we'll reply within 24 hours. For a hands-on feel, try building an agent — it's free for 14 days.",
    },
  },
  {
    patterns: [/(thank|shukriya|great|awesome|nice|good job|perfect)/i],
    reply: {
      text: "You're most welcome! 🙌 Anything else you'd like to know — pricing, the trial, or how to create your first agent?",
    },
  },
  {
    patterns: [/^(bye|goodbye|khuda hafiz|allah hafiz|see you|alvida)/i],
    reply: {
      text: "Goodbye! 👋 Whenever you're ready, your first AI agent is just 3 minutes away. Come back anytime!",
    },
  },
];

function getReply(question: string): BotReply {
  for (const rule of RULES) {
    if (rule.patterns.some((p) => p.test(question))) return rule.reply;
  }
  return {
    text: "Good question! I'm the demo assistant, so I know Rehtys best — pricing, the free trial, building agents, and embedding on your website. Try one of those, or email support@rehtys.app for anything else. 😊",
  };
}

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const timers = useRef<number[]>([]);

  // Greet on first open
  useEffect(() => {
    if (!open) return;
    setMessages((current) => {
      if (current.length > 0) return current;
      setTyping(true);
      const t = window.setTimeout(() => {
        setTyping(false);
        setMessages([{ role: "agent", ...WELCOME }]);
      }, 600);
      timers.current.push(t);
      return current;
    });
  }, [open]);

  // Keep scrolled to bottom
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, typing, open]);

  // Cleanup pending timers on unmount
  useEffect(() => {
    return () => timers.current.forEach((t) => window.clearTimeout(t));
  }, []);

  const send = (raw?: string) => {
    const text = (raw ?? input).trim();
    if (!text || typing) return;
    setInput("");
    setMessages((m) => [...m, { role: "user", text }]);
    setTyping(true);
    const reply = getReply(text);
    const delay = 700 + Math.random() * 600;
    const t = window.setTimeout(() => {
      setTyping(false);
      setMessages((m) => [...m, { role: "agent", ...reply }]);
    }, delay);
    timers.current.push(t);
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close chat" : "Open chat"}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#2C2A72] to-[#8C7AE6] text-white flex items-center justify-center shadow-lg shadow-[#8C7AE6]/25 hover:shadow-xl hover:shadow-[#8C7AE6]/30 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
            >
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
            >
              <MessageCircle size={22} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-2rem)] bg-[#13112A] border border-[#1E1B3A] rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0D0B1A] to-[#13112A] p-4 border-b border-[#1E1B3A]">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C2A72] to-[#8C7AE6] flex items-center justify-center">
                  <Bot size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#D9DCE3]">
                    Rehtys AI Agent
                  </p>
                  <p className="text-xs text-[#8C7AE6]">● Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div
              ref={scrollRef}
              className="h-72 max-h-[55vh] overflow-y-auto p-4 space-y-3"
            >
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${
                    msg.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {msg.role === "agent" && (
                    <div className="w-6 h-6 rounded-full bg-[#8C7AE6]/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={12} className="text-[#8C7AE6]" />
                    </div>
                  )}
                  <div className="max-w-[80%]">
                    <div
                      className={`px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap ${
                        msg.role === "user"
                          ? "bg-[#8C7AE6]/15 text-[#D9DCE3] rounded-br-sm"
                          : "bg-white/5 text-[#B9BDC9] rounded-bl-sm"
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.action && (
                      <a
                        href={msg.action.href}
                        className="inline-block mt-2 text-xs font-medium text-[#8C7AE6] bg-[#8C7AE6]/10 hover:bg-[#8C7AE6]/20 border border-[#8C7AE6]/30 rounded-lg px-3 py-1.5 transition-colors"
                      >
                        {msg.action.label}
                      </a>
                    )}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User size={12} className="text-[#9CA3AF]" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-[#8C7AE6]/20 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-[#8C7AE6]" />
                  </div>
                  <div className="bg-white/5 rounded-xl px-4 py-3 flex gap-1">
                    <span className="typing-dot w-1.5 h-1.5 bg-[#8C7AE6] rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-[#8C7AE6] rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-[#8C7AE6] rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Suggestion chips (only while the conversation is fresh) */}
            {messages.length <= 1 && !typing && (
              <div className="px-3 pb-1 flex gap-2 overflow-x-auto">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    onClick={() => send(s)}
                    className="shrink-0 text-xs text-[#B9BDC9] bg-white/5 hover:bg-[#8C7AE6]/15 border border-[#1E1B3A] hover:border-[#8C7AE6]/40 rounded-full px-3 py-1.5 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-[#1E1B3A]">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
                className="flex gap-2"
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-[#1E1B3A] rounded-lg px-3 py-2 text-sm text-[#D9DCE3] placeholder:text-[#6B7280] focus:outline-none focus:border-[#8C7AE6]/50 min-w-0"
                />
                <button
                  type="submit"
                  disabled={!input.trim() || typing}
                  aria-label="Send message"
                  className="bg-[#8C7AE6] text-[#0D0B1A] hover:bg-[#8C7AE6]/90 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg w-9 h-9 flex items-center justify-center shrink-0 transition-colors"
                >
                  <Send size={14} />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
