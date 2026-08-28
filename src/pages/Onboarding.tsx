"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2, MessageSquare, Database, Radio, Rocket,
  ArrowRight, ArrowLeft, Check, Plus, Trash2, Copy, Globe, Send,
} from "lucide-react";
import { useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

interface FaqEntry {
  question: string;
  answer: string;
}

interface OnboardingData {
  companyName: string;
  industry: string;
  website: string;
  teamSize: string;
  communicationStyle: string;
  responseLanguage: string;
  toneExamples: string;
  faqs: FaqEntry[];
  channels: { web: boolean; telegram: boolean; whatsapp: boolean; email: boolean };
}

const industries = ["Technology", "E-commerce", "Healthcare", "Finance", "Education", "SaaS", "Other"];
const teamSizes = ["1-5", "6-20", "21-50", "51-200", "200+"];

const steps = [
  { icon: Building2, title: "Business Info", desc: "Tell us about your business" },
  { icon: MessageSquare, title: "Brand Voice", desc: "Set your communication style" },
  { icon: Database, title: "Knowledge Base", desc: "Add FAQs for your agent" },
  { icon: Radio, title: "Channels", desc: "Choose where to deploy" },
  { icon: Rocket, title: "Review & Launch", desc: "Launch your agent" },
];

export default function Onboarding() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<OnboardingData>({
    companyName: "", industry: "", website: "", teamSize: "",
    communicationStyle: "formal", responseLanguage: "English", toneExamples: "",
    faqs: [{ question: "", answer: "" }],
    channels: { web: true, telegram: false, whatsapp: false, email: false },
  });
  const [launched, setLaunched] = useState(false);

  const update = (partial: Partial<OnboardingData>) => setData({ ...data, ...partial });

  const addFaq = () => update({ faqs: [...data.faqs, { question: "", answer: "" }] });
  const removeFaq = (i: number) => update({ faqs: data.faqs.filter((_, idx) => idx !== i) });
  const updateFaq = (i: number, field: keyof FaqEntry, value: string) => {
    const faqs = [...data.faqs];
    faqs[i] = { ...faqs[i], [field]: value };
    update({ faqs });
  };

  const apiKey = "rehtys_live_" + btoa(data.companyName || "demo").slice(0, 24);

  if (launched) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex items-center justify-center px-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-[#10B981]/20 flex items-center justify-center mx-auto mb-6">
            <Check size={36} className="text-[#10B981]" />
          </div>
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-white mb-3">
            Agent Launched! 🚀
          </h1>
          <p className="text-gray-400 mb-8">
            Your AI agent is now live and ready to handle conversations.
          </p>
          <Button
            onClick={() => navigate("/dashboard")}
            className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold px-8"
          >
            Go to Dashboard
            <ArrowRight className="ml-2" size={16} />
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B1120] text-white">
      {/* Top bar */}
      <div className="border-b border-white/5 px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <span className="text-lg font-bold font-['Space_Grotesk']">
            REHTY<span className="text-[#00E5FF]">S</span>
          </span>
          <span className="text-xs text-gray-500">Step {currentStep + 1} of {steps.length}</span>
        </div>
      </div>

      {/* Progress */}
      <div className="max-w-3xl mx-auto px-4 pt-6">
        <div className="flex gap-2">
          {steps.map((s, i) => (
            <div key={i} className="flex-1">
              <div className={`h-1 rounded-full transition-colors duration-300 ${
                i <= currentStep ? "bg-[#00E5FF]" : "bg-white/10"
              }`} />
            </div>
          ))}
        </div>
      </div>

      {/* Step content */}
      <div className="max-w-3xl mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-[#00E5FF]/10 flex items-center justify-center">
                {(() => { const Icon = steps[currentStep].icon; return <Icon size={20} className="text-[#00E5FF]" />; })()}
              </div>
              <div>
                <h2 className="text-xl font-bold font-['Space_Grotesk']">{steps[currentStep].title}</h2>
                <p className="text-sm text-gray-500">{steps[currentStep].desc}</p>
              </div>
            </div>

            {/* Step 1: Business Info */}
            {currentStep === 0 && (
              <Card className="bg-[#111827] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Company Name *</label>
                    <Input
                      value={data.companyName}
                      onChange={(e) => update({ companyName: e.target.value })}
                      placeholder="Acme Corp"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Industry *</label>
                    <select
                      value={data.industry}
                      onChange={(e) => update({ industry: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="">Select industry</option>
                      {industries.map((ind) => (
                        <option key={ind} value={ind}>{ind}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Website URL</label>
                    <Input
                      value={data.website}
                      onChange={(e) => update({ website: e.target.value })}
                      placeholder="https://example.com"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Team Size</label>
                    <select
                      value={data.teamSize}
                      onChange={(e) => update({ teamSize: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                    >
                      <option value="">Select team size</option>
                      {teamSizes.map((size) => (
                        <option key={size} value={size}>{size}</option>
                      ))}
                    </select>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 2: Brand Voice */}
            {currentStep === 1 && (
              <Card className="bg-[#111827] border-white/5">
                <CardContent className="p-6 space-y-5">
                  <div>
                    <label className="text-xs text-gray-500 mb-3 block">Communication Style</label>
                    <div className="grid grid-cols-3 gap-3">
                      {["formal", "casual", "technical"].map((style) => (
                        <button
                          key={style}
                          onClick={() => update({ communicationStyle: style })}
                          className={`p-3 rounded-xl border text-sm capitalize transition-all ${
                            data.communicationStyle === style
                              ? "border-[#00E5FF] bg-[#00E5FF]/10 text-[#00E5FF]"
                              : "border-white/10 text-gray-400 hover:border-white/20"
                          }`}
                        >
                          {style}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Response Language</label>
                    <select
                      value={data.responseLanguage}
                      onChange={(e) => update({ responseLanguage: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-sm text-white outline-none"
                    >
                      <option>English</option>
                      <option>Urdu</option>
                      <option>Custom</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-gray-500 mb-1.5 block">Tone Examples (optional)</label>
                    <Textarea
                      value={data.toneExamples}
                      onChange={(e) => update({ toneExamples: e.target.value })}
                      placeholder="e.g., 'We're excited to help you!' or 'Here's what we found...'"
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 min-h-[80px]"
                    />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 3: Knowledge Base */}
            {currentStep === 2 && (
              <Card className="bg-[#111827] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-gray-500">Add at least 10 FAQ entries to train your agent</p>
                  {data.faqs.map((faq, i) => (
                    <div key={i} className="p-4 bg-white/5 rounded-xl space-y-2 relative">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] text-gray-500 font-semibold uppercase">FAQ #{i + 1}</span>
                        {data.faqs.length > 1 && (
                          <button onClick={() => removeFaq(i)} className="text-gray-600 hover:text-red-400">
                            <Trash2 size={14} />
                          </button>
                        )}
                      </div>
                      <Input
                        value={faq.question}
                        onChange={(e) => updateFaq(i, "question", e.target.value)}
                        placeholder="Question"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm"
                      />
                      <Textarea
                        value={faq.answer}
                        onChange={(e) => updateFaq(i, "answer", e.target.value)}
                        placeholder="Answer"
                        className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 text-sm min-h-[60px]"
                      />
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    onClick={addFaq}
                    className="w-full border-dashed border-white/10 text-gray-400 hover:bg-white/5"
                  >
                    <Plus size={16} className="mr-2" />
                    Add Another FAQ
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Step 4: Channels */}
            {currentStep === 3 && (
              <Card className="bg-[#111827] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <p className="text-xs text-gray-500 mb-2">Select channels for your agent</p>
                  {([
                    { key: "web" as const, label: "Web Widget", desc: "Embed on your website" },
                    { key: "telegram" as const, label: "Telegram", desc: "Connect via Telegram bot" },
                    { key: "whatsapp" as const, label: "WhatsApp", desc: "WhatsApp Business API" },
                    { key: "email" as const, label: "Email", desc: "Auto-respond to emails" },
                  ]).map((ch) => (
                    <button
                      key={ch.key}
                      onClick={() => update({ channels: { ...data.channels, [ch.key]: !data.channels[ch.key] } })}
                      className="w-full flex items-center justify-between p-4 rounded-xl border transition-all text-left"
                    >
                      <div className="flex items-center gap-3">
                        <Globe size={18} className={data.channels[ch.key] ? "text-[#00E5FF]" : "text-gray-500"} />
                        <div>
                          <p className="text-sm font-medium text-white">{ch.label}</p>
                          <p className="text-xs text-gray-500">{ch.desc}</p>
                        </div>
                      </div>
                      <div className={`w-10 h-5 rounded-full relative transition-colors ${
                        data.channels[ch.key] ? "bg-[#00E5FF]" : "bg-white/10"
                      }`}>
                        <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-all ${
                          data.channels[ch.key] ? "left-5.5" : "left-0.5"
                        }`} />
                      </div>
                    </button>
                  ))}

                  {/* API Key */}
                  <div className="mt-4 p-4 bg-white/5 rounded-xl">
                    <p className="text-xs text-gray-500 mb-2">Your API Key</p>
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-xs text-[#00E5FF] font-['JetBrains_Mono'] bg-black/30 px-3 py-2 rounded-lg overflow-hidden text-ellipsis">
                        {apiKey}
                      </code>
                      <Button size="icon" variant="ghost" className="text-gray-400 hover:text-white shrink-0">
                        <Copy size={14} />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Step 5: Review */}
            {currentStep === 4 && (
              <Card className="bg-[#111827] border-white/5">
                <CardContent className="p-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { label: "Company", value: data.companyName || "—" },
                      { label: "Industry", value: data.industry || "—" },
                      { label: "Style", value: data.communicationStyle },
                      { label: "Language", value: data.responseLanguage },
                      { label: "FAQs", value: `${data.faqs.filter((f) => f.question).length} entries` },
                      { label: "Channels", value: Object.entries(data.channels).filter(([, v]) => v).map(([k]) => k).join(", ") || "None" },
                    ].map((item) => (
                      <div key={item.label} className="p-3 bg-white/5 rounded-lg">
                        <p className="text-[10px] text-gray-500 uppercase">{item.label}</p>
                        <p className="text-sm text-white mt-0.5">{item.value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-8">
          <Button
            variant="ghost"
            onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
            disabled={currentStep === 0}
            className="text-gray-400"
          >
            <ArrowLeft size={16} className="mr-2" />
            Back
          </Button>
          {currentStep < steps.length - 1 ? (
            <Button
              onClick={() => setCurrentStep(currentStep + 1)}
              className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </Button>
          ) : (
            <Button
              onClick={() => setLaunched(true)}
              className="bg-gradient-to-r from-[#10B981] to-[#059669] text-white font-semibold px-8"
            >
              <Rocket size={16} className="mr-2" />
              Launch Agent
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
