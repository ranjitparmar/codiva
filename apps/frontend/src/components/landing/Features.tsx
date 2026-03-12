"use client";

import { motion } from "framer-motion";
import { Zap, Globe, RefreshCw, ShieldCheck, CreditCard, Layers } from "lucide-react";

const features = [
  {
    icon: Zap,
    title: "Under 30 seconds",
    description: "From prompt submission to a live URL — faster than making a coffee.",
  },
  {
    icon: Layers,
    title: "Two AI tiers",
    description: "STANDARD uses GPT-4o-mini for speed. PRO uses GPT-4o for stunning, complex results.",
  },
  {
    icon: Globe,
    title: "Custom subdomains",
    description: "Suggest your own subdomain or let the AI pick one. Each site gets a permanent URL.",
  },
  {
    icon: RefreshCw,
    title: "Regenerate anytime",
    description: "Not satisfied? Regenerate with a new prompt. Your subdomain stays the same.",
  },
  {
    icon: CreditCard,
    title: "Credits, not subscriptions",
    description: "Start with 5 free credits. Claim 1 more every 24 hours. No card needed.",
  },
  {
    icon: ShieldCheck,
    title: "Secure by default",
    description: "OTP email auth, JWT sessions, rate limiting, and HTTPS on every deployed site.",
  },
];

export const Features = () => {
  return (
    <section id="features" className="py-32 px-6 bg-white">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 font-mono">
            Features
          </p>
          <h2
            className="text-5xl font-bold text-zinc-900 tracking-tight max-w-lg leading-tight"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Everything you need. Nothing you don't.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className="group p-7 rounded-2xl border border-zinc-100 hover:border-zinc-200 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 bg-white"
            >
              <div className="w-11 h-11 bg-zinc-100 group-hover:bg-zinc-900 rounded-xl flex items-center justify-center mb-6 transition-colors duration-300">
                <f.icon className="w-5 h-5 text-zinc-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <h3
                className="text-lg font-semibold text-zinc-900 mb-2"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                {f.title}
              </h3>
              <p className="text-zinc-500 text-[15px] leading-relaxed">{f.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};