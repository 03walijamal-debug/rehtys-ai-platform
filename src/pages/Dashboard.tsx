"use client";
import { useSignOut } from "@clerk/clerk-react";
import { Routes, Route, Navigate } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import DashboardOverview from "@/pages/dashboard/Overview";
import DashboardAgents from "@/pages/dashboard/Agents";
import DashboardKnowledge from "@/pages/dashboard/Knowledge";
import DashboardAnalytics from "@/pages/dashboard/Analytics";
import DashboardSettings from "@/pages/dashboard/Settings";
import DashboardBilling from "@/pages/dashboard/Billing";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <Routes>
        <Route index element={<DashboardOverview />} />
        <Route path="agents" element={<DashboardAgents />} />
        <Route path="knowledge" element={<DashboardKnowledge />} />
        <Route path="analytics" element={<DashboardAnalytics />} />
        <Route path="billing" element={<DashboardBilling />} />
        <Route path="settings" element={<DashboardSettings />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </DashboardLayout>
  );
}
