"use client";

import Link from "next/link";
import { Logo } from "./Logo";
import { motion } from "framer-motion";
import { ArrowRight, LayoutDashboard } from "lucide-react";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export const Navbar = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
  }, []);

  return (
    <motion.header
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="fixed top-0 left-0 right-0 z-50 h-16 bg-white/80 backdrop-blur-xl border-b border-zinc-100"
    >
      <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
        <Link href="/">
          <Logo className="text-xl" />
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm text-zinc-500">
          <a href="#how-it-works" className="hover:text-zinc-900 transition-colors">How it works</a>
          <a href="#features" className="hover:text-zinc-900 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-zinc-900 transition-colors">Pricing</a>
        </nav>

        <div className="flex items-center gap-3">
          {isLoggedIn ? (
            <Link
              href="/dashboard"
              className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-5 py-2.5 rounded-full hover:bg-zinc-700 transition-all duration-200 shadow-sm"
            >
              <LayoutDashboard className="w-4 h-4" />
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-zinc-600 hover:text-zinc-900 transition-colors px-4 py-2"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="flex items-center gap-1.5 bg-zinc-900 text-white text-sm font-medium px-5 py-2.5 rounded-full hover:bg-zinc-700 transition-all duration-200 shadow-sm"
              >
                Get started
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </>
          )}
        </div>
      </div>
    </motion.header>
  );
};