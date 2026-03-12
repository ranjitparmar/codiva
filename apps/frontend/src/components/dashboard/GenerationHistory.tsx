"use client";

import { Generation } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { cn } from "@/lib/utils";
import { CheckCircle, XCircle, Loader2, Clock, Zap, Sparkles } from "lucide-react";

const statusConfig = {
  READY: {
    icon: CheckCircle,
    label: "Ready",
    className: "text-emerald-600 bg-emerald-50 border-emerald-200",
    iconClass: "text-emerald-500",
  },
  FAILED: {
    icon: XCircle,
    label: "Failed",
    className: "text-red-600 bg-red-50 border-red-200",
    iconClass: "text-red-500",
  },
  GENERATING: {
    icon: Loader2,
    label: "Generating",
    className: "text-amber-600 bg-amber-50 border-amber-200",
    iconClass: "text-amber-500",
    spin: true,
  },
  PENDING: {
    icon: Clock,
    label: "Pending",
    className: "text-zinc-500 bg-zinc-50 border-zinc-200",
    iconClass: "text-zinc-400",
  },
} as const;

const tierConfig = {
  STANDARD: { icon: Zap, label: "Standard" },
  PRO: { icon: Sparkles, label: "Pro" },
} as const;

export const GenerationHistory = ({ generations }: { generations: Generation[] }) => {
  if (!generations.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <Clock className="w-8 h-8 text-zinc-300 mb-3" />
        <p className="text-zinc-400 text-sm">No generations yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {generations.map((gen, i) => {
        const status = statusConfig[gen.status];
        const tier = tierConfig[gen.tier];
        const StatusIcon = status.icon;
        const TierIcon = tier.icon;

        return (
          <div
            key={gen.id}
            className={cn(
              "rounded-2xl border bg-white p-5 transition-all hover:shadow-sm",
              i === 0 ? "ring-2 ring-zinc-900/5 border-zinc-200" : "border-zinc-100"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                {/* prompt */}
                <p className="text-zinc-700 text-sm leading-relaxed line-clamp-2 mb-4">
                  {gen.prompt}
                </p>

                {/* meta row */}
                <div className="flex items-center gap-3 flex-wrap">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full border",
                      status.className
                    )}
                  >
                    <StatusIcon
                      className={cn("w-3.5 h-3.5", status.iconClass, "spin" in status && status.spin ? "animate-spin" : "")}
                    />
                    {status.label}
                  </span>

                  <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-500 bg-zinc-50 border border-zinc-200 px-2.5 py-1 rounded-full">
                    <TierIcon className="w-3 h-3" />
                    {tier.label}
                  </span>

                  <span className="text-xs text-zinc-400 font-mono">
                    {gen.creditsUsed} credit{gen.creditsUsed > 1 ? "s" : ""}
                  </span>

                  <span className="text-xs text-zinc-400">
                    {formatRelativeTime(gen.createdAt)}
                  </span>
                </div>

                {gen.errorMsg && (
                  <p className="text-red-500 text-xs mt-3 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {gen.errorMsg}
                  </p>
                )}
              </div>

              {i === 0 && (
                <span className="shrink-0 text-xs font-semibold text-zinc-900 bg-zinc-100 border border-zinc-200 px-3 py-1 rounded-full">
                  Latest
                </span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};