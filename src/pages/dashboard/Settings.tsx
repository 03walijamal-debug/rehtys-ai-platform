"use client";

import { Settings as SettingsIcon, CreditCard, Key, Bell, User, ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";

export default function DashboardSettings() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold font-['Space_Grotesk']">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Manage your account and preferences</p>
      </div>

      {/* Profile */}
      <Card className="bg-[#111827] border-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <User size={18} className="text-[#00E5FF]" />
            <h2 className="text-sm font-semibold text-white">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Name</label>
              <Input
                defaultValue={user?.name || ""}
                className="bg-white/5 border-white/10 text-white"
                readOnly
              />
            </div>
            <div>
              <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
              <Input
                defaultValue={user?.email || ""}
                className="bg-white/5 border-white/10 text-white"
                readOnly
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Subscription */}
      <Card className="bg-[#111827] border-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <CreditCard size={18} className="text-[#F5A623]" />
            <h2 className="text-sm font-semibold text-white">Subscription</h2>
          </div>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-white">Starter Plan</p>
                <span className="px-2 py-0.5 bg-[#10B981]/15 text-[#10B981] text-[10px] font-semibold rounded-full">
                  Active
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">$89/month • 14-day free trial</p>
            </div>
            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 text-xs">
              Manage
              <ExternalLink size={12} className="ml-1.5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* API Keys */}
      <Card className="bg-[#111827] border-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Key size={18} className="text-[#00E5FF]" />
            <h2 className="text-sm font-semibold text-white">API Keys</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
              <div>
                <p className="text-sm text-white">Production Key</p>
                <p className="text-xs text-gray-500 font-['JetBrains_Mono']">rehtys_••••••••••••</p>
              </div>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                Copy
              </Button>
            </div>
            <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5 w-full">
              Generate New Key
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-[#111827] border-white/5">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <Bell size={18} className="text-[#F5A623]" />
            <h2 className="text-sm font-semibold text-white">Notifications</h2>
          </div>
          <div className="space-y-4">
            {[
              { label: "Email notifications", desc: "Receive updates about your agents" },
              { label: "Usage alerts", desc: "Get notified when approaching plan limits" },
              { label: "Security alerts", desc: "Important security updates" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm text-white">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <div className="w-10 h-5 bg-[#00E5FF] rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
