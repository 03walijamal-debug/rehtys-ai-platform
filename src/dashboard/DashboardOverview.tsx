import { motion } from "framer-motion";
import { 
  Bot, 
  MessageSquare, 
  Users, 
  TrendingUp,
  ArrowUpRight,
  Clock,
  Zap
} from "lucide-react";

const stats = [
  { label: "Active Agents", value: "2", change: "+1 this month", icon: Bot, color: "cyan" },
  { label: "Total Conversations", value: "1,247", change: "+23% this week", icon: MessageSquare, color: "green" },
  { label: "Messages Handled", value: "3,891", change: "+156 today", icon: Zap, color: "purple" },
  { label: "Customer Satisfaction", value: "94%", change: "+2% improvement", icon: TrendingUp, color: "orange" },
];

const recentActivity = [
  { type: "message", agent: "Sales Bot", message: "Handled customer inquiry about pricing", time: "2 min ago" },
  { type: "message", agent: "Support Bot", message: "Resolved technical issue #4521", time: "15 min ago" },
  { type: "upgrade", agent: "System", message: "Agent 'Sales Bot' upgraded to Pro plan", time: "1 hour ago" },
  { type: "message", agent: "Sales Bot", message: "New lead captured from website chat", time: "2 hours ago" },
];

export default function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Welcome back! 👋</h1>
          <p className="text-slate-400 mt-1">Here's what's happening with your agents today.</p>
        </div>
        <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
          <Bot className="w-4 h-4" />
          Create New Agent
        </button>
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
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stat.color === "cyan" ? "bg-cyan-500/10" :
                stat.color === "green" ? "bg-green-500/10" :
                stat.color === "purple" ? "bg-purple-500/10" :
                "bg-orange-500/10"
              }`}>
                <stat.icon className={`w-6 h-6 ${
                  stat.color === "cyan" ? "text-cyan-400" :
                  stat.color === "green" ? "text-green-400" :
                  stat.color === "purple" ? "text-purple-400" :
                  "text-orange-400"
                }`} />
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

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Recent Activity
          </h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
              >
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  activity.type === "message" ? "bg-cyan-500/10" : "bg-green-500/10"
                }`}>
                  {activity.type === "message" ? (
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                  ) : (
                    <TrendingUp className="w-5 h-5 text-green-400" />
                  )}
                </div>
                <div className="flex-1">
                  <p className="text-white text-sm">{activity.message}</p>
                  <p className="text-slate-500 text-xs mt-1">
                    {activity.agent} • {activity.time}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
          <div className="space-y-3">
            <button className="w-full p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-xl text-left hover:from-cyan-500/20 hover:to-blue-500/20 transition-all">
              <div className="flex items-center gap-3">
                <Bot className="w-5 h-5 text-cyan-400" />
                <div>
                  <p className="text-white font-medium">Create New Agent</p>
                  <p className="text-slate-400 text-sm">Set up a new AI agent</p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20 rounded-xl text-left hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
              <div className="flex items-center gap-3">
                <Users className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-white font-medium">Add Knowledge Base</p>
                  <p className="text-slate-400 text-sm">Train your agent</p>
                </div>
              </div>
            </button>
            <button className="w-full p-4 bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl text-left hover:from-green-500/20 hover:to-emerald-500/20 transition-all">
              <div className="flex items-center gap-3">
                <Zap className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-white font-medium">Connect Channels</p>
                  <p className="text-slate-400 text-sm">WhatsApp, Email, etc.</p>
                </div>
              </div>
            </button>
          </div>

          {/* Subscription Status */}
          <div className="mt-6 p-4 bg-gradient-to-r from-orange-500/10 to-red-500/10 border border-orange-500/20 rounded-xl">
            <p className="text-orange-400 font-medium text-sm">Pro Plan Active</p>
            <p className="text-slate-400 text-xs mt-1">Renews in 25 days</p>
            <button className="mt-3 text-cyan-400 text-sm hover:text-cyan-300 transition-colors">
              Manage Subscription →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
