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
          const testResponse = await fetch(`${api.getBaseUrl()}`, {
            method: 'GET',
            mode: 'cors',
            cache: 'no-cache',
          });
          
          if (!testResponse.ok) {
            throw new Error(`Backend not responding: ${testResponse.status}`);
          }

          const response = await fetch(`${api.getBaseUrl()}/auth/login`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            mode: 'cors',
            cache: 'no-cache',
            body: JSON.stringify({ email, password }),
          });

          if (!response.ok) {
            set({ isLoading: false });
            return false;
          }

          const data = await response.json();

          if (data.success && data.data) {
            const { user, token } = data.data;
            set({
              user,
              token,
              isLoading: false,
            });
            api.setToken(token);
            return true;
          } else {
            set({ isLoading: false });
            return false;
          }
        } catch (error) {
          if (process.env.NODE_ENV === "development") {
            console.error("Auth: Login error:", error);
          }
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
