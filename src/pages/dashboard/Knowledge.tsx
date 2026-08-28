"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Database, Plus, Search, Trash2, Edit, FileText, Upload, Globe } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface FaqEntry {
  id: string;
  question: string;
  answer: string;
}

export default function DashboardKnowledge() {
  const [entries, setEntries] = useState<FaqEntry[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");
  const [newQ, setNewQ] = useState("");
  const [newA, setNewA] = useState("");

  const handleAdd = () => {
    if (!newQ.trim() || !newA.trim()) return;
    setEntries([...entries, { id: Date.now().toString(), question: newQ, answer: newA }]);
    setNewQ("");
    setNewA("");
    setShowForm(false);
  };

  const filtered = entries.filter(
    (e) =>
      e.question.toLowerCase().includes(search.toLowerCase()) ||
      e.answer.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold font-['Space_Grotesk']">Knowledge Base</h1>
          <p className="text-gray-500 text-sm mt-1">Train your agent with business knowledge</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="border-white/10 text-gray-300 hover:bg-white/5">
            <Upload size={16} className="mr-2" />
            Import
          </Button>
          <Button onClick={() => setShowForm(!showForm)} className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold">
            <Plus size={16} className="mr-2" />
            Add FAQ
          </Button>
        </div>
      </div>

      {/* Add Form */}
      {showForm && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="bg-[#111827] border-[#00E5FF]/20">
            <CardContent className="p-5">
              <h3 className="text-sm font-semibold text-white mb-4">Add New FAQ Entry</h3>
              <div className="space-y-3">
                <Input
                  placeholder="Question"
                  value={newQ}
                  onChange={(e) => setNewQ(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600"
                />
                <Textarea
                  placeholder="Answer"
                  value={newA}
                  onChange={(e) => setNewA(e.target.value)}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-600 min-h-[80px]"
                />
                <div className="flex gap-2 justify-end">
                  <Button variant="ghost" onClick={() => setShowForm(false)} className="text-gray-400">
                    Cancel
                  </Button>
                  <Button onClick={handleAdd} className="bg-[#00E5FF] text-[#0B1120] font-semibold">
                    Save Entry
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Search */}
      <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-lg px-3 py-2 max-w-md">
        <Search size={14} className="text-gray-500" />
        <input
          type="text"
          placeholder="Search knowledge base..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent text-sm text-white placeholder:text-gray-600 outline-none w-full"
        />
      </div>

      {/* Entries or Empty State */}
      {filtered.length === 0 ? (
        <Card className="bg-[#111827] border-white/5">
          <CardContent className="p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-[#00E5FF]/10 flex items-center justify-center mx-auto mb-4">
              <Database size={28} className="text-[#00E5FF]" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Build your agent's knowledge base</h3>
            <p className="text-sm text-gray-400 mb-6 max-w-sm mx-auto">
              Add FAQs, import documents, or upload files to train your AI agent
            </p>
            <div className="flex gap-3 justify-center flex-wrap">
              <Button onClick={() => setShowForm(true)} className="bg-gradient-to-r from-[#00E5FF] to-[#00B8D4] text-[#0B1120] font-semibold">
                <Plus size={16} className="mr-2" />
                Add FAQ Entry
              </Button>
              <Button variant="outline" className="border-white/10 text-gray-300">
                <Globe size={16} className="mr-2" />
                Import from URL
              </Button>
              <Button variant="outline" className="border-white/10 text-gray-300">
                <FileText size={16} className="mr-2" />
                Upload Document
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {filtered.map((entry, i) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card className="bg-[#111827] border-white/5 hover:border-white/10 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white mb-1">{entry.question}</p>
                      <p className="text-xs text-gray-400 line-clamp-2">{entry.answer}</p>
                    </div>
                    <div className="flex gap-1 shrink-0">
                      <Button size="icon" variant="ghost" className="h-7 w-7 text-gray-500 hover:text-white">
                        <Edit size={14} />
                      </Button>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="h-7 w-7 text-gray-500 hover:text-red-400"
                        onClick={() => setEntries(entries.filter((e) => e.id !== entry.id))}
                      >
                        <Trash2 size={14} />
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
