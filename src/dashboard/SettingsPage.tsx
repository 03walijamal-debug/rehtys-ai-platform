import { useState } from "react";
import { motion } from "framer-motion";
import { 
  User, 
  CreditCard, 
  Key, 
  Bell, 
  Shield, 
  Save,
  Copy,
  RefreshCw,
  CheckCircle,
  ExternalLink
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
    { id: "billing", label: "Billing", icon: CreditCard },
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
        {/* Sidebar Tabs */}
        <div className="lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <tab.icon className="w-5 h-5" />
              <span className="font-medium">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "profile" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Profile Settings</h2>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">R</span>
                  </div>
                  <div>
                    <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors">
                      Change Avatar
                    </button>
                    <p className="text-slate-500 text-xs mt-2">JPG, PNG or GIF. Max 2MB.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "billing" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Billing & Subscription</h2>
              
              {/* Current Plan */}
              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 rounded-2xl p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-cyan-400 font-medium">Pro Plan</p>
                    <p className="text-white text-2xl font-bold mt-1">$89/month</p>
                    <p className="text-slate-400 text-sm mt-1">Renews on September 25, 2024</p>
                  </div>
                  <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors">
                    Manage Subscription
                  </button>
                </div>
              </div>

              {/* Payment Method */}
              <div className="mb-6">
                <h3 className="text-white font-medium mb-4">Payment Method</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-xl">
                  <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                    <span className="text-white text-xs font-bold">VISA</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white">•••• •••• •••• 4242</p>
                    <p className="text-slate-400 text-sm">Expires 12/2025</p>
                  </div>
                  <button className="text-cyan-400 hover:text-cyan-300 text-sm font-medium">
                    Update
                  </button>
                </div>
              </div>

              {/* Billing History */}
              <div>
                <h3 className="text-white font-medium mb-4">Billing History</h3>
                <div className="space-y-3">
                  {[
                    { date: "Aug 25, 2024", amount: "$89.00", status: "Paid" },
                    { date: "Jul 25, 2024", amount: "$89.00", status: "Paid" },
                    { date: "Jun 25, 2024", amount: "$89.00", status: "Paid" },
                  ].map((invoice, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-4 bg-slate-800/50 rounded-xl"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
                          <CheckCircle className="w-5 h-5 text-green-400" />
                        </div>
                        <div>
                          <p className="text-white">{invoice.amount}</p>
                          <p className="text-slate-400 text-sm">{invoice.date}</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-green-500/10 text-green-400 text-sm font-medium rounded-lg">
                        {invoice.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "api-keys" && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">API Keys</h2>
              
              <div className="space-y-4">
                {/* Web Widget Key */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Web Widget Key</span>
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-xs font-medium rounded-lg">
                      Active
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      type="password"
                      value="rw_live_xxxxxxxxxxxxxxxxxxxx"
                      readOnly
                      className="flex-1 px-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-slate-400 text-sm font-mono"
                    />
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <Copy className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors">
                      <RefreshCw className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Telegram Bot Token */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Telegram Bot Token</span>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-lg">
                      Pending Setup
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Connect your Telegram bot to start receiving messages.</p>
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Connect Telegram
                  </button>
                </div>

                {/* WhatsApp */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">WhatsApp Business API</span>
                    <span className="px-2 py-1 bg-slate-700 text-slate-400 text-xs font-medium rounded-lg">
                      Pro Feature
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Connect WhatsApp Business to reach customers on their favorite platform.</p>
                  <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
                    <ExternalLink className="w-4 h-4" />
                    Upgrade to Pro
                  </button>
                </div>

                {/* Email */}
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-white font-medium">Email Service (Brevo)</span>
                    <span className="px-2 py-1 bg-yellow-500/10 text-yellow-400 text-xs font-medium rounded-lg">
                      Pending Setup
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm mb-3">Configure Brevo to send automated emails to your customers.</p>
                  <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors flex items-center gap-2">
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
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
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
                      <p className="text-white font-medium">{item.label}</p>
                      <p className="text-slate-400 text-sm">{item.desc}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications({ ...notifications, [item.key]: !notifications[item.key as keyof typeof notifications] })
                      }
                      className={`w-12 h-6 rounded-full transition-colors ${
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
                <button className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
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
              className="bg-slate-900 border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-6">Security Settings</h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Two-Factor Authentication</p>
                      <p className="text-slate-400 text-sm">Add an extra layer of security to your account</p>
                    </div>
                    <button className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl text-sm font-medium transition-colors">
                      Enable
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Change Password</p>
                      <p className="text-slate-400 text-sm">Update your account password</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors">
                      Update
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-slate-800/50 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white font-medium">Active Sessions</p>
                      <p className="text-slate-400 text-sm">Manage your logged-in devices</p>
                    </div>
                    <button className="px-4 py-2 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors">
                      View All
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-red-400 font-medium">Delete Account</p>
                      <p className="text-slate-400 text-sm">Permanently delete your account and all data</p>
                    </div>
                    <button className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-xl text-sm font-medium transition-colors">
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
