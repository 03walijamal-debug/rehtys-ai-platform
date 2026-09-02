"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard, Bot, Database, BarChart3, Settings, Bell,
  Search, Menu, LogOut, ChevronLeft, Receipt, CreditCard,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router";
import { useAuth } from "@/hooks/use-auth";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";

const navItems = [
  { icon: LayoutDashboard, label: "Overview", path: "/dashboard" },
  { icon: Bot, label: "Agents", path: "/dashboard/agents" },
  { icon: Database, label: "Knowledge Base", path: "/dashboard/knowledge" },
  { icon: BarChart3, label: "Analytics", path: "/dashboard/analytics" },
  { icon: Receipt, label: "Billing & Plans", path: "/dashboard/billing" },
  { icon: Settings, label: "Settings", path: "/dashboard/settings" },
];

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const SidebarContent = ({ collapsed = false }: { collapsed?: boolean }) => (
    <div className="flex flex-col h-full bg-[var(--bg-secondary)]">
      {/* Logo */}
      <div className={cn("h-16 flex items-center border-b border-[var(--border-color)]", collapsed ? "justify-center px-2" : "px-5")}>
        <button onClick={() => navigate("/")} className="flex items-center gap-2">
          <img src="/logo.png" alt="Rehtys" className="h-8 w-8 rounded-lg object-cover shrink-0" />
          {!collapsed && (
            <span className="text-lg font-bold tracking-[0.12em] text-[var(--text-primary)] font-['Space_Grotesk']">
              REH<span className="text-[#8C7AE6]">TY</span>S
            </span>
          )}
          {!collapsed && <span className="text-[10px] text-[var(--text-muted)] ml-1 font-normal">Dashboard</span>}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1">
        {navItems.map((item) => {
          const active = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setMobileOpen(false); }}
              className={cn(
                "w-full flex items-center gap-3 rounded-lg text-sm transition-colors",
                collapsed ? "justify-center px-2 py-3" : "px-3 py-2.5",
                active
                  ? "bg-[#8C7AE6]/10 text-[#8C7AE6]"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-hover)]"
              )}
            >
              <item.icon size={18} />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* User */}
      <div className={cn("p-3 border-t border-[var(--border-color)]", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-3", collapsed && "justify-center")}>
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2C2A72] to-[#8C7AE6] flex items-center justify-center text-white text-xs font-bold shrink-0">
            {user?.name?.[0]?.toUpperCase() || "U"}
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-[var(--text-primary)] truncate">{user?.name || "User"}</p>
              <p className="text-xs text-[var(--text-muted)] truncate">{user?.email || "user@example.com"}</p>
            </div>
          )}
          {!collapsed && (
            <button onClick={handleSignOut} className="text-[var(--text-muted)] hover:text-[#F87171] transition-colors">
              <LogOut size={16} />
            </button>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] flex">
      {/* Desktop Sidebar */}
      <aside
        className={cn(
          "hidden lg:flex flex-col border-r border-[var(--border-color)] transition-all duration-300 shrink-0",
          sidebarOpen ? "w-60" : "w-16"
        )}
      >
        <SidebarContent collapsed={!sidebarOpen} />
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="h-10 flex items-center justify-center border-t border-[var(--border-color)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <ChevronLeft size={16} className={cn(!sidebarOpen && "rotate-180")} />
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -256 }}
              animate={{ x: 0 }}
              exit={{ x: -256 }}
              transition={{ duration: 0.2 }}
              className="fixed left-0 top-0 bottom-0 w-60 z-50 lg:hidden"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 border-b border-[var(--border-color)] bg-[var(--bg-primary)]/80 backdrop-blur-xl shrink-0">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
            <Menu size={20} />
          </button>
          <div className="hidden sm:flex items-center gap-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg px-3 py-1.5 w-64">
            <Search size={14} className="text-[var(--text-muted)]" />
            <input
              type="text"
              placeholder="Search..."
              className="bg-transparent text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)] outline-none w-full"
            />
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button className="relative text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors">
              <Bell size={18} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#8C7AE6] rounded-full" />
            </button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
