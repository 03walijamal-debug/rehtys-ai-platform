import { motion } from "framer-motion";
import { 
  BarChart3, 
  TrendingUp, 
  MessageSquare, 
  Users, 
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

const metrics = [
  { label: "Total Messages", value: "3,891", change: "+12.5%", up: true, icon: MessageSquare },
  { label: "Unique Users", value: "1,247", change: "+8.2%", up: true, icon: Users },
  { label: "Avg Response Time", value: "1.2s", change: "-15.3%", up: true, icon: Clock },
  { label: "Resolution Rate", value: "94%", change: "+2.1%", up: true, icon: TrendingUp },
];

const hourlyData = [
  { hour: "6am", messages: 45 },
  { hour: "9am", messages: 120 },
  { hour: "12pm", messages: 180 },
  { hour: "3pm", messages: 150 },
  { hour: "6pm", messages: 90 },
  { hour: "9pm", messages: 60 },
];

const channelPerformance = [
  { channel: "Web Widget", messages: 2100, percentage: 54, color: "cyan" },
  { channel: "Telegram", messages: 1200, percentage: 31, color: "blue" },
  { channel: "WhatsApp", messages: 450, percentage: 12, color: "green" },
  { channel: "Email", messages: 141, percentage: 3, color: "purple" },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Analytics</h1>
          <p className="text-slate-400 mt-1">Track your agent performance and insights</p>
        </div>
        <div className="flex items-center gap-3">
          <select className="px-4 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors">
            <option>Last 7 days</option>
            <option>Last 30 days</option>
            <option>Last 90 days</option>
          </select>
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
                <metric.icon className="w-5 h-5 text-cyan-400" />
              </div>
              <span className={`flex items-center gap-1 text-sm font-medium ${
                metric.up ? "text-green-400" : "text-red-400"
              }`}>
                {metric.up ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {metric.change}
              </span>
            </div>
            <p className="text-3xl font-bold text-white">{metric.value}</p>
            <p className="text-slate-400 text-sm mt-1">{metric.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Over Time */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-slate-400" />
            Messages Over Time
          </h2>
          <div className="flex items-end justify-between h-48 gap-2">
            {hourlyData.map((data, index) => (
              <div key={data.hour} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-slate-400 text-xs">{data.messages}</span>
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.messages / 200) * 100}%` }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.5 }}
                  className="w-full bg-gradient-to-t from-cyan-500 to-blue-500 rounded-t-lg"
                />
                <span className="text-slate-500 text-xs">{data.hour}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Channel Performance */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
        >
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-slate-400" />
            Channel Performance
          </h2>
          <div className="space-y-4">
            {channelPerformance.map((channel, index) => (
              <div key={channel.channel}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm">{channel.channel}</span>
                  <span className="text-slate-400 text-sm">{channel.messages.toLocaleString()} messages</span>
                </div>
                <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${channel.percentage}%` }}
                    transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
                    className={`h-full rounded-full ${
                      channel.color === "cyan" ? "bg-cyan-500" :
                      channel.color === "blue" ? "bg-blue-500" :
                      channel.color === "green" ? "bg-green-500" :
                      "bg-purple-500"
                    }`}
                  />
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-slate-500 text-xs">{channel.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Top Questions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
      >
        <h2 className="text-lg font-semibold text-white mb-6">Top Questions Asked</h2>
        <div className="space-y-3">
          {[
            { question: "What are your pricing plans?", count: 234, percentage: 18 },
            { question: "How do I connect WhatsApp?", count: 189, percentage: 15 },
            { question: "Can I change my subscription?", count: 156, percentage: 12 },
            { question: "How does the AI agent work?", count: 134, percentage: 11 },
            { question: "What integrations do you support?", count: 98, percentage: 8 },
          ].map((item, index) => (
            <div
              key={index}
              className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-800/50 transition-colors"
            >
              <span className="w-8 h-8 bg-slate-800 rounded-lg flex items-center justify-center text-slate-400 text-sm font-medium">
                {index + 1}
              </span>
              <div className="flex-1">
                <p className="text-white text-sm">{item.question}</p>
              </div>
              <div className="text-right">
                <p className="text-white font-medium">{item.count}</p>
                <p className="text-slate-500 text-xs">{item.percentage}%</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
