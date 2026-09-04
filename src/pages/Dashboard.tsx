import { lazy, Suspense } from "react";

const DashboardApp = lazy(() => import("../dashboard/App.tsx"));

function DashboardLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-cyan-500/30 border-t-cyan-500 rounded-full animate-spin" />
        <span className="text-sm text-slate-400">Loading dashboard...</span>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <DashboardApp />
    </Suspense>
  );
}
