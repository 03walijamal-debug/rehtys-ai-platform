import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  Bot,
  User,
  Plus,
  MessageSquare,
  Loader2,
  ArrowLeft,
  Clock,
  Zap,
  ChevronLeft,
  AlertCircle,
} from "lucide-react";

export default function ChatPage() {
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | null>(null);
  const [selectedConversationId, setSelectedConversationId] = useState<Id<"conversations"> | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  // Mobile: which pane to show (Claude/ChatGPT-style). Desktop shows both.
  const [mobilePane, setMobilePane] = useState<"list" | "chat">("list");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Convex queries
  const agents = useQuery(api.agents.getMyAgents) ?? [];
  const conversations = useQuery(
    api.chat.getAgentConversations,
    selectedAgentId ? { agentId: selectedAgentId } : "skip"
  ) ?? [];
  const messages = useQuery(
    api.chat.getConversationMessages,
    selectedConversationId ? { conversationId: selectedConversationId } : "skip"
  ) ?? [];

  // Convex mutations + actions
  const createConversation = useMutation(api.chat.createConversation);
  const sendMessage = useAction(api.chat.sendMessage);

  const selectedAgent = agents.find((a) => a._id === selectedAgentId);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleNewConversation = async () => {
    if (!selectedAgentId) return;
    setErrorMsg(null);
    try {
      const convId = await createConversation({
        agentId: selectedAgentId,
        visitorId: "dashboard-owner",
        visitorName: "Dashboard Owner",
      });
      setSelectedConversationId(convId);
      setMobilePane("chat");
    } catch (error: any) {
      setErrorMsg(error?.data || error?.message || "Failed to create conversation");
    }
  };

  const handleSendMessage = async () => {
    if (!messageInput.trim() || !selectedAgentId || isSending) return;
    const content = messageInput.trim();

    // Auto-create a conversation if none is open yet
    let convId = selectedConversationId;
    if (!convId) {
      try {
        convId = await createConversation({
          agentId: selectedAgentId,
          visitorId: "dashboard-owner",
          visitorName: "Dashboard Owner",
        });
        setSelectedConversationId(convId);
      } catch (error: any) {
        setErrorMsg(error?.data || error?.message || "Failed to start conversation");
        return;
      }
    }

    setMessageInput("");
    setIsSending(true);
    setErrorMsg(null);

    try {
      await sendMessage({
        agentId: selectedAgentId,
        conversationId: convId,
        content,
      });
    } catch (error: any) {
      setErrorMsg(error?.data || error?.message || "Failed to send message");
      setMessageInput(content);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToAgents = () => {
    setSelectedAgentId(null);
    setSelectedConversationId(null);
    setMobilePane("list");
    setErrorMsg(null);
  };

  // ─── VIEW 1: Select Agent ──────────────────────────────
  if (!selectedAgentId) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Chat</h1>
          <p className="text-slate-400 mt-1">Select an agent to start chatting</p>
        </div>

        {agents.length === 0 ? (
          <div className="text-center py-12">
            <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-slate-400">Create an agent first to start chatting</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {agents.map((agent, index) => (
              <motion.button
                key={agent._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => setSelectedAgentId(agent._id)}
                className="bg-slate-900 border border-slate-800 rounded-2xl p-5 text-left hover:border-cyan-500/50 hover:bg-slate-900/80 transition-all"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                    <Bot className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold">{agent.name}</h3>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        agent.isActive
                          ? "bg-green-500/10 text-green-400"
                          : "bg-red-500/10 text-red-400"
                      }`}
                    >
                      {agent.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </div>
                <p className="text-slate-400 text-sm line-clamp-2">{agent.description}</p>
                <div className="mt-3 flex items-center gap-2 text-cyan-400 text-sm font-medium">
                  <MessageSquare className="w-4 h-4" />
                  Open Chat →
                </div>
              </motion.button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── VIEW 2: Chat Interface (mobile pane-switching) ────
  return (
    <div className="flex flex-col md:flex-row h-[calc(100dvh-7rem)] md:h-[calc(100vh-8rem)] gap-4">
      {/* Conversations List / Sidebar */}
      <div
        className={`w-full md:w-72 md:shrink-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col ${
          mobilePane === "chat" ? "hidden md:flex" : "flex"
        }`}
      >
        {/* Agent Header */}
        <div className="p-4 border-b border-slate-800">
          <button
            onClick={handleBackToAgents}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-3"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">All Agents</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-white font-semibold text-sm">{selectedAgent?.name}</h3>
              <span className="text-green-400 text-xs">Online</span>
            </div>
          </div>
        </div>

        {/* New Conversation Button */}
        <div className="p-3">
          <button
            onClick={handleNewConversation}
            className="w-full px-4 py-2 bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-400 border border-cyan-500/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Conversation
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2">
          {conversations.length === 0 ? (
            <p className="text-slate-500 text-sm text-center py-4">
              No conversations yet
            </p>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv._id}
                onClick={() => {
                  setSelectedConversationId(conv._id);
                  setMobilePane("chat");
                }}
                className={`w-full p-3 rounded-xl text-left transition-colors ${
                  selectedConversationId === conv._id
                    ? "bg-cyan-500/10 border border-cyan-500/20"
                    : "bg-slate-800/50 hover:bg-slate-800 border border-transparent"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <MessageSquare className="w-3 h-3 text-slate-400" />
                  <span className="text-white text-sm font-medium truncate">
                    {conv.visitorName || conv.visitorId}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-slate-500 text-xs">
                  <Clock className="w-3 h-3" />
                  {new Date(conv.lastMessageAt).toLocaleDateString()}
                  <span>•</span>
                  <span>{conv.messageCount} msgs</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`flex-1 min-w-0 bg-slate-900 border border-slate-800 rounded-2xl flex flex-col ${
          mobilePane === "chat" ? "flex" : "hidden md:flex"
        }`}
      >
        {selectedConversationId ? (
          <>
            {/* Chat Header (mobile back) */}
            <div className="p-3 border-b border-slate-800 flex items-center gap-2 md:hidden">
              <button
                onClick={() => setMobilePane("list")}
                className="text-slate-400 hover:text-white transition-colors"
                aria-label="Back to conversations"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-white text-sm font-medium truncate">
                {conversations.find((c) => c._id === selectedConversationId)?.visitorName ||
                  "Conversation"}
              </span>
            </div>

            {/* Error banner */}
            {errorMsg && (
              <div className="mx-4 mt-3 px-3 py-2 bg-red-500/10 border border-red-500/20 rounded-xl flex items-start gap-2 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="break-words">{errorMsg}</span>
              </div>
            )}

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-12">
                  <Bot className="w-12 h-12 text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-400">Send a message to start the conversation</p>
                </div>
              )}

              <AnimatePresence>
                {messages.map((msg) => (
                  <motion.div
                    key={msg._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    {msg.role !== "user" && (
                      <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                        <Bot className="w-4 h-4 text-white" />
                      </div>
                    )}
                    <div
                      className={`max-w-[85%] md:max-w-[70%] rounded-2xl px-4 py-3 ${
                        msg.role === "user"
                          ? "bg-cyan-500 text-white"
                          : "bg-slate-800 text-slate-200"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                      {msg.responseTime && (
                        <p className="text-xs mt-1 opacity-60 flex items-center gap-1">
                          <Zap className="w-3 h-3" />
                          {(msg.responseTime / 1000).toFixed(1)}s
                        </p>
                      )}
                    </div>
                    {msg.role === "user" && (
                      <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center flex-shrink-0">
                        <User className="w-4 h-4 text-slate-300" />
                      </div>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>

              {isSending && (
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-slate-800 rounded-2xl px-4 py-3 flex items-center gap-2">
                    <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />
                    <span className="text-slate-400 text-sm">Thinking...</span>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-3 md:p-4 border-t border-slate-800">
              <div className="flex items-end gap-3">
                <textarea
                  value={messageInput}
                  onChange={(e) => setMessageInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Type your message..."
                  rows={1}
                  className="flex-1 px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!messageInput.trim() || isSending}
                  className="px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-slate-500 text-xs mt-2">
                Press Enter to send • Shift+Enter for new line
              </p>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center p-6">
            <div className="text-center">
              <MessageSquare className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Select or create a conversation</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
