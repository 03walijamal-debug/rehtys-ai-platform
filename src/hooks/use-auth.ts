import { useAuth as useClerkAuth, useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { isSignedIn, isLoaded, signOut } = useClerkAuth();
  const { user } = useUser();

  return {
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn ?? false,
    user: user
      ? {
          _id: user.id,
          email: user.primaryEmailAddress?.emailAddress || "",
          name: user.fullName || user.firstName || "User",
          plan: "free" as const,
        }
      : null,
    signIn: () => {},
    signOut,
  };
}
