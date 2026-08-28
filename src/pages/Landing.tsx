"use client";

import { motion } from "framer-motion";
import {
  Bot, Brain, Globe, BarChart3, Zap, Shield, Star, ChevronDown,
  Play, Check, ArrowRight, Users, Clock, Server, MessageCircle,
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
import { Card, CardContent } from "@/components/ui/card";

/* ── Data ───────────────────────────────────────────────────── */

const features = [
  { icon: Bot, title: "AI-Powered Agents", desc: "Deploy intelligent agents trained on your business data" },
  { icon: Brain, title: "Smart Knowledge Base", desc: "Agents learn from your FAQs, docs, and past conversations" },
  { icon: Globe, title: "Multi-Channel", desc: "Connect via Web, Telegram, WhatsApp, Email, and more" },
  { icon: BarChart3, title: "Real-Time Analytics", desc: "Monitor agent performance, conversations, and satisfaction" },
  { icon: Zap, title: "Instant Deployment", desc: "Go live in minutes with our guided onboarding" },
  { icon: Shield, title: "Enterprise Security", desc: "SOC 2 compliant, encrypted, with role-based access" },
];

const steps = [
  { num: 1, title: "Sign Up", desc: "Create your account in 30 seconds" },
  { num: 2, title: "Configure", desc: "Train your agent with your business knowledge" },
  { num: 3, title: "Deploy", desc: "Go live across all your channels" },
];

const plans = [
  {
    name: "Starter",
    price: "$89",
    period: "/month",
    badge: null,
    features: ["1 AI Agent", "1,000 conversations/mo", "Web + Telegram", "Basic analytics", "Email support"],
    highlight: false,
  },
  {
    name: "Pro",
    price: "$199",
    period: "/month",
    badge: "MOST POPULAR",
    features: ["3 AI Agents", "5,000 conversations/mo", "All channels", "Advanced analytics", "Priority support", "Custom branding"],
    highlight: true,
  },
  {
    name: "Business",
    price: "$499",
    period: "/month",
    badge: "ENTERPRISE",
    features: ["Unlimited agents", "Unlimited conversations", "All channels + API", "Custom integrations", "Dedicated account manager", "SLA guarantee"],
    highlight: false,
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

const companyLogos = ["Acme Corp", "TechFlow", "GrowthMetrics", "DataSync", "CloudBase", "NexusAI"];

/* ── Section Variants ──────────────────────────────────────── */

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0 },
};

/* ── Page ───────────────────────────────────────────────────── */

export default function Landing() {
  const navigate = useNavigate();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <ParticleBackground />

        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#7B61FF]/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center pt-24 pb-20">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-tight tracking-tight font-['Space_Grotesk']">
              Intelligence<br />
              <GradientText className="text-5xl sm:text-6xl lg:text-8xl font-bold">That Executes</GradientText>
            </h1>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6 }}
            className="mt-6 text-lg sm:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed"
          >
            Deploy AI agents that handle your customer support, sales inquiries, and business operations — 24/7, autonomously.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              onClick={() => navigate("/auth")}
              className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-bold text-base px-8 py-6 hover:shadow-lg hover:shadow-[#00E5FF]/25 transition-all duration-300"
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

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-6 text-sm text-gray-500"
          >
            No credit card required • 14-day free trial • Cancel anytime
          </motion.p>

          {/* Floating chat mockup */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 mx-auto max-w-sm"
          >
            <div className="bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-2xl shadow-black/40">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-[#00E5FF] flex items-center justify-center">
                  <Bot size={16} className="text-[#0B1120]" />
                </div>
                <div>
                  <p className="text-xs font-semibold">Rehtys AI Agent</p>
                  <p className="text-[10px] text-[#00E5FF]">● Online</p>
                </div>
              </div>
              <div className="bg-white/5 rounded-xl p-3 text-xs text-gray-300 leading-relaxed">
                Hello! I'm your AI assistant. I can help with orders, FAQs, and support — 24/7. How can I help today?
              </div>
              <div className="mt-3 flex gap-1 justify-center">
                <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
                <span className="typing-dot w-1.5 h-1.5 bg-[#00E5FF] rounded-full" />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── TRUSTED BY ──────────────────────────────────────── */}
      <section className="py-20 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-500 uppercase tracking-widest mb-8">Trusted by forward-thinking businesses</p>
          <div className="flex flex-wrap justify-center gap-8 sm:gap-12 opacity-40">
            {companyLogos.map((name) => (
              <div key={name} className="text-lg font-bold font-['Space_Grotesk'] text-gray-400">
                {name}
              </div>
            ))}
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8">
            {[
              { value: 10000, suffix: "+", label: "Agents Deployed" },
              { value: 99, suffix: ".9%", label: "Uptime" },
              { value: 50, suffix: "ms", label: "Avg Response Time" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-4xl sm:text-5xl font-bold font-['JetBrains_Mono'] text-white">
                  <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                </p>
                <p className="mt-2 text-sm text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk']">
              Everything your business needs to{" "}
              <span className="text-[#00E5FF]">automate</span>
            </h2>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto">
              Powerful AI tools designed for modern businesses
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                variants={fadeUp}
              >
                <Card className="bg-[#111827] border-white/5 hover:border-[#00E5FF]/30 hover:shadow-lg hover:shadow-[#00E5FF]/5 transition-all duration-300 h-full">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center mb-4">
                      <f.icon size={22} className="text-[#00E5FF]" />
                    </div>
                    <h3 className="font-semibold text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 border-t border-white/5">
        <div className="max-w-5xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-center mb-16">
            Three steps to your{" "}
            <span className="text-[#00E5FF]">AI workforce</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[20%] right-[20%] h-px bg-gradient-to-r from-[#00E5FF]/30 via-[#00E5FF]/10 to-[#00E5FF]/30" />

            {steps.map((step, i) => (
              <motion.div
                key={step.num}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="text-center relative"
              >
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00E5FF] to-[#00B8D4] flex items-center justify-center mx-auto mb-5 text-[#0B1120] font-bold text-xl font-['Space_Grotesk'] relative z-10">
                  {step.num}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                <p className="text-sm text-gray-400">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────────── */}
      <section id="pricing" className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-center mb-4">
            Simple, transparent{" "}
            <span className="text-[#00E5FF]">pricing</span>
          </h2>
          <p className="text-center text-gray-400 mb-16">Choose the plan that fits your business</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
            {plans.map((plan, i) => (
              <motion.div
                key={plan.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                whileHover={{ y: -4 }}
                className={`relative rounded-2xl border ${
                  plan.highlight
                    ? "border-[#00E5FF] shadow-lg shadow-[#00E5FF]/10 scale-105"
                    : "border-white/10"
                } bg-[#111827] p-6`}
              >
                {plan.badge && (
                  <div
                    className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold tracking-wider ${
                      plan.highlight
                        ? "bg-[#00E5FF] text-[#0B1120]"
                        : "bg-[#F5A623] text-[#0B1120]"
                    }`}
                  >
                    {plan.badge}
                  </div>
                )}
                <div className="pt-2">
                  <h3 className="text-lg font-semibold text-white">{plan.name}</h3>
                  <div className="mt-3 flex items-baseline gap-1">
                    <span className="text-4xl font-bold font-['Space_Grotesk'] text-white">{plan.price}</span>
                    <span className="text-sm text-gray-500">{plan.period}</span>
                  </div>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-center gap-2 text-sm text-gray-300">
                        <Check size={16} className="text-[#00E5FF] shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    onClick={() => navigate("/auth")}
                    className={`w-full mt-8 ${
                      plan.highlight
                        ? "bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold hover:shadow-lg hover:shadow-[#00E5FF]/20"
                        : "bg-white/5 border border-white/10 text-white hover:bg-white/10"
                    }`}
                    variant={plan.highlight ? "default" : "outline"}
                  >
                    Start Free Trial
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-8">
            All plans include 14-day free trial. No credit card required.
          </p>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-center mb-16">
            Loved by businesses{" "}
            <span className="text-[#00E5FF]">worldwide</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div
                key={t.name}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
              >
                <Card className="bg-[#111827] border-white/5 h-full">
                  <CardContent className="p-6">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.stars }).map((_, s) => (
                        <Star key={s} size={14} className="fill-[#F5A623] text-[#F5A623]" />
                      ))}
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed mb-6">"{t.quote}"</p>
                    <div>
                      <p className="text-sm font-semibold text-white">{t.name}</p>
                      <p className="text-xs text-gray-500">{t.title}, {t.company}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ─────────────────────────────────────────────── */}
      <section className="py-24 border-t border-white/5">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk'] text-center mb-12">
            Frequently asked{" "}
            <span className="text-[#00E5FF]">questions</span>
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <div key={i} className="border border-white/5 rounded-xl overflow-hidden bg-[#111827]">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left"
                >
                  <span className="text-sm font-medium text-white">{faq.q}</span>
                  <ChevronDown
                    size={18}
                    className={`text-gray-500 transition-transform duration-200 shrink-0 ml-4 ${
                      openFaq === i ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {openFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    transition={{ duration: 0.2 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-sm text-gray-400 leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4">
          <div className="relative rounded-3xl bg-gradient-to-br from-[#0B1120] via-[#0a1a3a] to-[#0B1120] border border-[#00E5FF]/20 p-12 sm:p-16 text-center overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#00E5FF]/5 rounded-full blur-3xl" />
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold font-['Space_Grotesk']">
                Ready to automate your business?
              </h2>
              <p className="mt-4 text-gray-400 max-w-lg mx-auto">
                Join thousands of businesses using Rehtys to deploy intelligent AI agents.
              </p>
              <Button
                size="lg"
                onClick={() => navigate("/auth")}
                className="mt-8 bg-white text-[#0B1120] font-bold px-8 py-6 hover:bg-gray-100 transition-colors"
              >
                Start Free Trial — It's Free
                <ArrowRight className="ml-2" size={18} />
              </Button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
      <ChatWidget />
    </div>
  );
}
