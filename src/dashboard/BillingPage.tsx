import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import {
  CreditCard,
  CheckCircle,
  Clock,
  Zap,
  ArrowUpRight,
  Star,
} from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    features: ["1 Agent", "1,000 messages", "5 documents", "Basic support"],
    current: true,
  },
  {
    name: "Starter",
    price: "$89",
    period: "/month",
    features: ["3 Agents", "10,000 messages", "50 documents", "Priority support"],
    current: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    features: [
      "10 Agents",
      "100,000 messages",
      "500 documents",
      "All AI models",
      "API access",
    ],
    current: false,
  },
];

export default function BillingPage() {
  const limits = useQuery(api.users.checkLimits);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Subscription</h1>
        <p className="text-slate-400 mt-1">Manage your plan and usage</p>
      </div>

      {/* Current Usage */}
      {limits && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-cyan-400" />
            Current Usage
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Agents */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Agents</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {limits.agents.used}
                </span>
                <span className="text-slate-500">/ {limits.agents.limit}</span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{
                    width: `${Math.min((limits.agents.used / limits.agents.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Messages */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Messages</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {limits.messages.used.toLocaleString()}
                </span>
                <span className="text-slate-500">
                  / {limits.messages.limit.toLocaleString()}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 rounded-full"
                  style={{
                    width: `${Math.min(limits.messages.percentage, 100)}%`,
                  }}
                />
              </div>
            </div>

            {/* Documents */}
            <div className="bg-slate-800/50 rounded-xl p-4">
              <p className="text-slate-400 text-sm mb-1">Documents</p>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-white">
                  {limits.documents.used}
                </span>
                <span className="text-slate-500">
                  / {limits.documents.limit}
                </span>
              </div>
              <div className="mt-2 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{
                    width: `${Math.min((limits.documents.used / limits.documents.limit) * 100, 100)}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Plans */}
      <div>
        <h2 className="text-lg font-semibold text-white mb-4">Available Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-slate-900 border rounded-2xl p-6 ${
                plan.current
                  ? "border-cyan-500/50"
                  : "border-slate-800 hover:border-slate-700"
              }`}
            >
              {plan.current && (
                <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/20 mb-3 inline-block">
                  Current Plan
                </span>
              )}
              <h3 className="text-xl font-bold text-white">{plan.name}</h3>
              <div className="flex items-baseline gap-1 mt-2">
                <span className="text-3xl font-bold text-white">{plan.price}</span>
                <span className="text-slate-400 text-sm">{plan.period}</span>
              </div>
              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-slate-300 text-sm"
                  >
                    <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                    {feature}
                  </li>
                ))}
              </ul>
              <button
                disabled={plan.current}
                className={`w-full mt-6 px-4 py-3 rounded-xl font-medium transition-colors ${
                  plan.current
                    ? "bg-slate-800 text-slate-500 cursor-not-allowed"
                    : "bg-cyan-500 hover:bg-cyan-600 text-white"
                }`}
              >
                {plan.current ? "Current Plan" : "Upgrade"}
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Billing History */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
          <Clock className="w-5 h-5 text-slate-400" />
          Billing History
        </h2>
        <div className="text-center py-8">
          <CreditCard className="w-12 h-12 text-slate-600 mx-auto mb-3" />
          <p className="text-slate-400">No billing history yet</p>
          <p className="text-slate-500 text-sm mt-1">
            Your invoices will appear here after your first payment
          </p>
        </div>
      </div>
    </div>
  );
}
