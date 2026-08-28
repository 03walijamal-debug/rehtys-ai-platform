"use client";

import { motion } from "framer-motion";
import {
  Bot, Brain, Globe, BarChart3, Zap, Shield, Star, ChevronDown,
  Play, Check, ArrowRight, Users, Sparkles, MessageSquare, Cpu,
  Workflow, Lock, BarChart,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { GradientText } from "@/components/GradientText";
import { AnimatedCounter } from "@/components/AnimatedCounter";
import { ParticleBackground } from "@/components/ParticleBackground";
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";

/* ── Data ───────────────────────────────────────────────────── */

const features = [
  { icon: Bot, title: "AI-Powered Agents", desc: "Deploy intelligent agents trained on your business data", color: "#00E5FF" },
  { icon: Brain, title: "Smart Knowledge Base", desc: "Agents learn from your FAQs, docs, and past conversations", color: "#7B61FF" },
  { icon: Globe, title: "Multi-Channel", desc: "Connect via Web, Telegram, WhatsApp, Email, and more", color: "#10B981" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor agent performance, conversations, and satisfaction", color: "#F5A623" },
  { icon: Zap, title: "Instant Deployment", desc: "Go live in minutes with our guided onboarding", color: "#EF4444" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant, encrypted, with role-based access", color: "#00E5FF" },
];

const steps = [
  { num: 1, title: "Sign Up", desc: "Create your account in 30 seconds", icon: Users },
  { num: 2, title: "Configure", desc: "Train your agent with your business knowledge", icon: Cpu },
  { num: 3, title: "Deploy", desc: "Go live across all your channels", icon: Rocket },
];

function Rocket({ size = 24, className }: { size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z" />
      <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z" />
      <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0" />
      <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5" />
    </svg>
  );
}

const plans = [
  {
    name: "Starter",
    monthlyPrice: 89,
    yearlyPrice: 71,
    setupFeeMonthly: 0,
    setupFeeYearly: 0,
    badge: null,
    features: ["1 AI Agent", "1,000 conversations/mo", "Web + Telegram", "Basic analytics", "Email support"],
    highlight: false,
    cta: "Start Free Trial",
    ctaStyle: "outline" as const,
  },
  {
    name: "Pro",
    monthlyPrice: 199,
    yearlyPrice: 159,
    setupFeeMonthly: 149,
    setupFeeYearly: 119,
    badge: "MOST POPULAR",
    features: ["3 AI Agents", "5,000 conversations/mo", "All channels", "Advanced analytics + reports", "Priority support", "Custom branding"],
    highlight: true,
    cta: "Start Free Trial",
    ctaStyle: "filled" as const,
  },
  {
    name: "Business",
    monthlyPrice: 499,
    yearlyPrice: 399,
    setupFeeMonthly: 299,
    setupFeeYearly: 239,
    badge: "ENTERPRISE",
    features: ["Unlimited agents", "Unlimited conversations", "All channels + API access", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
    highlight: false,
    cta: "Contact Sales",
    ctaStyle: "outline" as const,
  },
];

const testimonials = [
  {
    quote: "Rehtys reduced our support ticket volume by 60% in the first month. The AI agent handles common queries perfectly.",
    name: "Sarah Chen",
    title: "Head of Support",
    company: "TechFlow Inc.",
    stars: 5,
  },
  {
    quote: "We went from 3-hour response times to instant. Our customers love the 24/7 availability.",
    name: "Marcus Rivera",
    title: "CEO",
    company: "GrowthMetrics",
    stars: 5,
  },
  {
    quote: "The knowledge base training is incredible. Our agent sounds exactly like our best support rep.",
    name: "Priya Sharma",
    title: "CTO",
    company: "DataSync",
    stars: 5,
  },
];

const faqs = [
  { q: "What is Rehtys?", a: "Rehtys is an AI Agent marketplace where businesses rent AI-powered customer service agents. Our agents handle support, sales inquiries, and business operations 24/7 autonomously." },
  { q: "How does the free trial work?", a: "Every plan includes a 14-day free trial with full access to all features. No credit card required to start. You can cancel anytime during the trial." },
  { q: "Can I customize my AI agent?", a: "Yes! You can train your agent with your business knowledge, FAQs, documents, and set custom communication styles (formal, casual, or technical)." },
  { q: "What channels are supported?", a: "Starter plans include Web and Telegram. Pro and Business plans add WhatsApp, Email, and API access for custom integrations." },
  { q: "Is my data secure?", a: "Absolutely. We use SOC 2 compliant infrastructure, end-to-end encryption, and role-based access control. Your data is never used to train our models." },
  { q: "Can I cancel anytime?", a: "Yes, you can cancel your subscription at any time from your dashboard. Your agent will remain active until the end of your billing period." },
  { q: "Do you offer refunds?", a: "We offer a full refund within the first 14 days of your subscription. After that, you can cancel anytime but refunds are not provided for partial months." },
  { q: "How do I get support?", a: "Starter plans include email support. Pro plans get priority support with faster response times. Business plans include a dedicated account manager." },
];

const companyLogos = [
  { name: "Acme Corp", icon: "◆" },
  { name: "TechFlow", icon: "▲" },
  { name: "GrowthMetrics", icon: "●" },
  { name: "DataSync", icon: "◇" },
  { name: "CloudBase", icon: "■" },
  { name: "NexusAI", icon: "⬡" },
];

/* ── Animation Variants ─────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0 },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

/* ── Page ───────────────────────────────────────────────────── */

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION — Rich mesh background with floating shapes
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Layered background */}
        <div className="absolute inset-0 mesh-bg" />
        <div className="absolute inset-0 grid-pattern" />
        <div className="absolute inset-0 dot-matrix opacity-60" />
        <div className="absolute inset-0 noise-overlay" />
        <ParticleBackground />

        {/* Animated gradient orbs */}
        <div className="orb-1 absolute top-[15%] left-[10%] w-[500px] h-[500px] bg-[#00E5FF]/[0.07] rounded-full blur-[120px]" />
        <div className="orb-2 absolute bottom-[20%] right-[5%] w-[400px] h-[400px] bg-[#7B61FF]/[0.06] rounded-full blur-[100px]" />
        <div className="orb-3 absolute top-[60%] left-[40%] w-[300px] h-[300px] bg-[#F5A623]/[0.04] rounded-full blur-[80px]" />

        {/* Floating geometric shapes */}
        <div className="absolute top-[20%] right-[15%] w-20 h-20 border border-[#00E5FF]/10 rounded-2xl rotate-45 spin-slow hidden lg:block" />
        <div className="absolute bottom-[30%] left-[12%] w-14 h-14 border border-[#7B61FF]/10 rounded-full pulse-scale hidden lg:block" />
        <div className="absolute top-[45%] right-[8%] w-3 h-3 bg-[#00E5FF]/30 rounded-full hidden lg:block" />
        <div className="absolute top-[35%] left-[20%] w-2 h-2 bg-[#F5A623]/30 rounded-full hidden lg:block" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#00E5FF]/20 bg-[#00E5FF]/5 mb-8"
          >
            <Sparkles size={14} className="text-[#00E5FF]" />
            <span className="text-xs font-medium text-[#00E5FF]">Now in Public Beta</span>
          </motion.div>

          {/* Heading */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold leading-[1.05] tracking-tight font-['Space_Grotesk']">
              Intelligence<br />
              <GradientText className="text-5xl sm:text-6xl lg:text-[5.5rem] font-bold">That Executes</GradientText>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-7 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Deploy AI agents that handle your customer support, sales inquiries, and business operations — 24/7, autonomously.
          </motion.p>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-bold text-base px-8 py-6 hover:shadow-lg hover:shadow-[#00E5FF]/25 transition-all duration-300 pulse-glow"
            >
              Start Free Trial
              <ArrowRight className="ml-2" size={18} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/5 px-8 py-6 text-base"
            >
              <Play className="mr-2" size={16} />
              Watch Demo
            </Button>
          </motion.div>

          {/* Trust badges */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6 text-sm text-gray-500"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>

          {/* Floating chat mockup with glass effect */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-20 mx-auto max-w-md"
          >
            <div className="glass-card rounded-2xl p-5 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] flex items-center justify-center pulse-glow">
                  <Bot size={18} className="text-[#0B1120]" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">Rehtys AI Agent</p>
                  <p className="text-[11px] text-[#00E5FF] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#10B981] rounded-full animate-pulse" />
                    Online — Ready to help
                  </p>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 text-sm text-gray-300 leading-relaxed border border-white/5">
                Hello! I'm your AI assistant. I can help with orders, FAQs, and support — 24/7. How can I help today?
              </div>
              <div className="mt-3 flex gap-1.5 justify-center">
                <span className="typing-dot w-2 h-2 bg-[#00E5FF] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#00E5FF] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#00E5FF] rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0B1120] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUSTED BY — Marquee logos with visual treatment
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-[0.2em] mb-10">
            Trusted by forward-thinking businesses
          </p>

          {/* Logo marquee */}
          <div className="relative overflow-hidden mask-image-gradient">
            <div className="flex marquee-track" style={{ width: "200%" }}>
              {[...companyLogos, ...companyLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 w-48 mx-6 flex items-center justify-center gap-2 opacity-30 hover:opacity-60 transition-opacity duration-300"
                >
                  <span className="text-xl text-[#00E5FF]/40">{logo.icon}</span>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-gray-400">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: 10000, suffix: "+", label: "Agents Deployed", color: "#00E5FF" },
              { value: 99, suffix: ".9%", label: "Uptime", color: "#10B981" },
              { value: 50, suffix: "ms", label: "Avg Response Time", color: "#F5A623" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="relative"
              >
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-4xl sm:text-5xl font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>
                    <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                  </p>
                  <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          FEATURES — Glass cards with colored icon glow
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix" />
        <div className="absolute inset-0 dot-matrix-radial" />
        <div className="absolute inset-0 mesh-bg opacity-50" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5">
              <Cpu size={12} className="text-[#00E5FF]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Everything your business needs to{" "}
              <span className="text-[#00E5FF]">automate</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Powerful AI tools designed for modern businesses
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {features.map((f) => (
              <motion.div key={f.title} variants={staggerItem}>
                <div className="glass-card rounded-2xl p-6 h-full group cursor-default">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-all duration-300 group-hover:scale-110"
                    style={{ background: `${f.color}15` }}
                  >
                    <f.icon size={22} style={{ color: f.color }} />
                  </div>
                  <h3 className="font-semibold text-white mb-2 text-[15px]">{f.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — Animated sequential steps
          ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix opacity-40" />
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-5xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5">
              <Workflow size={12} className="text-[#00E5FF]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">How It Works</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Three steps to your{" "}
              <span className="text-[#00E5FF]">AI workforce</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-20 left-[18%] right-[18%] h-px">
              <div className="w-full h-full bg-gradient-to-r from-[#00E5FF]/20 via-[#00E5FF]/5 to-[#00E5FF]/20" />
            </div>

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.5 }}
                className="text-center relative"
              >
                <div className="w-18 h-18 rounded-2xl bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] flex items-center justify-center mx-auto mb-6 text-[#0B1120] relative z-10 shadow-lg shadow-[#00E5FF]/20">
                  <step.icon size={24} />
                </div>
                <div className="glass-card rounded-2xl p-5 mx-auto max-w-xs">
                  <p className="text-[10px] text-[#00E5FF] font-bold uppercase tracking-widest mb-1">Step {step.num}</p>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-400">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          PRICING — Syther-inspired with billing toggle + moving border
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix" />
        <div className="absolute inset-0 dot-matrix-radial" />
        <div className="absolute inset-0 mesh-bg opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5">
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight">
              Simple, transparent{" "}
              <GradientText>pricing</GradientText>
            </h2>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-white" : "text-gray-500"}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`billing-toggle ${isYearly ? "active" : ""}`}
              >
                <div className="billing-toggle-circle" />
              </button>
              <span className={`text-sm font-medium transition-colors ${isYearly ? "text-white" : "text-gray-500"}`}>
                Yearly <span className="text-[#00E5FF] font-bold">(Save 20%)</span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => {
              const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
              const setupFee = isYearly ? plan.setupFeeYearly : plan.setupFeeMonthly;

              return (
                <motion.div
                  key={plan.name}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15, duration: 0.5 }}
                  className={`relative pricing-hover rounded-[2rem] ${
                    plan.highlight
                      ? "pricing-card-featured glass-card md:scale-[1.02]"
                      : "glass-card"
                  }`}
                >
                  {/* Featured badge — top right corner like Syther */}
                  {plan.badge && (
                    <div
                      className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest z-10 ${
                        plan.highlight
                          ? "bg-[#00E5FF] text-[#0B1120]"
                          : "bg-[#F5A623] text-[#0B1120]"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-8 md:p-10 flex flex-col h-full">
                    {/* Plan header */}
                    <div className="mb-6">
                      <h3 className="text-xl font-bold text-white mb-1">{plan.name}</h3>
                      <p className="text-sm text-gray-400">{plan.name === "Starter" ? "Basic AI infrastructure." : plan.name === "Pro" ? "Full enterprise autonomy." : "For scaling operations."}</p>
                    </div>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] text-white">
                          ${price}
                        </span>
                        <span className="text-sm text-gray-500">/mo</span>
                      </div>
                      {setupFee > 0 && (
                        <p className="text-xs text-gray-500 mt-2">
                          + ${setupFee} setup
                        </p>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3.5 mb-8 flex-1">
                      {plan.features.map((f) => (
                        <li key={f} className="flex items-center gap-3 text-sm text-gray-300">
                          <Check size={16} className="text-[#00E5FF] shrink-0" />
                          {f}
                        </li>
                      ))}
                    </ul>

                    {/* CTA Button — moving border + shimmer for all */}
                    {plan.highlight ? (
                      <button
                        onClick={() => navigate("/auth")}
                        className="w-full py-4 rounded-xl bg-[#00E5FF] text-[#0B1120] font-black text-sm shimmer-btn moving-border-btn transition-all duration-300 relative z-10"
                      >
                        {plan.cta}
                      </button>
                    ) : (
                      <button
                        onClick={() => navigate("/auth")}
                        className="w-full py-4 rounded-xl border border-white/10 text-white font-bold text-sm hover:bg-white/5 transition-all duration-300 moving-border-btn shimmer-btn relative z-10"
                      >
                        {plan.cta}
                      </button>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-gray-500 mt-10">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS — Glass cards with star ratings
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5">
              <Star size={12} className="text-[#F5A623] fill-[#F5A623]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Loved by businesses{" "}
              <span className="text-[#00E5FF]">worldwide</span>
            </h2>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-3 gap-5"
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={staggerItem}>
                <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.stars }).map((_, s) => (
                      <Star key={s} size={14} className="fill-[#F5A623] text-[#F5A623]" />
                    ))}
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed flex-1">"{t.quote}"</p>
                  <div className="mt-5 pt-4 border-t border-white/5 flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00E5FF]/20 to-[#7B61FF]/20 flex items-center justify-center text-xs font-bold text-white">
                      {t.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.title}, {t.company}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          FAQ — Smooth accordion with glass treatment
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative">
        <div className="absolute inset-0 mesh-bg opacity-30" />
        <div className="relative max-w-3xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 mb-5">
              <MessageSquare size={12} className="text-[#00E5FF]" />
              <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest">FAQ</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Frequently asked{" "}
              <span className="text-[#00E5FF]">questions</span>
            </h2>
          </motion.div>

          <div className="space-y-2.5">
            {faqs.map((faq, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <div className={`glass-card rounded-xl overflow-hidden transition-all duration-300 ${
                  openFaq === i ? "border-[#00E5FF]/20" : ""
                }`}>
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="text-sm font-medium text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      size={18}
                      className={`text-gray-500 transition-transform duration-300 shrink-0 ${
                        openFaq === i ? "rotate-180 text-[#00E5FF]" : ""
                      }`}
                    />
                  </button>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="px-5 pb-5"
                    >
                      <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Rich gradient section with orb
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background layers */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0B1120] via-[#0a1a3a] to-[#0B1120]" />
            <div className="absolute inset-0 grid-pattern-dense" />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[#00E5FF]/[0.08] rounded-full blur-[100px]" />
            <div className="absolute bottom-0 right-0 w-[300px] h-[200px] bg-[#7B61FF]/[0.05] rounded-full blur-[80px]" />
            <div className="absolute inset-0 border border-[#00E5FF]/15 rounded-3xl" />

            {/* Content */}
            <div className="relative z-10 p-12 sm:p-16 text-center">
              <Sparkles size={28} className="text-[#00E5FF] mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
                Ready to automate<br />your business?
              </h2>
              <p className="mt-5 text-gray-400 max-w-lg mx-auto text-lg">
                Join thousands of businesses using Rehtys to deploy intelligent AI agents.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="mt-8 bg-white text-[#0B1120] font-bold px-10 py-6 text-base hover:bg-gray-100 transition-all duration-300 hover:shadow-lg hover:shadow-white/10"
              >
                Start Free Trial — It's Free
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
