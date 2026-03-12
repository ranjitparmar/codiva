"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import Cookies from "js-cookie";
import { User } from "@/types";

const cookieStorage = {
  getItem: (name: string) => {
    return Cookies.get(name) ?? null;
  },
  setItem: (name: string, value: string) => {
    Cookies.set(name, value, { expires: 7, sameSite: "lax" });
  },
  removeItem: (name: string) => {
    Cookies.remove(name);
  },
};

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  setAuth: (user: User, token: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,

      setAuth: (user, token) => {
        Cookies.set("token", token, { expires: 7, sameSite: "lax" });
        set({ user, token, isAuthenticated: true });
      },

      setUser: (user) => set({ user }),

      logout: () => {
        Cookies.remove("token");
        set({ user: null, token: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth",
      storage: createJSONStorage(() => cookieStorage),
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);