"use client";
import { motion } from "framer-motion";
import {
  Bot, MessageSquare, CreditCard, Plus, BarChart3,
  Database, Clock, ArrowUpRight, TrendingUp, Zap, Crown,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";

const stats = [
  {
    icon: Bot,
    label: "Active Agents",
    value: "1",
    change: "+1 this week",
    changeType: "positive" as const,
    gradient: "from-[#8C7AE6]/20 to-[#8C7AE6]/5",
    iconBg: "bg-[#8C7AE6]/15",
    iconColor: "text-[#8C7AE6]",
  },
  {
    icon: MessageSquare,
    label: "Conversations",
    value: "0",
    change: "No conversations yet",
    changeType: "neutral" as const,
    gradient: "from-[#06B6D4]/20 to-[#06B6D4]/5",
    iconBg: "bg-[#06B6D4]/15",
    iconColor: "text-[#06B6D4]",
  },
  {
    icon: TrendingUp,
    label: "Messages Used",
    value: "0 / 1,000",
    change: "0% of limit",
    changeType: "neutral" as const,
    gradient: "from-[#10B981]/20 to-[#10B981]/5",
    iconBg: "bg-[#10B981]/15",
    iconColor: "text-[#10B981]",
  },
  {
    icon: Crown,
    label: "Current Plan",
    value: "Free Trial",
    change: "14 days remaining",
    changeType: "warning" as const,
    gradient: "from-[#F59E0B]/20 to-[#F59E0B]/5",
    iconBg: "bg-[#F59E0B]/15",
    iconColor: "text-[#F59E0B]",
  },
];

const quickActions = [
  {
    icon: Plus,
    label: "Create Agent",
    description: "Set up a new AI agent",
    path: "/dashboard/agents",
    color: "bg-[#8C7AE6]/10 text-[#8C7AE6]",
  },
  {
    icon: BarChart3,
    label: "View Analytics",
    description: "Track your performance",
    path: "/dashboard/analytics",
    color: "bg-[#06B6D4]/10 text-[#06B6D4]",
  },
  {
    icon: Database,
    label: "Knowledge Base",
    description: "Upload training documents",
    path: "/dashboard/knowledge",
    color: "bg-[#10B981]/10 text-[#10B981]",
  },
  {
    icon: CreditCard,
    label: "Billing & Plans",
    description: "Manage your subscription",
    path: "/dashboard/billing",
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
];

const activities = [
  {
    text: "Account created successfully",
    time: "Just now",
    icon: Bot,
    color: "bg-[#8C7AE6]/10 text-[#8C7AE6]",
  },
  {
    text: "Welcome to Rehtys AI Platform!",
    time: "1 min ago",
    icon: Zap,
    color: "bg-[#06B6D4]/10 text-[#06B6D4]",
  },
  {
    text: "Complete onboarding to activate agent",
    time: "1 min ago",
    icon: Clock,
    color: "bg-[#F59E0B]/10 text-[#F59E0B]",
  },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#8C7AE6]/10 via-[var(--bg-card)] to-[var(--bg-card)] border border-[var(--border-color)] p-6 sm:p-8"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-[#8C7AE6]/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk'] text-[var(--text-primary)]">
            Welcome back, {firstName} 👋
          </h1>
          <p className="text-[var(--text-secondary)] mt-2">
            Here's what's happening with your AI agents today
          </p>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="group relative overflow-hidden rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] hover:border-[#8C7AE6]/30 transition-all duration-300 p-5">
              {/* Gradient overlay */}
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />
              
              <div className="relative">
                <div className="flex items-center justify-between mb-3">
                  <div className={`w-10 h-10 rounded-xl ${stat.iconBg} flex items-center justify-center`}>
                    <stat.icon size={20} className={stat.iconColor} />
                  </div>
                  <ArrowUpRight size={14} className="text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                
                <p className="text-2xl font-bold font-['Space_Grotesk'] text-[var(--text-primary)]">
                  {stat.value}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 font-medium">{stat.label}</p>
                
                <div className="mt-3 flex items-center gap-1">
                  <span className={`text-[11px] font-medium ${
                    stat.changeType === "positive" ? "text-[#10B981]" :
                    stat.changeType === "warning" ? "text-[#F59E0B]" :
                    "text-[var(--text-muted)]"
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
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                key={action.label}
                onClick={() => navigate(action.path)}
                className="group flex items-center gap-3 p-4 rounded-xl bg-[var(--bg-secondary)] hover:bg-[var(--bg-hover)] border border-[var(--border-color)] hover:border-[#8C7AE6]/20 transition-all duration-200 text-left"
              >
                <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <action.icon size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-[var(--text-primary)]">{action.label}</p>
                  <p className="text-[11px] text-[var(--text-muted)]">{action.description}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-color)] p-6"
        >
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Recent Activity</h3>
          <div className="space-y-4">
            {activities.map((act, i) => (
              <div key={i} className="flex items-start gap-3 group">
                <div className={`w-8 h-8 rounded-lg ${act.color} flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform`}>
                  <act.icon size={14} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-[var(--text-primary)]">{act.text}</p>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{act.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* View All Link */}
          <button
            onClick={() => navigate("/dashboard/analytics")}
            className="mt-6 w-full py-2 rounded-lg text-xs font-medium text-[#8C7AE6] hover:bg-[#8C7AE6]/10 transition-colors"
          >
            View all activity →
          </button>
        </motion.div>
      </div>

      {/* Status Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="rounded-xl bg-gradient-to-r from-[#8C7AE6]/10 to-[#06B6D4]/10 border border-[#8C7AE6]/20 p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#8C7AE6]/15 flex items-center justify-center">
            <Zap size={20} className="text-[#8C7AE6]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-[var(--text-primary)]">Ready to go live?</p>
            <p className="text-xs text-[var(--text-secondary)]">Upgrade to Starter for unlimited AI power</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/dashboard/billing")}
          className="px-5 py-2.5 rounded-xl bg-[#8C7AE6] hover:bg-[#7B6CD4] text-white text-sm font-semibold transition-colors shrink-0"
        >
          View Plans →
        </button>
      </motion.div>
    </div>
  );
}
