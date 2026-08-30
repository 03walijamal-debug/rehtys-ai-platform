import { useState } from "react";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  BookOpen, 
  Edit3, 
  Trash2, 
  Tag,
  Upload,
  Download
} from "lucide-react";

const mockFAQs = [
  {
    id: "1",
    question: "What are your pricing plans?",
    answer: "We offer three plans: Free ($0/month with 500 messages), Pro ($89/month with unlimited messages), and Enterprise (Custom pricing).",
    category: "Pricing",
  },
  {
    id: "2",
    question: "How do I integrate the chat widget?",
    answer: "Simply copy the embed code from Settings > Channels > Web Widget and paste it into your website's HTML.",
    category: "Technical",
  },
  {
    id: "3",
    question: "Can I connect my WhatsApp Business account?",
    answer: "Yes! Pro and Enterprise plans support WhatsApp integration. Go to Settings > Channels > WhatsApp to connect.",
    category: "Channels",
  },
];

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newCategory, setNewCategory] = useState("General");

  const filteredFAQs = mockFAQs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddFAQ = () => {
    if (newQuestion.trim() && newAnswer.trim()) {
      console.log("Adding FAQ:", { question: newQuestion, answer: newAnswer, category: newCategory });
      setShowAddModal(false);
      setNewQuestion("");
      setNewAnswer("");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-slate-400 mt-1">Train your agent with FAQs and custom responses</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </button>
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add FAQ
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search your knowledge base..."
          className="w-full pl-12 pr-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
        />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-cyan-500/10 rounded-xl flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-cyan-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{mockFAQs.length}</p>
              <p className="text-slate-400 text-sm">Total FAQs</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">3</p>
              <p className="text-slate-400 text-sm">Categories</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">89%</p>
              <p className="text-slate-400 text-sm">Match Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* FAQs List */}
      <div className="space-y-3">
        {filteredFAQs.map((faq, index) => (
          <motion.div
            key={faq.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-1 bg-cyan-500/10 text-cyan-400 text-xs font-medium rounded-lg border border-cyan-500/20">
                    {faq.category}
                  </span>
                </div>
                <h3 className="text-white font-semibold mb-2">{faq.question}</h3>
                <p className="text-slate-400 text-sm line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors">
                  <Edit3 className="w-4 h-4" />
                </button>
                <button className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Add FAQ Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg mx-4"
          >
            <h2 className="text-xl font-bold text-white mb-4">Add New FAQ</h2>
            
            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Question</label>
                <input
                  type="text"
                  value={newQuestion}
                  onChange={(e) => setNewQuestion(e.target.value)}
                  placeholder="e.g., What are your business hours?"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Answer</label>
                <textarea
                  value={newAnswer}
                  onChange={(e) => setNewAnswer(e.target.value)}
                  placeholder="We are open Monday to Friday, 9 AM to 6 PM..."
                  rows={4}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Category</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="General">General</option>
                  <option value="Pricing">Pricing</option>
                  <option value="Technical">Technical</option>
                  <option value="Channels">Channels</option>
                  <option value="Billing">Billing</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddFAQ}
                disabled={!newQuestion.trim() || !newAnswer.trim()}
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors"
              >
                Add FAQ
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
