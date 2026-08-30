import DashboardLayout from "./dashboard/DashboardLayout";
import DashboardOverview from "./dashboard/DashboardOverview";
import AgentsPage from "./dashboard/AgentsPage";
import KnowledgeBasePage from "./dashboard/KnowledgeBasePage";
import AnalyticsPage from "./dashboard/AnalyticsPage";
import SettingsPage from "./dashboard/SettingsPage";

// Routes:
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardOverview />} />
  <Route path="agents" element={<AgentsPage />} />
  <Route path="knowledge-base" element={<KnowledgeBasePage />} />
  <Route path="analytics" element={<AnalyticsPage />} />
  <Route path="settings" element={<SettingsPage />} />
</Route>
