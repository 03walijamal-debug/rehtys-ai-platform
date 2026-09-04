import { useState } from "react";
import DashboardLayout from "./DashboardLayout";
import DashboardOverview from "./DashboardOverview";
import AgentsPage from "./AgentsPage";
import ChatPage from "./ChatPage";
import KnowledgeBasePage from "./KnowledgeBasePage";
import AnalyticsPage from "./AnalyticsPage";
import SettingsPage from "./SettingsPage";

export default function App() {
  const [currentPage, setCurrentPage] = useState("overview");

  const renderPage = () => {
    switch (currentPage) {
      case "agents":
        return <AgentsPage />;
      case "chat":
        return <ChatPage />;
      case "knowledge-base":
        return <KnowledgeBasePage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      case "overview":
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <DashboardLayout
      currentPage={currentPage}
      onNavigate={setCurrentPage}
    >
      {renderPage()}
    </DashboardLayout>
  );
}
