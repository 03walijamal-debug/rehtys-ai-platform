import { useState } from "react";
import { motion } from "framer-motion";
import {
  User,
  Key,
  Bell,
  Shield,
  Save,
  Copy,
  RefreshCw,
  CheckCircle,
  ExternalLink,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
  });

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "api-keys", label: "API Keys", icon: Key },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-slate-400 mt-1">Manage your account and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Sidebar Tabs — responsive: horizontal scroll on mobile, vertical on desktop */}
        <div className="flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0 lg:w-56 flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-3 py-2.5 lg:px-4 lg:py-3 rounded-xl whitespace-nowrap transition-all text-sm ${
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>

              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl sm:text-3xl font-bold text-white">R</span>
                  </div>
                  <div>
                    <button className="px-3 py-1.5 sm:px-4 sm:py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-slate-500 text-xs mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Full Name</label>
                    <input
                      type="text"
                      defaultValue="Walijamal"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue="walijamal@example.com"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Company</label>
                    <input
                      type="text"
                      defaultValue="Rehtys"
                      className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-400 text-sm mb-2">Timezone</label>
                    <select className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors">
                      <option>Asia/Karachi (PKT)</option>
                      <option>UTC</option>
                      <option>America/New_York (EST)</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "api-keys" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">API Keys</h2>

              <div className="space-y-4">
                {/* Web Widget Key */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">Web Widget Key</span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="rw_live_xxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 text-sm font-mono min-w-0"
                    />
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors flex-shrink-0">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Telegram Bot Token */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">Telegram Bot Token</span>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-lg">
                      Pending
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Connect your Telegram bot.</p>
                  <button className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Connect Telegram
                  </button>
                </div>

                {/* Email */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium text-sm">Email Service (Brevo)</span>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-lg">
                      Pending
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Configure Brevo for emails.</p>
                  <button className="px-3 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Connect Brevo
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "notifications" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Notification Preferences</h2>

              <div className="space-y-4">
                {[
                  { key: "email", label: "Email Notifications", desc: "Receive updates via email" },
                  { key: "sms", label: "SMS Notifications", desc: "Get text messages for urgent alerts" },
                  { key: "push", label: "Push Notifications", desc: "Browser push notifications" },
                ].map((item) => (
                  <div
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                  >
                    <div>
                      <p className="text-white font-medium text-sm">{item.label}</p>
                      <p className="text-slate-400 text-xs">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({
                          ...notifications,
                          [item.key]: !notifications[item.key as keyof typeof notifications],
                        })
                      }
                      className={`w-12 h-6 rounded-full transition-colors flex-shrink-0 ${
                        notifications[item.key as keyof typeof notifications]
                          ? "bg-cyan-500"
                          : "bg-slate-700"
                      }`}
                    >
                      <div
                        className={`w-5 h-5 bg-white rounded-full transition-transform ${
                          notifications[item.key as keyof typeof notifications]
                            ? "translate-x-6"
                            : "translate-x-0.5"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex justify-end mt-6">
                <button className="px-4 py-2.5 sm:px-6 sm:py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2 text-sm">
                  <Save className="w-4 h-4" />
                  Save Preferences
                </button>
              </div>
            </motion.div>
          )}

          {activeTab === "security" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>

              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Two-Factor Authentication</p>
                      <p className="text-slate-400 text-xs">Add extra security to your account</p>
                    </div>
                    <button className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Change Password</p>
                      <p className="text-slate-400 text-xs">Update your account password</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                      Update
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium text-sm">Active Sessions</p>
                      <p className="text-slate-400 text-xs">Manage your logged-in devices</p>
                    </div>
                    <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                      View All
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-400 font-medium text-sm">Delete Account</p>
                      <p className="text-slate-400 text-xs">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-3 py-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-colors flex-shrink-0">
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
