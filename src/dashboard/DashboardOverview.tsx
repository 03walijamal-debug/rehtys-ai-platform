import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import {
  Bot,
  MessageSquare,
  FileText,
  TrendingUp,
  ArrowUpRight,
  Zap,
  BookOpen,
} from "lucide-react";

export default function DashboardOverview() {
  const agents = useQuery(api.agents.getMyAgents) ?? [];
  const documents = useQuery(api.documents.getMyDocuments, {}) ?? [];

  const activeAgents = agents.filter((a) => a.isActive).length;
  const totalConversations = agents.reduce((sum, a) => sum + a.totalConversations, 0);
  const totalMessages = agents.reduce((sum, a) => sum + a.totalMessages, 0);

  const stats = [
    {
      label: "Active Agents",
      value: activeAgents.toString(),
      change: `${agents.length} total`,
      icon: Bot,
      color: "cyan",
    },
    {
      label: "Total Conversations",
      value: totalConversations.toLocaleString(),
      change: agents.length > 0 ? `${agents.length} agents` : "No agents yet",
      icon: MessageSquare,
      color: "green",
    },
    {
      label: "Knowledge Base",
      value: documents.length.toString(),
      change: documents.filter((d) => d.status === "ready").length + " ready",
      icon: BookOpen,
      color: "purple",
    },
    {
      label: "Messages Sent",
      value: totalMessages.toLocaleString(),
      change: totalMessages > 0 ? "All time" : "Start chatting!",
      icon: Zap,
      color: "orange",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back! 👋</h1>
          <p className="text-slate-400 mt-1">
            {agents.length === 0
              ? "Let's create your first AI agent to get started."
              : "Here's what's happening with your agents today."}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  stat.color === "cyan"
                    ? "bg-cyan-500/10"
                    : stat.color === "green"
                    ? "bg-green-500/10"
                    : stat.color === "purple"
                    ? "bg-purple-500/10"
                    : "bg-orange-500/10"
                }`}
              >
                <stat.icon
                  className={`w-6 h-6 ${
                    stat.color === "cyan"
                      ? "text-cyan-400"
                      : stat.color === "green"
                      ? "text-green-400"
                      : stat.color === "purple"
                      ? "text-purple-400"
                      : "text-orange-400"
                  }`}
                />
              </div>
              <span className="flex items-center gap-1 text-green-400 text-sm font-medium">
                <ArrowUpRight className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{stat.value}</p>
            <p className="text-slate-400 text-sm mt-1">{stat.label}</p>
            <p className="text-slate-500 text-xs mt-2">{stat.change}</p>
          </motion.div>
        ))}
      </div>

      {/* Agent List Preview */}
      {agents.length > 0 && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Bot className="w-5 h-5 text-slate-400" />
            Your Agents
          </h2>
          <div className="space-y-3">
            {agents.slice(0, 5).map((agent) => (
              <div
                key={agent._id}
                className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">{agent.name}</p>
                  <p className="text-slate-500 text-xs">{agent.description}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    agent.isActive
                      ? "bg-green-500/10 text-green-400"
                      : "bg-red-500/10 text-red-400"
                  }`}
                >
                  {agent.isActive ? "Active" : "Inactive"}
                </span>
                <div className="text-right">
                  <p className="text-white text-sm font-medium">{agent.totalMessages}</p>
                  <p className="text-slate-500 text-xs">messages</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <button className="p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl text-left hover:from-cyan-500/20 hover:to-blue-500/20 transition-all">
            <div className="flex items-center gap-3">
              <Bot className="w-5 h-5 text-cyan-400" />
              <div>
                <p className="text-white font-medium text-sm">Create Agent</p>
                <p className="text-slate-400 text-xs">Set up a new AI assistant</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-left hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-purple-400" />
              <div>
                <p className="text-white font-medium text-sm">Add Knowledge</p>
                <p className="text-slate-400 text-xs">Train your agent</p>
              </div>
            </div>
          </button>
          <button className="p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-left hover:from-green-500/20 hover:to-emerald-500/20 transition-all">
            <div className="flex items-center gap-3">
              <MessageSquare className="w-5 h-5 text-green-400" />
              <div>
                <p className="text-white font-medium text-sm">Start Chat</p>
                <p className="text-slate-400 text-xs">Test your agent</p>
              </div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}
