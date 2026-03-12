"use client";

import { cn } from "@/lib/utils";
import { useEffect } from "react";
import { useGenerationStatus } from "@/lib/hooks/useGenerationStatus";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, ExternalLink, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  generationId: string;
  onComplete?: (url: string) => void;
}

const steps = [
  { statuses: ["PENDING"], label: "Queued" },
  { statuses: ["GENERATING"], label: "Generating" },
  { statuses: ["READY", "FAILED"], label: "Deployed" },
];

export const GenerationStatus = ({ generationId, onComplete }: Props) => {
  const { data } = useGenerationStatus(generationId);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (data?.status === "READY") {
      toast.success("Your site is live!");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      queryClient.invalidateQueries({ queryKey: ["me"] });
      if (data.url && onComplete) onComplete(data.url);
    }
    if (data?.status === "FAILED") {
      toast.error("Generation failed. Credits have been refunded.");
      queryClient.invalidateQueries({ queryKey: ["me"] });
    }
  }, [data?.status]);

  const status = data?.status ?? "PENDING";
  const isDone = status === "READY" || status === "FAILED";

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={status}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col items-center text-center py-14 px-6"
      >
        {/* icon */}
        <div className="mb-8">
          {status === "READY" ? (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 250, damping: 20 }}
              className="w-20 h-20 bg-emerald-50 border-2 border-emerald-100 rounded-full flex items-center justify-center"
            >
              <CheckCircle className="w-10 h-10 text-emerald-500" />
            </motion.div>
          ) : status === "FAILED" ? (
            <div className="w-20 h-20 bg-red-50 border-2 border-red-100 rounded-full flex items-center justify-center">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
          ) : (
            <div className="relative w-20 h-20">
              <div className="w-20 h-20 rounded-full border-2 border-zinc-100" />
              <div className="absolute inset-0 w-20 h-20 rounded-full border-2 border-t-zinc-900 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
              <div className="absolute inset-3 w-14 h-14 rounded-full border border-zinc-100" />
            </div>
          )}
        </div>

        {/* heading */}
        <h3
          className="text-2xl font-bold text-zinc-900 mb-3 tracking-tight"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          {status === "READY"
            ? "Your site is live!"
            : status === "FAILED"
            ? "Generation failed"
            : status === "GENERATING"
            ? "Building your site..."
            : "Queued..."}
        </h3>

        <p className="text-zinc-400 text-base mb-10 max-w-sm leading-relaxed">
          {status === "READY"
            ? `Live at ${data?.subdomain}.codiva.ranjitparmar.in`
            : status === "FAILED"
            ? (data?.errorMsg || "Something went wrong. Your credits have been refunded.")
            : status === "GENERATING"
            ? "AI is writing your HTML, CSS and JavaScript. This takes 15–30 seconds."
            : "Your job is queued. Generation will start shortly."}
        </p>

        {/* steps */}
        {!isDone && (
          <div className="flex items-center gap-1 mb-10">
            {steps.map((step, i) => {
              const isActive = step.statuses.includes(status);
              const isPast = status === "GENERATING" && i === 0;
              return (
                <div key={i} className="flex items-center gap-1">
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className={cn(
                        "w-2.5 h-2.5 rounded-full transition-all duration-500",
                        isPast
                          ? "bg-zinc-900 scale-100"
                          : isActive
                          ? "bg-zinc-900 scale-125 ring-4 ring-zinc-900/10"
                          : "bg-zinc-200"
                      )}
                    />
                    <span
                      className={cn(
                        "text-xs font-medium whitespace-nowrap",
                        isActive ? "text-zinc-900" : isPast ? "text-zinc-400" : "text-zinc-300"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < steps.length - 1 && (
                    <div
                      className={cn(
                        "w-12 h-px mb-5 transition-colors duration-500",
                        isPast ? "bg-zinc-900" : "bg-zinc-200"
                      )}
                    />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* action */}
        {status === "READY" && data?.url && (
          <motion.a
            href={data.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-2 bg-zinc-900 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-zinc-700 transition-all shadow-sm text-base"
          >
            <ExternalLink className="w-4 h-4" />
            Open your site
            <ArrowRight className="w-4 h-4" />
          </motion.a>
        )}
      </motion.div>
    </AnimatePresence>
  );
};