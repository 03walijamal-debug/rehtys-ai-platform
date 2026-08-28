"use client";

import { motion } from "framer-motion";
import { Bot, MessageSquare, CreditCard, Plus, BarChart3, Database, Clock } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const stats = [
  { icon: Bot, label: "Active Agents", value: "1", color: "text-[#00E5FF]" },
  { icon: MessageSquare, label: "Total Conversations", value: "0", color: "text-white" },
  { icon: CreditCard, label: "Messages This Month", value: "0 / 1,000", color: "text-white" },
  { icon: Badge, label: "Subscription", value: "Starter", color: "text-[#F5A623]", isBadge: true },
];

const quickActions = [
  { icon: Plus, label: "Create Agent", path: "/dashboard/agents" },
  { icon: BarChart3, label: "View Analytics", path: "/dashboard/analytics" },
  { icon: Database, label: "Update Knowledge Base", path: "/dashboard/knowledge" },
];

const activities = [
  { text: "Account created successfully", time: "Just now", icon: Bot },
  { text: "Welcome to Rehtys!", time: "1 min ago", icon: MessageSquare },
  { text: "Complete onboarding to activate your agent", time: "1 min ago", icon: Clock },
];

export default function DashboardOverview() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-['Space_Grotesk']">
          Welcome back, {firstName} 👋
        </h1>
        <p className="text-gray-500 mt-1">Here's what's happening with your agents</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-[#111827] border-white/5 hover:border-white/10 transition-colors">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon size={18} className={stat.color} />
                  {stat.isBadge ? (
                    <span className="px-2 py-0.5 bg-[#F5A623]/15 text-[#F5A623] text-[10px] font-semibold rounded-full">
                      {stat.value}
                    </span>
                  ) : null}
                </div>
                <p className="text-2xl font-bold font-['Space_Grotesk']">
                  {stat.isBadge ? "—" : stat.value}
                </p>
                <p className="text-xs text-gray-500 mt-1">{stat.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              {quickActions.map((action) => (
                <button
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#00E5FF]/10 flex items-center justify-center">
                    <action.icon size={16} className="text-[#00E5FF]" />
                  </div>
                  <span className="text-sm text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-6">
            <h3 className="text-sm font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-4">
              {activities.map((act, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center shrink-0">
                    <act.icon size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-300">{act.text}</p>
                    <p className="text-xs text-gray-600 mt-0.5">{act.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
