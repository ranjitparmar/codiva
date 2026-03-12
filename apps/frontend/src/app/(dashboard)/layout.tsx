"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { Sidebar } from "@/components/dashboard/Sidebar";
import { useQuery } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth.api";
import Cookies from "js-cookie";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { setUser, logout } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  const cookieToken = Cookies.get("token");

  const { isLoading, isError } = useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const res = await authApi.me();
      setUser(res.user);
      return res.user;
    },
    enabled: !!cookieToken,
    retry: false,
  });

  useEffect(() => {
    if (mounted && !cookieToken) router.push("/login");
  }, [mounted, cookieToken]);

  useEffect(() => {
    if (isError) { logout(); router.push("/login"); }
  }, [isError]);

  if (!mounted || isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-8 h-8 border-2 border-zinc-200 border-t-zinc-900 rounded-full animate-spin" />
          <p className="text-sm text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!cookieToken) return null;

  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <Sidebar />
      {/* md:pl-[240px] for desktop sidebar, pt-14 for mobile topbar */}
      <main className="flex-1 md:pl-[240px] pt-14 md:pt-0 min-h-screen">
        <div className="max-w-4xl mx-auto px-5 md:px-10 py-8 md:py-10">
          {children}
        </div>
      </main>
    </div>
  );
}