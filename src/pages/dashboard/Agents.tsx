"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, Plus, Globe, MessageSquare, MoreVertical, Power, PowerOff } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Agent {
  id: string;
  name: string;
  status: "active" | "inactive";
  channels: string[];
  conversations: number;
}

const sampleAgents: Agent[] = [
  {
    id: "1",
    name: "Support Agent",
    status: "active",
    channels: ["Web", "Telegram"],
    conversations: 0,
  },
];

export default function DashboardAgents() {
  const [agents] = useState<Agent[]>(sampleAgents);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk']">Agents</h1>
          <p className="text-gray-500 text-sm mt-1">Manage your AI agents</p>
        </div>
        <Button className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold">
          <Plus size={16} className="mr-2" />
          Create New Agent
        </Button>
      </div>

      {agents.length === 0 ? (
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center mx-auto mb-4">
              <Bot size={28} className="text-[#00E5FF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Create your first AI agent to start automating customer support
            </p>
            <Button className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold">
              <Plus size={16} className="mr-2" />
              Create Your First Agent
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {agents.map((agent, i) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
            >
              <Card className="bg-[#111827] border-white/5 hover:border-white/10 transition-all group">
                <CardContent className="p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] flex items-center justify-center">
                        <Bot size={18} className="text-[#0B1120]" />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-white">{agent.name}</h3>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <span className={`w-1.5 h-1.5 rounded-full ${agent.status === "active" ? "bg-[#10B981]" : "bg-gray-500"}`} />
                          <span className="text-[10px] text-gray-500 capitalize">{agent.status}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-gray-600 hover:text-white transition-colors opacity-0 group-hover:opacity-100">
                      <MoreVertical size={16} />
                    </button>
                  </div>

                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {agent.channels.map((ch) => (
                      <span key={ch} className="px-2 py-0.5 bg-white/5 text-[10px] text-gray-400 rounded-full flex items-center gap-1">
                        <Globe size={10} />
                        {ch}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-gray-500">
                      <MessageSquare size={12} />
                      <span className="text-xs">{agent.conversations} conversations</span>
                    </div>
                    <div className="flex gap-1">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-[#10B981]">
                        <Power size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
