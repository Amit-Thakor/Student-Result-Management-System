"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { User } from "@/types";
import api from "./api";

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: () => boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  setUser: (user: User) => void;
  setToken: (token: string) => void;
}

export const useAuth = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      isAuthenticated: () => {
        const { token, user } = get();
        return !!(token && user);
      },

      login: async (email: string, password: string) => {
        set({ isLoading: true });

        try {
          console.log("🔐 Auth: Starting login process");
          console.log("📧 Email:", email);
          console.log("🔗 API Base URL:", "http://localhost:8000");
          
          const response = await api.auth.login(email, password);
          console.log("📡 Auth: API Response received:", response);

          if (response.success && response.data) {
            const { user, token } = response.data;
            console.log("✅ Auth: Login successful!");
            console.log("👤 User:", user);
            console.log("🎫 Token:", token.substring(0, 50) + "...");
            
            // Set token in API client
            api.setToken(token);
            set({
              user,
              token,
              isLoading: false,
            });
            return true;
          } else {
            console.log("❌ Auth: Login failed - invalid response");
            console.log("📄 Response details:", response);
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          console.error("💥 Auth: Login error:", error);
          console.error("🔍 Error details:", {
            message: error instanceof Error ? error.message : 'Unknown error',
            stack: error instanceof Error ? error.stack : undefined
          });
          set({ isLoading: false });
          return false;
        }
      },

      logout: () => {
        set({
          user: null,
          token: null,
          isLoading: false,
        });
        // Clear any cached data
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth-storage");
        }
      },

      setUser: (user: User) => {
        set({ user });
      },

      setToken: (token: string) => {
        set({ token });
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        user: state.user,
        token: state.token,
      }),
    }
  )
);

// Auth guard hook for protected routes
export function useAuthGuard(requiredRole?: "admin" | "student") {
  const { user, isAuthenticated } = useAuth();

  const hasAccess = () => {
    if (!isAuthenticated()) return false;
    if (!requiredRole) return true;
    return user?.role === requiredRole;
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    hasAccess: hasAccess(),
    isAdmin: user?.role === "admin",
    isStudent: user?.role === "student",
  };
}
