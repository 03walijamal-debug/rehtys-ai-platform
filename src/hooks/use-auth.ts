import { useState, useEffect } from "react";

interface User {
  _id: string;
  clerkId: string;
  email: string;
  name?: string;
  plan: "free" | "pro" | "enterprise";
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  });

  useEffect(() => {
    const storedUser = localStorage.getItem("rehtys_user");
    
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setState({
          user,
          isLoading: false,
          isAuthenticated: true,
        });
      } catch (error) {
        localStorage.removeItem("rehtys_user");
        setState({
          user: null,
          isLoading: false,
          isAuthenticated: false,
        });
      }
    } else {
      setState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
      });
    }
  }, []);

  return state;
}

export function loginUser(user: User): void {
  localStorage.setItem("rehtys_user", JSON.stringify(user));
}

export function logoutUser(): void {
  localStorage.removeItem("rehtys_user");
}
