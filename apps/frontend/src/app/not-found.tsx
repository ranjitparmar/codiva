"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Logo } from "@/components/shared/Logo";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <header className="px-8 py-5">
        <Logo className="text-xl" />
      </header>
      <main className="flex-1 flex items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <p
            className="text-[120px] font-bold text-zinc-100 leading-none mb-4 select-none"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            404
          </p>
          <h1
            className="text-3xl font-bold text-zinc-900 mb-3"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Page not found
          </h1>
          <p className="text-zinc-400 text-lg mb-10 max-w-sm mx-auto leading-relaxed">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-zinc-900 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-zinc-700 transition-all shadow-sm text-base"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>
        </motion.div>
      </main>
    </div>
  );
}