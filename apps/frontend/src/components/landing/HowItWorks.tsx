"use client";

import { motion } from "framer-motion";
import { PenLine, Cpu, Globe } from "lucide-react";

const steps = [
  {
    icon: PenLine,
    number: "01",
    title: "Describe your site",
    description: "Write a prompt in plain English. Be as detailed or as brief as you want — the AI handles the rest.",
  },
  {
    icon: Cpu,
    number: "02",
    title: "AI generates the code",
    description: "GPT-4o-mini or GPT-4o writes a complete, production-ready single-file HTML website tailored to your description.",
  },
  {
    icon: Globe,
    number: "03",
    title: "Live in seconds",
    description: "Your site is deployed to a unique subdomain instantly. Share the link — it's already live.",
  },
];

export const HowItWorks = () => {
  return (
    <section id="how-it-works" className="py-32 px-6 bg-zinc-50 border-y border-zinc-100">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 font-mono">
            How it works
          </p>
          <h2
            className="text-5xl font-bold text-zinc-900 tracking-tight max-w-lg leading-tight"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            From idea to URL in three steps.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
              className="relative"
            >
              {i < steps.length - 1 && (
                <div className="hidden md:block absolute top-6 left-full w-full h-px bg-zinc-200 -translate-x-4 z-0" />
              )}
              <div className="relative bg-white rounded-2xl border border-zinc-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center">
                    <step.icon className="w-5 h-5 text-white" />
                  </div>
                  <span
                    className="text-5xl font-bold text-zinc-100"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {step.number}
                  </span>
                </div>
                <h3
                  className="text-xl font-semibold text-zinc-900 mb-3"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {step.title}
                </h3>
                <p className="text-zinc-500 leading-relaxed">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};