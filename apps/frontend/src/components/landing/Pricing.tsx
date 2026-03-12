"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Check } from "lucide-react";

const tiers = [
  {
    name: "Standard",
    model: "gpt-4o-mini",
    credit: "1 credit",
    description: "Perfect for quick prototypes, landing pages, and simple sites.",
    features: [
      "GPT-4o-mini generation",
      "Custom subdomain",
      "Instant deployment",
      "Regeneration support",
      "Full generation history",
    ],
    cta: "Get started free",
    href: "/register",
    highlight: false,
  },
  {
    name: "Pro",
    model: "gpt-4o",
    credit: "5 credits",
    description: "For polished, impressive sites that demand the best AI output.",
    features: [
      "GPT-4o generation",
      "Custom subdomain",
      "Instant deployment",
      "Regeneration support",
      "Full generation history",
      "Superior design quality",
      "More complex layouts",
    ],
    cta: "Try Pro generation",
    href: "/register",
    highlight: true,
  },
];

export const Pricing = () => {
  return (
    <section id="pricing" className="py-32 px-6 bg-zinc-50 border-t border-zinc-100">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-sm font-semibold text-zinc-400 uppercase tracking-widest mb-4 font-mono">
            Pricing
          </p>
          <h2
            className="text-5xl font-bold text-zinc-900 tracking-tight mb-5"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Pay with credits.
            <br />
            Not subscriptions.
          </h2>
          <p className="text-zinc-500 text-lg max-w-md mx-auto">
            Start with 5 free credits on signup. Claim 1 more every 24 hours. No card required.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tiers.map((tier, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`relative rounded-3xl p-8 flex flex-col ${
                tier.highlight
                  ? "bg-zinc-900 text-white shadow-2xl shadow-zinc-900/30"
                  : "bg-white border border-zinc-200 shadow-sm"
              }`}
            >
              {tier.highlight && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                  <span className="bg-zinc-900 border-2 border-white text-white text-xs font-bold px-4 py-1.5 rounded-full shadow-lg tracking-wide">
                    BEST RESULTS
                  </span>
                </div>
              )}

              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <h3
                    className={`text-2xl font-bold ${tier.highlight ? "text-white" : "text-zinc-900"}`}
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {tier.name}
                  </h3>
                  <span
                    className={`text-xs font-mono px-3 py-1.5 rounded-full ${
                      tier.highlight ? "bg-white/10 text-zinc-300" : "bg-zinc-100 text-zinc-500"
                    }`}
                  >
                    {tier.model}
                  </span>
                </div>

                <div className="flex items-baseline gap-2 mb-3">
                  <span
                    className={`text-4xl font-bold ${tier.highlight ? "text-white" : "text-zinc-900"}`}
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    {tier.credit}
                  </span>
                  <span className={tier.highlight ? "text-zinc-400 text-sm" : "text-zinc-400 text-sm"}>
                    per generation
                  </span>
                </div>
                <p className={`text-sm leading-relaxed ${tier.highlight ? "text-zinc-400" : "text-zinc-500"}`}>
                  {tier.description}
                </p>
              </div>

              <ul className="space-y-3 mb-10 flex-1">
                {tier.features.map((f, j) => (
                  <li key={j} className="flex items-center gap-3">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        tier.highlight ? "bg-white/10" : "bg-zinc-100"
                      }`}
                    >
                      <Check className={`w-3 h-3 ${tier.highlight ? "text-white" : "text-zinc-700"}`} />
                    </div>
                    <span className={`text-sm ${tier.highlight ? "text-zinc-300" : "text-zinc-600"}`}>
                      {f}
                    </span>
                  </li>
                ))}
              </ul>

              <Link
                href={tier.href}
                className={`block text-center py-3.5 rounded-2xl font-semibold text-sm transition-all duration-200 ${
                  tier.highlight
                    ? "bg-white text-zinc-900 hover:bg-zinc-100 shadow-sm"
                    : "bg-zinc-900 text-white hover:bg-zinc-700 shadow-sm"
                }`}
              >
                {tier.cta}
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};