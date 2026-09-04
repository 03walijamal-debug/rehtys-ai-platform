import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../convex/_generated/api";
import { motion } from "framer-motion";
import {
  Plus,
  Bot,
  Settings,
  Power,
  PowerOff,
  MoreVertical,
  MessageSquare,
  Trash2,
  Calendar,
  Loader2,
} from "lucide-react";

export default function AgentsPage() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newAgentName, setNewAgentName] = useState("");
  const [newAgentDescription, setNewAgentDescription] = useState("");
  const [newAgentTone, setNewAgentTone] = useState("friendly and professional");
  const [isCreating, setIsCreating] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Convex queries and mutations
  const agents = useQuery(api.agents.getMyAgents) ?? [];
  const createAgent = useMutation(api.agents.createAgent);
  const deleteAgent = useMutation(api.agents.deleteAgent);
  const updateAgent = useMutation(api.agents.updateAgent);

  const handleCreateAgent = async () => {
    if (!newAgentName.trim() || !newAgentDescription.trim()) return;
    setIsCreating(true);
    try {
      await createAgent({
        name: newAgentName.trim(),
        description: newAgentDescription.trim(),
        tone: newAgentTone,
      });
      setShowCreateModal(false);
      setNewAgentName("");
      setNewAgentDescription("");
      setNewAgentTone("friendly and professional");
    } catch (error: any) {
      alert(error.message || "Failed to create agent");
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteAgent = async (agentId: string) => {
    try {
      await deleteAgent({ agentId: agentId as any });
      setDeleteConfirm(null);
    } catch (error: any) {
      alert(error.message || "Failed to delete agent");
    }
  };

  const handleToggleAgent = async (agentId: string, currentStatus: boolean) => {
    try {
      await updateAgent({ agentId: agentId as any, isActive: !currentStatus });
    } catch (error: any) {
      alert(error.message || "Failed to update agent");
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">My Agents</h1>
          <p className="text-slate-400 mt-1">Create and manage your AI agents</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Agent
        </button>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {agents.map((agent, index) => (
          <motion.div
            key={agent._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-colors"
          >
            {/* Agent Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-white font-semibold">{agent.name}</h3>
                  <p className="text-slate-400 text-sm truncate max-w-[180px]">{agent.description}</p>
                </div>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${
                  agent.isActive
                    ? "bg-green-500/10 text-green-400 border border-green-500/20"
                    : "bg-red-500/10 text-red-400 border border-red-500/20"
                }`}
              >
                {agent.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Conversations
                </div>
                <p className="text-white font-semibold">{agent.totalConversations}</p>
              </div>
              <div className="bg-slate-800/50 rounded-xl p-3">
                <div className="flex items-center gap-2 text-slate-400 text-sm mb-1">
                  <MessageSquare className="w-4 h-4" />
                  Messages
                </div>
                <p className="text-white font-semibold">{agent.totalMessages}</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button className="flex-1 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2">
                <Settings className="w-4 h-4" />
                Configure
              </button>
              <button
                onClick={() => handleToggleAgent(agent._id, agent.isActive)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                  agent.isActive
                    ? "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20"
                    : "bg-green-500/10 text-green-400 hover:bg-green-500/20 border border-green-500/20"
                }`}
              >
                {agent.isActive ? (
                  <>
                    <PowerOff className="w-4 h-4" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Power className="w-4 h-4" />
                    Activate
                  </>
                )}
              </button>
              <button
                onClick={() => setDeleteConfirm(agent._id)}
                className="px-4 py-2 bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20 rounded-xl text-sm font-medium transition-colors flex items-center justify-center"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Created Date */}
            <div className="mt-4 pt-4 border-t border-slate-800 flex items-center gap-2 text-slate-500 text-sm">
              <Calendar className="w-4 h-4" />
              Created {new Date(agent.createdAt).toLocaleDateString()}
            </div>
          </motion.div>
        ))}

        {/* Create New Agent Card */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: agents.length * 0.1 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-slate-900/50 border-2 border-dashed border-slate-700 rounded-2xl p-5 hover:border-cyan-500/50 hover:bg-slate-900 transition-all flex flex-col items-center justify-center min-h-[280px]"
        >
          <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4">
            <Plus className="w-8 h-8 text-slate-500" />
          </div>
          <p className="text-slate-400 font-medium">Create New Agent</p>
          <p className="text-slate-500 text-sm mt-1">Set up a new AI assistant</p>
        </motion.button>
      </div>

      {/* Empty State */}
      {agents.length === 0 && (
        <div className="text-center py-12">
          <Bot className="w-16 h-16 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No agents yet</h3>
          <p className="text-slate-400 mb-6">Create your first AI agent to get started</p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="px-6 py-3 bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-medium transition-colors"
          >
            Create Your First Agent
          </button>
        </div>
      )}

      {/* Create Agent Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-md mx-4"
          >
            <h2 className="text-xl font-bold text-white mb-4">Create New Agent</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-slate-400 text-sm mb-2">Agent Name</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  placeholder="e.g., Sales Assistant"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Description</label>
                <textarea
                  value={newAgentDescription}
                  onChange={(e) => setNewAgentDescription(e.target.value)}
                  placeholder="What does this agent do? e.g., Handles customer inquiries about pricing and product features"
                  rows={3}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-400 text-sm mb-2">Tone</label>
                <select
                  value={newAgentTone}
                  onChange={(e) => setNewAgentTone(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white focus:outline-none focus:border-cyan-500 transition-colors"
                >
                  <option value="friendly and professional">Friendly & Professional</option>
                  <option value="formal and authoritative">Formal & Authoritative</option>
                  <option value="casual and approachable">Casual & Approachable</option>
                  <option value="empathetic and supportive">Empathetic & Supportive</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3 mt-6">
              <button
                onClick={() => setShowCreateModal(false)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateAgent}
                disabled={!newAgentName.trim() || !newAgentDescription.trim() || isCreating}
                className="flex-1 px-4 py-3 bg-cyan-500 hover:bg-cyan-600 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-xl font-medium transition-colors flex items-center justify-center gap-2"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Agent"
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-sm mx-4"
          >
            <h2 className="text-xl font-bold text-white mb-2">Delete Agent?</h2>
            <p className="text-slate-400 mb-6">
              This will permanently delete this agent and all its conversations. This action cannot be undone.
            </p>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteAgent(deleteConfirm)}
                className="flex-1 px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-colors"
              >
                Delete
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
