import { useUser, useClerk } from "@clerk/clerk-react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();
  const clerk = useClerk();

  return {
    user: user
      ? {
          _id: user.id,
          email: user.emailAddresses[0]?.emailAddress || "",
          name: user.fullName || user.firstName || "",
          plan: "free" as const,
          imageUrl: user.imageUrl,
        }
      : null,
    isLoading: !isLoaded,
    isAuthenticated: isSignedIn,
    signOut: () => clerk.signOut(),
  };
}

export function useClerkUser() {
  return useUser();
}
