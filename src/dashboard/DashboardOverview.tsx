"use client";
import { motion } from "framer-motion";
import {
  Bot, MessageSquare, TrendingUp, Crown, Plus,
  BarChart3, Database, CreditCard, Clock, Zap, ArrowUpRight, Sparkles,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

const stats = [
  {
    icon: Bot,
    label: "Active Agents",
    value: "1",
    change: "+1 this week",
    positive: true,
    colors: { bg: "bg-violet-500/10", icon: "text-violet-400", ring: "ring-violet-500/20" },
    gradient: "from-violet-500/10 via-violet-500/5 to-transparent",
  },
  {
    icon: MessageSquare,
    label: "Conversations",
    value: "0",
    change: "Start chatting!",
    positive: false,
    colors: { bg: "bg-cyan-500/10", icon: "text-cyan-400", ring: "ring-cyan-500/20" },
    gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
  },
  {
    icon: TrendingUp,
    label: "Messages Used",
    value: "0 / 1K",
    change: "0% of limit",
    positive: false,
    colors: { bg: "bg-emerald-500/10", icon: "text-emerald-400", ring: "ring-emerald-500/20" },
    gradient: "from-emerald-500/10 via-emerald-500/5 to-transparent",
  },
  {
    icon: Crown,
    label: "Plan",
    value: "Free Trial",
    change: "14 days left",
    positive: false,
    colors: { bg: "bg-amber-500/10", icon: "text-amber-400", ring: "ring-amber-500/20" },
    gradient: "from-amber-500/10 via-amber-500/5 to-transparent",
  },
];

const quickActions = [
  { icon: Plus, label: "Create Agent", desc: "Deploy a new AI agent", path: "/dashboard/agents", color: "from-violet-600 to-violet-400" },
  { icon: Database, label: "Knowledge Base", desc: "Upload training docs", path: "/dashboard/knowledge", color: "from-cyan-600 to-cyan-400" },
  { icon: BarChart3, label: "Analytics", desc: "View performance", path: "/dashboard/analytics", color: "from-emerald-600 to-emerald-400" },
  { icon: CreditCard, label: "Billing & Plans", desc: "Manage subscription", path: "/dashboard/billing", color: "from-amber-600 to-amber-400" },
];

const activities = [
  { text: "Account created successfully", time: "Just now", icon: Bot, color: "bg-violet-500" },
  { text: "Welcome to Rehtys AI!", time: "2 min ago", icon: Sparkles, color: "bg-cyan-500" },
  { text: "Complete onboarding setup", time: "2 min ago", icon: Clock, color: "bg-amber-500" },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Hero Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-2xl border border-[var(--border-color)] p-6 sm:p-8"
      >
        {/* Background effects */}
        <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 via-[var(--bg-card)] to-cyan-600/5" />
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-violet-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
        
        <div className="relative flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-violet-700 flex items-center justify-center shadow-lg shadow-violet-500/25">
                <Zap size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold text-violet-400 tracking-wider uppercase">Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-[var(--text-primary)] font-['Space_Grotesk']">
              Welcome back, {firstName} <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-[var(--text-secondary)] mt-1.5 text-sm sm:text-base">
              Your AI agents are standing by. Let's build something amazing.
            </p>
          </div>
          
          <button
            onClick={() => navigate("/dashboard/agents")}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 shrink-0"
          >
            <Plus size={16} />
            New Agent
          </button>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08, type: "spring", stiffness: 200 }}
            className="group"
          >
            <div className="relative overflow-hidden rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-4 sm:p-5 hover:border-violet-500/30 transition-all duration-300 hover:shadow-lg hover:shadow-violet-500/5 h-full">
              {/* Hover gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.colors.bg} ring-1 ${stat.colors.ring} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
                    <stat.icon size={18} className={stat.colors.icon} />
                  </div>
                  <ArrowUpRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                </div>
                
                <p className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] font-['Space_Grotesk'] tracking-tight">
                  {stat.value}
                </p>
                <p className="text-[11px] sm:text-xs text-[var(--text-secondary)] mt-0.5 font-medium">{stat.label}</p>
                
                <div className="mt-2.5">
                  <span className={`text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    stat.positive 
                      ? "bg-emerald-500/10 text-emerald-400" 
                      : "bg-[var(--bg-secondary)] text-[var(--text-muted)]"
                  }`}>
                    {stat.change}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions + Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Quick Actions — 2 columns */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="lg:col-span-2 rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-violet-500/10 flex items-center justify-center">
              <Zap size={12} className="text-violet-400" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Quick Actions</h3>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action, i) => (
              <motion.button
                key={action.label}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + i * 0.05 }}
                onClick={() => navigate(action.path)}
                className="group relative flex items-center gap-3.5 p-4 rounded-xl border border-[var(--border-color)] bg-[var(--bg-secondary)] hover:border-violet-500/20 hover:bg-[var(--bg-hover)] transition-all duration-300 text-left overflow-hidden"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shrink-0 shadow-lg group-hover:scale-110 group-hover:shadow-xl transition-all duration-300`}>
                  <action.icon size={18} className="text-white" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-violet-400 transition-colors">{action.label}</p>
                  <p className="text-[11px] text-[var(--text-muted)] truncate">{action.desc}</p>
                </div>
                <ArrowUpRight size={14} className="ml-auto text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Activity Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-xl border border-[var(--border-color)] bg-[var(--bg-card)] p-5 sm:p-6"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-6 h-6 rounded-md bg-cyan-500/10 flex items-center justify-center">
              <Clock size={12} className="text-cyan-400" />
            </div>
            <h3 className="text-sm font-semibold text-[var(--text-primary)]">Activity</h3>
          </div>
          
          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-[15px] top-3 bottom-3 w-px bg-gradient-to-b from-violet-500/30 via-cyan-500/30 to-transparent" />
            
            <div className="space-y-5">
              {activities.map((act, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.1 }}
                  className="flex items-start gap-3 relative"
                >
                  <div className={`w-[30px] h-[30px] rounded-lg ${act.color}/15 ring-1 ${act.color}/20 flex items-center justify-center shrink-0 z-10`}>
                    <act.icon size={13} className={`${act.color.replace('bg-', 'text-')}`} />
                  </div>
                  <div className="pt-1">
                    <p className="text-[13px] text-[var(--text-primary)] font-medium">{act.text}</p>
                    <p className="text-[11px] text-[var(--text-muted)] mt-0.5">{act.time}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Upgrade CTA */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="relative overflow-hidden rounded-2xl border border-violet-500/20 p-5 sm:p-6"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-violet-600/8 via-transparent to-cyan-600/8" />
        <div className="absolute -top-12 right-12 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl" />
        
        <div className="relative flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-lg shadow-violet-500/30">
              <Sparkles size={22} className="text-white" />
            </div>
            <div>
              <p className="text-base font-bold text-[var(--text-primary)]">Unlock Full Power</p>
              <p className="text-sm text-[var(--text-secondary)]">Upgrade to Starter — unlimited AI agents & analytics</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/dashboard/billing")}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white text-sm font-semibold shadow-lg shadow-violet-500/25 hover:shadow-violet-500/40 transition-all duration-300 shrink-0"
          >
            View Plans →
          </button>
        </div>
      </motion.div>
    </div>
  );
}
