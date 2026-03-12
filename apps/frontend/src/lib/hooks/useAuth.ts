"use client";

import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";

export const useAuth = () => {
  const { user, token, isAuthenticated, setUser, logout } = useAuthStore();

  const { isLoading } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.me();
      setUser(res.user);
      return res.user;
    },
    enabled: !!token,
    retry: false,
  });

  return { user, token, isAuthenticated, isLoading, logout };
};