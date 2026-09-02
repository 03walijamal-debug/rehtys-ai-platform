import { useState } from "react";
import { motion } from "framer-motion";
import { Check, Zap, Crown, ArrowRight, ExternalLink } from "lucide-react";

const STORE_ID = import.meta.env.VITE_LEMONSQUEEZY_STORE_ID;
const VARIANT_ID = import.meta.env.VITE_LEMONSQUEEZY_VARIANT_ID;

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "14 days",
    description: "Try Rehtys AI risk-free",
    features: [
      "1 AI Agent",
      "1,000 messages",
      "Basic analytics",
      "Email support",
    ],
    cta: "Current Plan",
    highlighted: false,
  },
  {
    name: "Starter",
    price: "$89",
    period: "/month",
    description: "For growing businesses",
    features: [
      "1 AI Agent",
      "10,000 messages/month",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Knowledge base upload",
    ],
    cta: "Upgrade to Starter",
    highlighted: true,
  },
];

export default function BillingPage() {
  const [loading, setLoading] = useState(false);

  const handleUpgrade = () => {
    setLoading(true);
    // Redirect to LemonSqueezy hosted checkout
    window.location.href = `https://rehtys.lemonsqueezy.com/checkout/buy/${VARIANT_ID}`;
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white">Billing & Plans</h1>
        <p className="text-gray-400 mt-1">
          Choose the plan that fits your business
        </p>
      </div>

      {/* Plans Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {plans.map((plan) => (
          <motion.div
            key={plan.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`relative rounded-2xl border p-6 ${
              plan.highlighted
                ? "border-[#8B5CF6] bg-[#8B5CF6]/5 shadow-lg shadow-[#8B5CF6]/10"
                : "border-white/10 bg-white/5"
            }`}
          >
            {plan.highlighted && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#8B5CF6] text-white text-xs font-bold px-3 py-1 rounded-full">
                MOST POPULAR
              </div>
            )}

            <div className="flex items-center gap-3 mb-4">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                  plan.highlighted
                    ? "bg-[#8B5CF6]/20"
                    : "bg-white/10"
                }`}
              >
                {plan.highlighted ? (
                  <Zap className="w-5 h-5 text-[#8B5CF6]" />
                ) : (
                  <Crown className="w-5 h-5 text-gray-400" />
                )}
              </div>
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <p className="text-sm text-gray-400">{plan.description}</p>
              </div>
            </div>

            {/* Price */}
            <div className="mb-6">
              <span className="text-4xl font-bold text-white">{plan.price}</span>
              <span className="text-gray-400 ml-1">{plan.period}</span>
            </div>

            {/* Features */}
            <ul className="space-y-3 mb-6">
              {plan.features.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm">
                  <Check className="w-4 h-4 text-[#8B5CF6] flex-shrink-0" />
                  <span className="text-gray-300">{feature}</span>
                </li>
              ))}
            </ul>

            {/* CTA Button */}
            {plan.highlighted ? (
              <button
                onClick={handleUpgrade}
                disabled={loading}
                className="w-full py-3 rounded-xl bg-[#8B5CF6] hover:bg-[#7C3AED] text-white font-semibold transition-colors flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {loading ? (
                  "Redirecting..."
                ) : (
                  <>
                    {plan.cta}
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            ) : (
              <div className="w-full py-3 rounded-xl border border-white/10 text-gray-500 text-center font-semibold">
                {plan.cta}
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Info Note */}
      <div className="bg-white/5 border border-white/10 rounded-xl p-4">
        <p className="text-sm text-gray-400">
          💡 Payments are securely handled by LemonSqueezy. Cancel anytime from
          your dashboard. Your subscription activates instantly after payment.
        </p>
      </div>
    </div>
  );
}
