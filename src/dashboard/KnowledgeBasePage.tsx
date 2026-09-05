import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { Id } from "../convex/_generated/dataModel";
import { motion } from "framer-motion";
import {
  Plus,
  Search,
  BookOpen,
  Trash2,
  Tag,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  Loader2,
  Bot,
} from "lucide-react";

// Pulls the real reason out of a Convex error (actions wrap plain errors in
// a generic "Server Error Called by client" message).
function errorMessage(error: any, fallback: string): string {
  if (!error) return fallback;
  if (typeof error.data === "string" && error.data.trim()) return error.data;
  if (error.data?.message) return error.data.message;
  if (error.message && !/Server Error Called by client/.test(error.message)) {
    return error.message;
  }
  return fallback;
}

export default function KnowledgeBasePage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMode, setAddMode] = useState<"faq" | "document">("faq");
  const [selectedAgentId, setSelectedAgentId] = useState<Id<"agents"> | "">("");
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [newDocName, setNewDocName] = useState("");
  const [newDocContent, setNewDocContent] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Convex queries
  const agents = useQuery(api.agents.getMyAgents) ?? [];
  const documents = useQuery(api.documents.getMyDocuments, {}) ?? [];

  // Convex mutations
  const addFaq = useMutation(api.documents.addFaq);
  const addDocument = useMutation(api.documents.addDocument);
  const deleteDocument = useMutation(api.documents.deleteDocument);

  const filteredDocs = documents.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.rawContent.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const faqs = filteredDocs.filter((d) => d.fileType === "faq");
  const docs = filteredDocs.filter((d) => d.fileType !== "faq");

    // If there's exactly one agent, use it automatically. Without this the
  // Add button did nothing silently (no agent was ever selected).
  const resolveAgentId = (): Id<"agents"> | "" => {
    return selectedAgentId ||
      (agents.length === 1 ? agents[0]?._id || "" : "");
  };

  const handleAddFaq = async () => {
    const agentId = resolveAgentId();
    if (!agentId || !newQuestion.trim() || !newAnswer.trim()) return;
    setIsAdding(true);
    try {
      await addFaq({
        agentId,
        question: newQuestion.trim(),
        answer: newAnswer.trim(),
      });
      setShowAddModal(false);
      setNewQuestion("");
      setNewAnswer("");
    } catch (error: any) {
      alert(errorMessage(error, "Failed to add FAQ. Please try again."));
    } finally {
      setIsAdding(false);
    }
  };

  const handleAddDocument = async () => {
    const agentId = resolveAgentId();
    if (!agentId || !newDocName.trim() || !newDocContent.trim()) return;
    setIsAdding(true);
    try {
      await addDocument({
        agentId,
        name: newDocName.trim(),
        content: newDocContent.trim(),
        fileType: "document",
      });
      setShowAddModal(false);
      setNewDocName("");
      setNewDocContent("");
    } catch (error: any) {
      alert(errorMessage(error, "Failed to add document. Please try again."));
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (docId: string) => {
    if (!confirm("Delete this document? This cannot be undone.")) return;
    try {
      await deleteDocument({ documentId: docId as Id<"documents"> });
    } catch (error: any) {
      alert(error.message || "Failed to delete document");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Knowledge Base</h1>
          <p className="text-slate-400 mt-1">Train your agent with FAQs and documents</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Content
        </button>
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
              <p className="text-2xl font-bold text-white">{documents.length}</p>
              <p className="text-slate-400 text-sm">Total Items</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Tag className="w-5 h-5 text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{faqs.length}</p>
              <p className="text-slate-400 text-sm">FAQs</p>
            </div>
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <FileText className="w-5 h-5 text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{docs.length}</p>
              <p className="text-slate-400 text-sm">Documents</p>
            </div>
          </div>
        </div>
      </div>

      {/* Documents List */}
      <div className="space-y-3">
        {filteredDocs.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-white mb-2">
              {documents.length === 0 ? "No knowledge base content yet" : "No results found"}
            </h3>
            <p className="text-slate-400 mb-6">
              {documents.length === 0
                ? "Add FAQs and documents to train your agent"
                : "Try a different search term"}
            </p>
            {documents.length === 0 && (
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
              >
                Add Your First FAQ
              </button>
            )}
          </div>
        ) : (
          filteredDocs.map((doc, index) => (
            <motion.div
              key={doc._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg border ${
                        doc.fileType === "faq"
                          ? "bg-cyan-500/10 text-cyan-400 border-cyan-500/20"
                          : doc.fileType === "document"
                          ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                          : "bg-green-500/10 text-green-400 border-green-500/20"
                      }`}
                    >
                      {doc.fileType === "faq" ? "FAQ" : doc.fileType === "document" ? "Document" : doc.fileType}
                    </span>
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded-lg flex items-center gap-1 ${
                        doc.status === "ready"
                          ? "bg-green-500/10 text-green-400"
                          : doc.status === "error"
                          ? "bg-red-500/10 text-red-400"
                          : "bg-yellow-500/10 text-yellow-400"
                      }`}
                    >
                      {doc.status === "ready" ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : doc.status === "error" ? (
                        <AlertCircle className="w-3 h-3" />
                      ) : (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      )}
                      {doc.status}
                    </span>
                  </div>
                  <h3 className="text-white font-semibold mb-1">{doc.name}</h3>
                  <p className="text-slate-400 text-sm line-clamp-2">{doc.rawContent.slice(0, 200)}</p>
                  <p className="text-slate-500 text-xs mt-2">
                    {doc.chunkCount} chunks • Created {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleDelete(doc._id)}
                  className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Add Content Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg mx-4"
          >
            <h2 className="text-xl font-bold text-white mb-4">Add Knowledge Base Content</h2>

            {/* Agent Selector */}
            {agents.length > 1 && (
              <div className="mb-4">
                <label className="block text-slate-400 text-sm mb-2">Select Agent</label>
                <select
                  value={selectedAgentId}
                  onChange={(e) => setSelectedAgentId(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="">Choose an agent...</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            )}
            {agents.length === 1 && !selectedAgentId && (
              <div className="mb-4 p-3 bg-cyan-500/10 border border-cyan-500/20 rounded-xl">
                <div className="flex items-center gap-2">
                  <Bot className="w-4 h-4 text-cyan-400" />
                  <span className="text-cyan-400 text-sm font-medium">
                    Adding to: {agents[0].name}
                  </span>
                </div>
              </div>
            )}

            {/* Mode Toggle */}
            <div className="flex gap-2 mb-4">
              <button
                onClick={() => setAddMode("faq")}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  addMode === "faq"
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                Add FAQ
              </button>
              <button
                onClick={() => setAddMode("document")}
                className={`flex-1 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  addMode === "document"
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "bg-slate-800 text-slate-400 border border-slate-700"
                }`}
              >
                Add Document
              </button>
            </div>

            {addMode === "faq" ? (
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
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Document Name</label>
                  <input
                    type="text"
                    value={newDocName}
                    onChange={(e) => setNewDocName(e.target.value)}
                    placeholder="e.g., Product Catalog"
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 text-sm mb-2">Content</label>
                  <textarea
                    value={newDocContent}
                    onChange={(e) => setNewDocContent(e.target.value)}
                    placeholder="Paste your document content here..."
                    rows={8}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none font-mono text-sm"
                  />
                </div>
              </div>
            )}

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={addMode === "faq" ? handleAddFaq : handleAddDocument}
                disabled={
                  isAdding ||
                  (agents.length > 1 && !selectedAgentId) ||
                  (addMode === "faq"
                    ? !newQuestion.trim() || !newAnswer.trim()
                    : !newDocName.trim() || !newDocContent.trim())
                }
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isAdding ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding...
                  </>
                ) : (
                  "Add Content"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
