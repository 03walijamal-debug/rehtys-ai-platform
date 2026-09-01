import { useUser } from "@clerk/clerk-react";

export function useAuth() {
  const { user, isLoaded, isSignedIn } = useUser();

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
  };
}

export function useClerkUser() {
  return useUser();
}
