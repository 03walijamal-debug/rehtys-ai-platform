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
import { ChatWidget } from "@/components/ChatWidget";
import { Button } from "@/components/ui/button";

/* ── Premium Components ─────────────────────────────────────── */
import { Spotlight } from "@/components/ui/spotlight-new";
import { TextGenerateEffect } from "@/components/ui/text-generate-effect";
import { MagneticButton } from "@/components/ui/magnetic-button";
import { ShimmerButton } from "@/components/ui/shimmer-button";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BentoGrid, BentoCard } from "@/components/ui/bento-grid";
import { Timeline } from "@/components/ui/timeline";
import { GlareCard } from "@/components/ui/glare-card";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import { BackgroundBeams } from "@/components/ui/background-beams";
import { Particles } from "@/components/ui/particles";

/* ── Data ───────────────────────────────────────────────────── */

const features = [
  { icon: Bot, title: "AI-Powered Agents", desc: "Deploy intelligent agents trained on your business data", color: "#8C7AE6" },
  { icon: Brain, title: "Smart Knowledge Base", desc: "Agents learn from your FAQs, docs, and past conversations", color: "#A78BFA" },
  { icon: Globe, title: "Multi-Channel", desc: "Connect via Web, Telegram, WhatsApp, Email, and more", color: "#34D399" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor agent performance, conversations, and satisfaction", color: "#FBBF24" },
  { icon: Zap, title: "Instant Deployment", desc: "Go live in minutes with our guided onboarding", color: "#F87171" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant, encrypted, with role-based access", color: "#8C7AE6" },
];

const timelineData = [
  {
    title: "Sign Up",
    content: (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-[10px] text-[#8C7AE6] font-bold uppercase tracking-widest mb-2">Step 1</p>
        <h3 className="text-lg font-bold text-[#D9DCE3] mb-2">Create your account in 30 seconds</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Sign up with your email, set up your organization, and you're ready to start building your AI workforce. No credit card required.
        </p>
      </div>
    ),
  },
  {
    title: "Configure",
    content: (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-[10px] text-[#8C7AE6] font-bold uppercase tracking-widest mb-2">Step 2</p>
        <h3 className="text-lg font-bold text-[#D9DCE3] mb-2">Train your agent with your business knowledge</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Upload your FAQs, documents, and past conversations. Set your brand voice and communication style. Your agent learns everything it needs.
        </p>
      </div>
    ),
  },
  {
    title: "Deploy",
    content: (
      <div className="glass-card rounded-2xl p-6">
        <p className="text-[10px] text-[#8C7AE6] font-bold uppercase tracking-widest mb-2">Step 3</p>
        <h3 className="text-lg font-bold text-[#D9DCE3] mb-2">Go live across all your channels</h3>
        <p className="text-sm text-[#9CA3AF] leading-relaxed">
          Connect to Web, Telegram, WhatsApp, and Email. Your AI agent handles customer support 24/7 — autonomously, intelligently, instantly.
        </p>
      </div>
    ),
  },
];

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
  },
];

const testimonials = [
  { quote: "Rehtys reduced our support ticket volume by 60% in the first month. The AI agent handles common queries perfectly.", name: "Sarah Chen", title: "Head of Support, TechFlow Inc." },
  { quote: "We went from 3-hour response times to instant. Our customers love the 24/7 availability and the quality of responses.", name: "Marcus Rivera", title: "CEO, GrowthMetrics" },
  { quote: "The knowledge base training is incredible. Our agent sounds exactly like our best support rep — but works 24/7.", name: "Priya Sharma", title: "CTO, DataSync" },
  { quote: "Setup took 5 minutes. Within an hour, our AI agent was handling real customer inquiries. The ROI was immediate.", name: "Alex Thompson", title: "VP Operations, CloudBase" },
  { quote: "We tested 10+ AI platforms. Rehtys is the only one that actually delivers on the promise of autonomous customer support.", name: "Fatima Al-Hassan", title: "Director of CX, NexusAI" },
  { quote: "The analytics dashboard alone is worth it. We can see exactly how our AI performs and optimize in real-time.", name: "David Park", title: "Product Lead, Quantum Labs" },
];

const faqCategories = [
  { id: "all", label: "All Questions" },
  { id: "general", label: "General" },
  { id: "setup", label: "Setup & Timeline" },
  { id: "pricing", label: "Pricing & Contracts" },
  { id: "technical", label: "Technical" },
];

const faqs = [
  { cat: "general", q: "What is Rehtys?", a: "Rehtys is an <strong>AI Agent marketplace</strong> where businesses rent AI-powered customer service agents. Our agents handle support, sales inquiries, and business operations <strong>24/7 autonomously</strong>.", highlight: "Trusted by 10,000+ businesses worldwide" },
  { cat: "general", q: "How does the free trial work?", a: "Every plan includes a <strong>14-day free trial</strong> with full access. No credit card required. Cancel anytime during the trial.", highlight: "✓ No credit card required" },
  { cat: "general", q: "Can I customize my AI agent?", a: "Absolutely. Train your agent with your <strong>business knowledge, FAQs, and documents</strong>. Set custom communication styles.", highlight: null },
  { cat: "setup", q: "How do I deploy my agent?", a: "It takes <strong>less than 5 minutes</strong>. Sign up, configure your agent, select channels, and hit deploy.", highlight: "⚡ Average go-live: 5 minutes" },
  { cat: "setup", q: "What channels are supported?", a: "Starter includes <strong>Web and Telegram</strong>. Pro and Business add WhatsApp, Email, and API access.", highlight: null },
  { cat: "pricing", q: "Can I cancel anytime?", a: "Yes — <strong>no lock-in contracts, no penalty fees</strong>. Cancel from your dashboard anytime.", highlight: null },
  { cat: "pricing", q: "Do you offer refunds?", a: "We offer a <strong>full refund within the first 14 days</strong>. After that, cancel anytime but no partial month refunds.", highlight: "✓ 14-day money-back guarantee" },
  { cat: "technical", q: "Is my data secure?", a: "Your data stays <strong>yours at all times</strong>. SOC 2 compliant, end-to-end encryption, role-based access.", highlight: null },
];

const companyLogos = [
  { name: "Acme Corp", icon: "◆" },
  { name: "TechFlow", icon: "▲" },
  { name: "GrowthMetrics", icon: "●" },
  { name: "DataSync", icon: "◇" },
  { name: "CloudBase", icon: "■" },
  { name: "NexusAI", icon: "⬡" },
];

/* ── Page ───────────────────────────────────────────────────── */

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isYearly, setIsYearly] = useState(false);
  const [faqCat, setFaqCat] = useState("all");

  return (
    <div className="min-h-screen bg-[#0D0B1A] text-white overflow-x-hidden">
      <Navbar />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Spotlight + Particles + BackgroundBeams + TextGenerate
          ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Spotlight background */}
        <Spotlight className="absolute inset-0" />

        {/* Background beams — subtle light rays */}
        <div className="absolute inset-0 opacity-30">
          <BackgroundBeams />
        </div>

        {/* Interactive particles */}
        <Particles
          className="absolute inset-0"
          quantity={80}
          color="#8C7AE6"
          ease={70}
          size={0.6}
          staticity={30}
        />

        {/* Aurora blobs */}
        <div className="aurora-container">
          <div className="aurora-blob aurora-blob-1" />
          <div className="aurora-blob aurora-blob-2" />
        </div>

        {/* Dot matrix overlay */}
        <div className="absolute inset-0 dot-matrix opacity-20" />
        <div className="absolute inset-0 noise-overlay" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-20">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#8C7AE6]/20 bg-[#8C7AE6]/5 mb-8"
          >
            <Sparkles size={14} className="text-[#8C7AE6]" />
            <span className="text-xs font-medium text-[#8C7AE6]">Now in Public Beta</span>
          </motion.div>

          {/* Heading — Text Generate Effect */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7, delay: 0.1 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-[6.5rem] xl:text-[7.5rem] font-bold leading-[1.02] tracking-tight font-['Space_Grotesk']">
              Intelligence<br />
              <GradientText className="text-5xl sm:text-6xl lg:text-[6.5rem] xl:text-[7.5rem] font-bold">That Executes</GradientText>
            </h1>
          </motion.div>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-8 text-lg sm:text-xl lg:text-2xl text-[#9CA3AF] max-w-3xl mx-auto leading-relaxed"
          >
            Deploy AI agents that handle your customer support, sales inquiries, and business operations — <span className="text-[#D9DCE3]">24/7, autonomously</span>.
          </motion.p>

          {/* CTAs — Magnetic + Shimmer */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <MagneticButton>
              <ShimmerButton
                shimmerColor="#8C7AE6"
                shimmerDuration="3s"
                background="linear-gradient(135deg, #2C2A72, #8C7AE6)"
                className="px-8 py-6 text-base font-bold"
                onClick={() => navigate("/auth")}
              >
                <span className="flex items-center gap-2">
                  Start Free Trial
                  <ArrowRight size={18} />
                </span>
              </ShimmerButton>
            </MagneticButton>
            <Button
              size="lg"
              variant="outline"
              className="border-[#1E1B3A] text-[#D9DCE3] hover:bg-white/5 px-8 py-6 text-base"
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
            className="mt-6 text-sm text-[#6B7280]"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>

          {/* Floating chat mockup */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.9, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="mt-20 mx-auto max-w-md"
          >
            <div className="glass-card rounded-2xl p-5 shadow-2xl shadow-black/50">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#2C2A72] to-[#8C7AE6] flex items-center justify-center pulse-glow">
                  <Bot size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-[#D9DCE3]">Rehtys AI Agent</p>
                  <p className="text-[11px] text-[#8C7AE6] flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-[#34D399] rounded-full animate-pulse" />
                    Online — Ready to help
                  </p>
                </div>
              </div>
              <div className="bg-white/[0.03] rounded-xl p-4 text-sm text-[#9CA3AF] leading-relaxed border border-[#1E1B3A]">
                Hello! I'm your AI assistant. I can help with orders, FAQs, and support — 24/7. How can I help today?
              </div>
              <div className="mt-3 flex gap-1.5 justify-center">
                <span className="typing-dot w-2 h-2 bg-[#8C7AE6] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#8C7AE6] rounded-full" />
                <span className="typing-dot w-2 h-2 bg-[#8C7AE6] rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0D0B1A] to-transparent" />
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TRUSTED BY + STATS — Marquee logos + Number Ticker
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-20 relative">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-[0.2em] mb-10">
            Trusted by forward-thinking businesses
          </p>

          {/* Stats with Number Ticker */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-16">
            {[
              { value: 10000, suffix: "+", label: "Agents Deployed", color: "#8C7AE6" },
              { value: 99.9, suffix: "%", label: "Uptime", color: "#34D399", decimals: 1 },
              { value: 50, suffix: "ms", label: "Avg Response Time", color: "#FBBF24" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
              >
                <div className="glass-card rounded-2xl p-6 text-center">
                  <p className="text-4xl sm:text-5xl font-bold font-['JetBrains_Mono']" style={{ color: stat.color }}>
                    <NumberTicker
                      value={stat.value}
                      className="inline-block"
                      decimalPlaces={stat.decimals ?? 0}
                    />
                    <span className="text-2xl sm:text-3xl">{stat.suffix}</span>
                  </p>
                  <p className="mt-2 text-sm text-[#6B7280]">{stat.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Logo marquee */}
          <div className="relative overflow-hidden mask-image-gradient">
            <div className="flex marquee-track" style={{ width: "200%" }}>
              {[...companyLogos, ...companyLogos].map((logo, i) => (
                <div
                  key={`${logo.name}-${i}`}
                  className="flex-shrink-0 w-48 mx-6 flex items-center justify-center gap-2 opacity-30 hover:opacity-60 transition-opacity duration-300"
                >
                  <span className="text-xl text-[#8C7AE6]/40">{logo.icon}</span>
                  <span className="text-base font-bold font-['Space_Grotesk'] text-[#9CA3AF]">
                    {logo.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          FEATURES — Bento Grid
          ═══════════════════════════════════════════════════════════ */}
      <section id="features" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix opacity-20" />
        <div className="absolute inset-0 dot-matrix-radial" />
        <div className="relative max-w-6xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E1B3A] bg-[#13112A] mb-5">
              <Cpu size={12} className="text-[#8C7AE6]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Features</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Everything your business needs to{" "}
              <span className="text-[#8C7AE6]">automate</span>
            </h2>
            <p className="mt-4 text-[#9CA3AF] max-w-xl mx-auto">
              Powerful AI tools designed for modern businesses
            </p>
          </motion.div>

          {/* Bento Grid */}
          <BentoGrid className="lg:grid-cols-3">
            {features.map((f, i) => (
              <BentoCard
                key={f.title}
                name={f.title}
                description={f.desc}
                href="#"
                cta="Learn more"
                Icon={f.icon}
                className={i < 2 ? "lg:col-span-2" : "lg:col-span-1"}
                background={
                  <div className="absolute inset-0 bg-gradient-to-br from-[#13112A] to-[#0D0B1A] opacity-80">
                    <div
                      className="absolute top-4 right-4 w-32 h-32 rounded-full blur-[60px] opacity-20"
                      style={{ background: f.color }}
                    />
                  </div>
                }
              />
            ))}
          </BentoGrid>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          HOW IT WORKS — Timeline
          ═══════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix opacity-20" />
        <div className="absolute inset-0 bg-[#0D0B1A]" />
        <div className="relative">
          <Timeline data={timelineData} />
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          PRICING — Glare Cards + Shimmer Buttons
          ═══════════════════════════════════════════════════════════ */}
      <section id="pricing" className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 dot-matrix opacity-20" />
        <div className="absolute inset-0 mesh-bg opacity-30" />

        <div className="relative max-w-6xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E1B3A] bg-[#13112A] mb-5">
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight">
              Simple, transparent{" "}
              <GradientText>pricing</GradientText>
            </h2>

            {/* Billing Toggle */}
            <div className="flex items-center justify-center gap-4 mt-8">
              <span className={`text-sm font-medium transition-colors ${!isYearly ? "text-[#D9DCE3]" : "text-[#6B7280]"}`}>Monthly</span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`billing-toggle ${isYearly ? "active" : ""}`}
              >
                <div className="billing-toggle-circle" />
              </button>
              <span className={`text-sm font-medium transition-colors ${isYearly ? "text-[#D9DCE3]" : "text-[#6B7280]"}`}>
                Yearly <span className="text-[#8C7AE6] font-bold">(Save 20%)</span>
              </span>
            </div>
          </motion.div>

          {/* Pricing Cards — Glare Cards */}
          <div className="flex flex-col md:flex-row gap-6 items-start justify-center">
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
                  className={`relative ${plan.highlight ? "md:scale-105 z-10" : ""}`}
                >
                  {/* Featured badge */}
                  {plan.badge && (
                    <div
                      className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-xl text-[10px] font-bold uppercase tracking-widest z-20 ${
                        plan.highlight
                          ? "bg-[#8C7AE6] text-white"
                          : "bg-[#FBBF24] text-[#0D0B1A]"
                      }`}
                    >
                      {plan.badge}
                    </div>
                  )}

                  <GlareCard className={`w-full ${plan.highlight ? "pricing-card-featured" : ""}`}>
                    <div className="p-8 flex flex-col h-full min-h-[420px]">
                      <h3 className="text-xl font-bold text-[#D9DCE3] mb-1">{plan.name}</h3>
                      <p className="text-sm text-[#6B7280] mb-6">
                        {plan.name === "Starter" ? "Basic AI infrastructure." : plan.name === "Pro" ? "Full enterprise autonomy." : "For scaling operations."}
                      </p>

                      <div className="mb-6">
                        <div className="flex items-baseline gap-1">
                          <span className="text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] text-[#D9DCE3]">
                            ${price}
                          </span>
                          <span className="text-sm text-[#6B7280]">/mo</span>
                        </div>
                        {setupFee > 0 && (
                          <p className="text-xs text-[#6B7280] mt-2">+ ${setupFee} setup</p>
                        )}
                      </div>

                      <ul className="space-y-3.5 mb-8 flex-1">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-center gap-3 text-sm text-[#9CA3AF]">
                            <Check size={16} className="text-[#8C7AE6] shrink-0" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <ShimmerButton
                        shimmerColor="#8C7AE6"
                        shimmerDuration="3s"
                        background={plan.highlight ? "linear-gradient(135deg, #2C2A72, #8C7AE6)" : "transparent"}
                        className={`w-full py-4 text-sm font-bold ${
                          plan.highlight ? "" : "border border-[#1E1B3A] text-[#D9DCE3]"
                        }`}
                        onClick={() => navigate("/auth")}
                      >
                        {plan.cta}
                      </ShimmerButton>
                    </div>
                  </GlareCard>
                </motion.div>
              );
            })}
          </div>

          <p className="text-center text-sm text-[#6B7280] mt-10">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS — Infinite Moving Cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-20" />
        <div className="relative max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[#1E1B3A] bg-[#13112A] mb-5">
              <Star size={12} className="text-[#FBBF24] fill-[#FBBF24]" />
              <span className="text-[10px] font-semibold text-[#9CA3AF] uppercase tracking-widest">Testimonials</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
              Loved by businesses{" "}
              <span className="text-[#8C7AE6]">worldwide</span>
            </h2>
          </motion.div>

          {/* Infinite scroll row 1 */}
          <InfiniteMovingCards
            items={testimonials.slice(0, 3)}
            direction="left"
            speed="normal"
            className="mb-4"
          />

          {/* Infinite scroll row 2 — reversed */}
          <InfiniteMovingCards
            items={testimonials.slice(3, 6)}
            direction="right"
            speed="slow"
          />
        </div>
      </section>

      {/* Divider */}
      <div className="section-divider max-w-4xl mx-auto" />

      {/* ═══════════════════════════════════════════════════════════
          FAQ — 2-column with categories & trust cards
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28 relative overflow-hidden" id="faq">
        <div className="absolute inset-0 dot-matrix opacity-20" />
        <div className="absolute top-[20%] right-[-10%] w-[500px] h-[500px] bg-[#8C7AE6]/[0.03] rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[10%] left-[-10%] w-[400px] h-[400px] bg-[#2C2A72]/[0.04] rounded-full blur-[100px] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-4">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#8C7AE6]/[0.05] border border-[#8C7AE6]/15 mb-5">
              <span className="w-1.5 h-1.5 bg-[#8C7AE6] rounded-full animate-pulse" />
              <span className="text-[11px] font-semibold text-[#8C7AE6]/80 uppercase tracking-[0.15em]">Got Questions?</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk'] tracking-tight">
              Everything You{" "}<GradientText>Need To Know</GradientText>
            </h2>
            <p className="mt-4 text-[#9CA3AF] max-w-xl mx-auto">Straight answers. No fluff.</p>
          </motion.div>

          {/* 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-12 items-start">
            {/* LEFT — Sticky Sidebar */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:sticky lg:top-28"
            >
              <h3 className="text-xl font-bold text-[#D9DCE3] mb-1 font-['Space_Grotesk']">Browse by<br /><span className="text-[#8C7AE6]">Topic</span></h3>
              <p className="text-xs text-[#6B7280] mb-6 leading-relaxed">Click any category to filter questions.</p>

              <div className="flex flex-col gap-1.5 mb-8">
                {faqCategories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setFaqCat(cat.id)}
                    className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] text-left transition-all duration-200 border ${
                      faqCat === cat.id
                        ? "text-[#8C7AE6] bg-[#8C7AE6]/[0.05] border-[#8C7AE6]/20"
                        : "text-[#6B7280] bg-transparent border-transparent hover:text-[#D9DCE3] hover:bg-white/[0.03] hover:border-white/[0.06]"
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 transition-colors ${
                      faqCat === cat.id ? "bg-[#8C7AE6]" : "bg-white/10"
                    }`} />
                    {cat.label}
                  </button>
                ))}
              </div>

              {/* CTA Box */}
              <div className="glass-card rounded-2xl p-5">
                <p className="text-2xl mb-2">💬</p>
                <p className="text-sm font-bold text-[#D9DCE3] mb-1 font-['Space_Grotesk']">Still have questions?</p>
                <p className="text-xs text-[#6B7280] mb-4 leading-relaxed">Our team responds within 2 hours — real humans, no bots.</p>
                <button
                  onClick={() => navigate("/auth")}
                  className="w-full py-2.5 rounded-lg bg-[#8C7AE6] text-white text-xs font-bold hover:bg-[#8C7AE6]/90 transition-all flex items-center justify-center gap-2"
                >
                  <MessageSquare size={13} />
                  Contact Support
                </button>
              </div>
            </motion.div>

            {/* RIGHT — Accordion */}
            <div className="space-y-2">
              {faqs
                .filter((f) => faqCat === "all" || f.cat === faqCat)
                .map((faq, i) => {
                  const globalIndex = faqs.indexOf(faq);
                  const isOpen = openFaq === globalIndex;
                  return (
                    <motion.div
                      key={globalIndex}
                      initial={{ opacity: 0, y: 14 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: i * 0.04 }}
                      className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                        isOpen
                          ? "border-[#8C7AE6]/20 bg-[#13112A]/80"
                          : "border-[#1E1B3A] bg-white/[0.02] hover:border-[#1E1B3A]"
                      } backdrop-blur-sm`}
                    >
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : globalIndex)}
                        className="w-full flex items-center gap-4 p-5 text-left"
                      >
                        <span className={`text-[11px] font-bold tracking-wider font-['Space_Grotesk'] min-w-[22px] shrink-0 transition-colors ${
                          isOpen ? "text-[#8C7AE6]" : "text-white/15"
                        }`}>
                          {String(i + 1).padStart(2, "0")}
                        </span>
                        <span className={`text-[15px] font-medium flex-1 transition-colors ${
                          isOpen ? "text-[#D9DCE3]" : "text-[#9CA3AF]"
                        }`}>
                          {faq.q}
                        </span>
                        <span className={`w-7 h-7 rounded-full border flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isOpen
                            ? "bg-[#8C7AE6]/[0.08] border-[#8C7AE6]/25 rotate-45"
                            : "border-[#1E1B3A] bg-transparent rotate-0"
                        }`}>
                          <svg width="11" height="11" viewBox="0 0 12 12" fill="none" strokeWidth="2" strokeLinecap="round">
                            <path d="M6 1v10M1 6h10" stroke={isOpen ? "#8C7AE6" : "rgba(255,255,255,0.3)"} />
                          </svg>
                        </span>
                      </button>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          transition={{ duration: 0.3 }}
                          className="px-5 pb-5 pl-[60px]"
                        >
                          <p
                            className="text-sm text-[#9CA3AF] leading-[1.8] font-light"
                            dangerouslySetInnerHTML={{ __html: faq.a }}
                          />
                          {faq.highlight && (
                            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-[#8C7AE6]/[0.06] border border-[#8C7AE6]/15 text-[#8C7AE6]/80 text-xs font-medium">
                              {faq.highlight}
                            </div>
                          )}
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
            </div>
          </div>

          {/* Bottom Trust Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-16"
          >
            {[
              { icon: "⚡", title: "2-Hour Response", sub: "Real humans, not bots" },
              { icon: "🔒", title: "No Lock-in", sub: "Cancel anytime, no penalty" },
              { icon: "🎙️", title: "Free Live Demo", sub: "Test before you commit" },
            ].map((card) => (
              <div
                key={card.title}
                className="glass-card rounded-2xl p-5 flex items-center gap-4 hover:border-[#8C7AE6]/15 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="text-2xl shrink-0">{card.icon}</span>
                <div>
                  <p className="text-sm font-bold text-[#D9DCE3] font-['Space_Grotesk']">{card.title}</p>
                  <p className="text-xs text-[#6B7280]">{card.sub}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CTA — Shimmer Button + Background Beams
          ═══════════════════════════════════════════════════════════ */}
      <section className="py-28">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden"
          >
            {/* Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0D0B1A] via-[#13112A] to-[#0D0B1A]" />
            <div className="absolute inset-0 opacity-20">
              <BackgroundBeams />
            </div>
            <div className="absolute inset-0 border border-[#8C7AE6]/10 rounded-3xl" />

            {/* Content */}
            <div className="relative z-10 p-12 sm:p-16 text-center">
              <Sparkles size={28} className="text-[#8C7AE6] mx-auto mb-4" />
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-['Space_Grotesk']">
                Ready to automate<br />your business?
              </h2>
              <p className="mt-5 text-[#9CA3AF] max-w-lg mx-auto text-lg">
                Join thousands of businesses using Rehtys to deploy intelligent AI agents.
              </p>
              <div className="mt-8 flex justify-center">
                <MagneticButton>
                  <ShimmerButton
                    shimmerColor="#ffffff"
                    shimmerDuration="3s"
                    background="white"
                    className="px-10 py-6 text-base font-bold text-[#0D0B1A]"
                    onClick={() => navigate("/auth")}
                  >
                    <span className="flex items-center gap-2">
                      Start Free Trial — It's Free
                      <ArrowRight size={18} />
                    </span>
                  </ShimmerButton>
                </MagneticButton>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
