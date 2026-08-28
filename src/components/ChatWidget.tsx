"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";

const demoMessages = [
  { role: "user" as const, text: "How do I reset my password?" },
  { role: "agent" as const, text: "I can help with that! Go to Settings → Security → Reset Password. You'll receive an email with a secure link." },
  { role: "user" as const, text: "What are your pricing plans?" },
  { role: "agent" as const, text: "We offer Starter ($89/mo), Pro ($199/mo), and Business ($499/mo) plans. All include a 14-day free trial!" },
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [visibleCount, setVisibleCount] = useState(0);
  const [typing, setTyping] = useState(false);

  const handleOpen = () => {
    setOpen(true);
    if (visibleCount === 0) {
      setTyping(true);
      setTimeout(() => {
        setVisibleCount(1);
        setTyping(false);
        setTimeout(() => {
          setTyping(true);
          setTimeout(() => {
            setVisibleCount(2);
            setTyping(false);
          }, 1200);
        }, 800);
      }, 1000);
    }
  };

  return (
    <>
      {/* Floating Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={open ? () => setOpen(false) : handleOpen}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] text-[#0B1120] flex items-center justify-center shadow-lg shadow-[#00E5FF]/25 hover:shadow-xl hover:shadow-[#00E5FF]/30 transition-shadow"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X size={22} />
            </motion.div>
          ) : (
            <motion.div key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
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
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-3rem)] bg-[#111827] border border-white/10 rounded-2xl shadow-2xl shadow-black/40 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0B1120] to-[#111827] p-4 border-b border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] flex items-center justify-center">
                  <Bot size={16} className="text-[#0B1120]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rehtys AI Agent</p>
                  <p className="text-xs text-[#00E5FF]">● Online</p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-64 overflow-y-auto p-4 space-y-3">
              {demoMessages.slice(0, visibleCount).map((msg, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "agent" && (
                    <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0 mt-1">
                      <Bot size={12} className="text-[#00E5FF]" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed ${
                      msg.role === "user"
                        ? "bg-[#00E5FF]/15 text-white rounded-br-sm"
                        : "bg-white/5 text-gray-300 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                  {msg.role === "user" && (
                    <div className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center shrink-0 mt-1">
                      <User size={12} className="text-gray-400" />
                    </div>
                  )}
                </motion.div>
              ))}
              {typing && (
                <div className="flex gap-2 items-center">
                  <div className="w-6 h-6 rounded-full bg-[#00E5FF]/20 flex items-center justify-center shrink-0">
                    <Bot size={12} className="text-[#00E5FF]" />
                  </div>
                  <div className="bg-white/5 rounded-xl px-4 py-3 flex gap-1">
                    <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                    <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <div className="p-3 border-t border-white/5">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask me anything..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-500 focus:outline-none focus:border-[#00E5FF]/50"
                  readOnly
                />
                <Button size="icon" className="bg-[#00E5FF] text-[#0B1120] hover:bg-[#00E5FF]/90 shrink-0" disabled>
                  <Send size={14} />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
