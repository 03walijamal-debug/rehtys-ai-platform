import { ThemeProvider } from "@/lib/theme";
import { ClerkProvider, SignedIn, SignedOut } from "@clerk/clerk-react";
import { Toaster } from "@/components/ui/sonner";
import { StrictMode, lazy, Suspense } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Route, Routes } from "react-router";
import "./index.css";

const Landing = lazy(() => import("./pages/Landing.tsx"));
const AuthPage = lazy(() => import("./pages/Auth.tsx"));
const Dashboard = lazy(() => import("./pages/Dashboard.tsx"));
const Onboarding = lazy(() => import("./pages/Onboarding.tsx"));
const NotFound = lazy(() => import("./pages/NotFound.tsx"));

function RouteLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-primary)]">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-[#8B5CF6]/30 border-t-[#8B5CF6] rounded-full animate-spin" />
        <span className="text-sm text-[var(--text-secondary)]">Loading...</span>
      </div>
    </div>
  );
}

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY as string;

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <ClerkProvider publishableKey={clerkPubKey}>
        <BrowserRouter>
          <Suspense fallback={<RouteLoading />}>
            <Routes>
              <Route path="/" element={<Landing />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/onboarding"
                element={<SignedIn><Onboarding /></SignedIn>}
              />
              <Route
                path="/dashboard/*"
                element={<SignedIn><Dashboard /></SignedIn>}
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
        <Toaster />
      </ClerkProvider>
    </ThemeProvider>
  </StrictMode>
);
