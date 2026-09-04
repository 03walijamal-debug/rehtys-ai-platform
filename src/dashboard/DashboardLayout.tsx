import { useState } from "react";
import { 
  LayoutDashboard, 
  Bot,
  MessageSquare,
  BookOpen, 
  BarChart3, 
  Settings, 
  CreditCard,
  LogOut,
  Menu,
  X,
  Bell,
  User,
  ChevronLeft
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const sidebarItems = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "agents", label: "My Agents", icon: Bot },
  { id: "chat", label: "Chat", icon: MessageSquare },
  { id: "knowledge-base", label: "Knowledge Base", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "billing", label: "Billing", icon: CreditCard },
  { id: "settings", label: "Settings", icon: Settings },
];

interface DashboardLayoutProps {
  children?: React.ReactNode;
  currentPage?: string;
  onNavigate?: (page: string) => void;
}

export default function DashboardLayout({ 
  children, 
  currentPage = "overview",
  onNavigate 
}: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const handleNavigation = (pageId: string) => {
    if (onNavigate) {
      onNavigate(pageId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            className="w-[280px] bg-slate-900 border-r border-slate-800 flex flex-col"
          >
            {/* Logo */}
            <div className="p-6 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">Rehtys</span>
              </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-2">
              {sidebarItems.map((item) => {
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavigation(item.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-left ${
                      isActive
                        ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        : "text-slate-400 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </button>
                );
              })}
            </nav>

            {/* User Section */}
            <div className="p-4 border-t border-slate-800">
              <div className="flex items-center gap-3 px-4 py-3">
                <div className="w-10 h-10 bg-slate-700 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium text-sm">Customer</p>
                  <p className="text-slate-500 text-xs">Pro Plan</p>
                </div>
                <button className="text-slate-400 hover:text-red-400 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="h-16 bg-slate-900/50 backdrop-blur-sm border-b border-slate-800 flex items-center justify-between px-6">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <div className="flex items-center gap-4">
            <button className="relative text-slate-400 hover:text-white transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-cyan-500 rounded-full" />
            </button>
            <div className="w-8 h-8 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-bold">R</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
