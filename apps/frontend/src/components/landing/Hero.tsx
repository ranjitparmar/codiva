"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

const lines = [
  { delay: 0, prompt: true, text: "a portfolio for a senior engineer at stripe" },
  { delay: 0.7, prompt: false, text: "→  generating HTML with gpt-4o-mini", dim: true },
  { delay: 1.3, prompt: false, text: "→  slug: stripe-engineer-portfolio", dim: true },
  { delay: 1.9, prompt: false, text: "→  writing files to /var/www/codiva/", dim: true },
  { delay: 2.4, prompt: false, text: "✓  live at stripe-engineer-portfolio.codiva.ranjitparmar.in", success: true },
];

export const Hero = () => {
  const [visible, setVisible] = useState<number[]>([]);
  const [cursor, setCursor] = useState(true);

  useEffect(() => {
    lines.forEach((line, i) => {
      setTimeout(() => setVisible((prev) => [...prev, i]), 600 + line.delay * 1000);
    });
    const blink = setInterval(() => setCursor((c) => !c), 530);
    return () => clearInterval(blink);
  }, []);

  return (
    <section className="relative pt-32 pb-20 px-6 overflow-hidden bg-white">
      {/* dot grid */}
      <div
        className="absolute inset-0 opacity-[0.4]"
        style={{
          backgroundImage: "radial-gradient(circle, #d4d4d8 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* fade edges */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,rgba(255,255,255,0.9),rgba(255,255,255,0.4))]" />

      <div className="relative max-w-5xl mx-auto">
        <div className="max-w-3xl">
          {/* badge */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 bg-zinc-100 border border-zinc-200 text-zinc-600 text-sm px-4 py-1.5 rounded-full mb-10 font-medium"
          >
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Now live — generate your first site free
          </motion.div>

          {/* headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl sm:text-7xl lg:text-8xl font-bold tracking-tight text-zinc-900 leading-[1.0] mb-8"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Describe it.
            <br />
            <span className="text-zinc-400">We ship it.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-xl text-zinc-500 max-w-lg mb-12 leading-relaxed"
          >
            Tell Codiva what you want built. It generates the code, deploys it,
            and gives you a live URL — in under 30 seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 mb-20"
          >
            <Link
              href="/register"
              className="flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold px-8 py-4 rounded-2xl hover:bg-zinc-700 transition-all duration-200 shadow-lg shadow-zinc-900/20 hover:shadow-xl hover:shadow-zinc-900/25 hover:-translate-y-0.5"
            >
              Start building free
              <ArrowRight className="w-5 h-5" />
            </Link>
            <a
              href="#how-it-works"
              className="flex items-center justify-center gap-2 bg-white text-zinc-700 text-base font-medium px-8 py-4 rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50 transition-all duration-200"
            >
              See how it works
            </a>
          </motion.div>
        </div>

        {/* terminal */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="max-w-2xl"
        >
          <div className="rounded-2xl border border-zinc-200 shadow-2xl shadow-zinc-200/60 overflow-hidden bg-white">
            {/* title bar */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-zinc-100 bg-zinc-50">
              <div className="flex gap-2">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <span className="text-xs text-zinc-400 font-mono ml-2">codiva — terminal</span>
            </div>

            <div className="p-6 space-y-3 bg-zinc-950 font-mono text-[14px]">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={visible.includes(i) ? { opacity: 1 } : {}}
                  transition={{ duration: 0.2 }}
                  className={`flex items-start gap-3 leading-relaxed ${
                    line.success
                      ? "text-emerald-400"
                      : line.prompt
                      ? "text-white"
                      : "text-zinc-500"
                  }`}
                >
                  <span className="text-zinc-600 select-none shrink-0 mt-0.5">
                    {line.prompt ? "$" : " "}
                  </span>
                  <span>{line.text}</span>
                </motion.div>
              ))}

              {visible.length < lines.length && (
                <div className="flex items-center gap-3">
                  <span className="text-zinc-600">$</span>
                  <span
                    className="inline-block w-2 h-5 bg-zinc-300 rounded-sm"
                    style={{ opacity: cursor ? 1 : 0, transition: "opacity 0.1s" }}
                  />
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};