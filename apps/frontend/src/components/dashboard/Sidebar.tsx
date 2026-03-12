"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Logo } from "@/components/shared/Logo";
import { CreditsBadge } from "./CreditsBadge";
import { useAuthStore } from "@/store/auth.store";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Settings, Plus, LogOut, Menu, X } from "lucide-react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Settings", href: "/settings", icon: Settings },
];

const SidebarContent = ({ onNavigate }: { onNavigate?: () => void }) => {
  const pathname = usePathname();
  const router = useRouter();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    toast.success("Signed out");
    router.push("/");
    onNavigate?.();
  };

  return (
    <div className="flex flex-col h-full">
      {/* logo */}
      <div className="px-6 h-16 flex items-center border-b border-zinc-100">
        <Link href="/" onClick={onNavigate}>
          <Logo className="text-xl" />
        </Link>
      </div>

      {/* new site */}
      <div className="px-4 pt-4 pb-2">
        <Link href="/sites/new" onClick={onNavigate}>
          <div className="flex items-center gap-2 bg-zinc-900 text-white px-4 py-2.5 rounded-xl text-sm font-semibold hover:bg-zinc-700 transition-colors cursor-pointer shadow-sm">
            <Plus className="w-4 h-4" />
            New site
          </div>
        </Link>
      </div>

      {/* nav */}
      <nav className="flex-1 px-4 py-3 space-y-1">
        {navItems.map((item) => {
          const active = pathname === item.href;
          return (
            <Link key={item.href} href={item.href} onClick={onNavigate}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all cursor-pointer",
                  active
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50"
                )}
              >
                <item.icon className={cn("w-4 h-4", active ? "text-zinc-900" : "text-zinc-400")} />
                {item.label}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* bottom */}
      <div className="px-4 pb-4 pt-3 border-t border-zinc-100 space-y-1">
        <CreditsBadge />
        <div className="px-3 py-1.5">
          <p className="text-xs text-zinc-400 truncate">{user?.email}</p>
        </div>
        <div
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-zinc-500 hover:text-zinc-900 hover:bg-zinc-50 transition-all cursor-pointer"
        >
          <LogOut className="w-4 h-4 text-zinc-400" />
          Sign out
        </div>
      </div>
    </div>
  );
};

export const Sidebar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* desktop sidebar */}
      <aside className="hidden md:flex fixed left-0 top-0 h-screen w-[240px] flex-col bg-white border-r border-zinc-100 z-40">
        <SidebarContent />
      </aside>

      {/* mobile topbar */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-40 h-14 bg-white border-b border-zinc-100 flex items-center justify-between px-5">
        <Logo className="text-xl" />
        <button
          onClick={() => setMobileOpen(true)}
          className="w-9 h-9 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
        >
          <Menu className="w-5 h-5 text-zinc-600" />
        </button>
      </header>

      {/* mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="md:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-50"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="md:hidden fixed left-0 top-0 h-screen w-[280px] bg-white border-r border-zinc-100 z-50 shadow-2xl"
            >
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-lg hover:bg-zinc-100 transition-colors"
              >
                <X className="w-4 h-4 text-zinc-500" />
              </button>
              <SidebarContent onNavigate={() => setMobileOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
};