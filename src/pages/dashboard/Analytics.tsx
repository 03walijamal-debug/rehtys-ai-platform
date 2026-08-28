"use client";

import { BarChart3, TrendingUp, MessageSquare, Users } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts";

const conversationData = [
  { name: "Mon", conversations: 0 },
  { name: "Tue", conversations: 0 },
  { name: "Wed", conversations: 0 },
  { name: "Thu", conversations: 0 },
  { name: "Fri", conversations: 0 },
  { name: "Sat", conversations: 0 },
  { name: "Sun", conversations: 0 },
];

const channelData = [
  { name: "Web", value: 0 },
  { name: "Telegram", value: 0 },
  { name: "WhatsApp", value: 0 },
  { name: "Email", value: 0 },
];

const satisfactionData = [
  { name: "Satisfied", value: 0 },
  { name: "Neutral", value: 0 },
  { name: "Unsatisfied", value: 0 },
];

const COLORS = ["#00E5FF", "#F5A623", "#7B61FF"];

const tooltipStyle = {
  contentStyle: {
    background: "#111827",
    border: "1px solid rgba(255,255,255,0.1)",
    borderRadius: "8px",
    fontSize: "12px",
    color: "#fff",
  },
};

export default function DashboardAnalytics() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-['Space_Grotesk']">Analytics</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor agent performance and conversations</p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[
          { icon: TrendingUp, label: "Total Conversations", value: "0", color: "text-[#00E5FF]" },
          { icon: MessageSquare, label: "Messages Sent", value: "0", color: "text-white" },
          { icon: Users, label: "Unique Users", value: "0", color: "text-[#F5A623]" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-[#111827] border-white/5">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  <stat.icon size={18} className={stat.color} />
                </div>
                <div>
                  <p className="text-xl font-bold font-['Space_Grotesk']">{stat.value}</p>
                  <p className="text-xs text-gray-500">{stat.label}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Conversations Over Time */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Conversations Over Time</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Line type="monotone" dataKey="conversations" stroke="#00E5FF" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Messages Per Channel */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Messages Per Channel</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={channelData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip {...tooltipStyle} />
                  <Bar dataKey="value" fill="#00E5FF" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Customer Satisfaction */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Customer Satisfaction</h3>
            <div className="h-64 flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {satisfactionData.map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip {...tooltipStyle} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex justify-center gap-6 mt-2">
              {satisfactionData.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-gray-400">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-5">
            <h3 className="text-sm font-semibold text-white mb-4">Response Time</h3>
            <div className="h-64 flex items-center justify-center">
              <div className="text-center">
                <p className="text-5xl font-bold font-['JetBrains_Mono'] text-[#00E5FF]">—</p>
                <p className="text-sm text-gray-500 mt-2">Avg. Response Time</p>
                <p className="text-xs text-gray-600 mt-1">Analytics will appear once your agent starts conversations</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
