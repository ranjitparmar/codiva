"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { sitesApi } from "@/lib/api/sites.api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Sparkles, Zap, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationTier } from "@/types";

const schema = z.object({
  prompt: z.string().min(10, "Describe your site in at least 10 characters"),
});

type FormData = z.infer<typeof schema>;

const tiers: { value: GenerationTier; label: string; credits: number; icon: typeof Zap }[] = [
  { value: "STANDARD", label: "Standard", credits: 1, icon: Zap },
  { value: "PRO", label: "Pro", credits: 5, icon: Sparkles },
];

interface Props {
  siteId: string;
  defaultPrompt?: string;
  onSuccess: (generationId: string) => void;
  onCancel: () => void;
}

export const RegenerateForm = ({ siteId, defaultPrompt, onSuccess, onCancel }: Props) => {
  const { user } = useAuthStore();
  const [tier, setTier] = useState<GenerationTier>("STANDARD");
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { prompt: defaultPrompt ?? "" },
  });

  const creditCost = tier === "PRO" ? 5 : 1;
  const hasEnoughCredits = (user?.credits ?? 0) >= creditCost;

  const onSubmit = async (data: FormData) => {
    if (!hasEnoughCredits) {
      toast.error(`You need ${creditCost} credits for this tier`);
      return;
    }
    setLoading(true);
    try {
      const res = await sitesApi.regenerate(siteId, { prompt: data.prompt, tier });
      onSuccess(res.generationId);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start regeneration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      {/* tier */}
      <div className="grid grid-cols-2 gap-3">
        {tiers.map((t) => {
          const Icon = t.icon;
          const selected = tier === t.value;
          return (
            <button
              key={t.value}
              type="button"
              onClick={() => setTier(t.value)}
              className={cn(
                "flex items-center gap-2.5 rounded-xl border-2 p-4 text-left transition-all duration-200 text-sm font-semibold",
                selected
                  ? "border-zinc-900 bg-zinc-900 text-white"
                  : "border-zinc-200 bg-white text-zinc-700 hover:border-zinc-300"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", selected ? "text-white" : "text-zinc-400")} />
              <span>{t.label}</span>
              <span
                className={cn(
                  "ml-auto text-xs font-mono font-normal",
                  selected ? "text-zinc-300" : "text-zinc-400"
                )}
              >
                {t.credits}cr
              </span>
            </button>
          );
        })}
      </div>

      {/* prompt */}
      <div className="space-y-2">
        <Label className="text-zinc-700 font-medium">New prompt</Label>
        <Textarea
          rows={4}
          placeholder="Describe what you want to change or improve..."
          className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 resize-none text-sm leading-relaxed"
          {...register("prompt")}
        />
        {errors.prompt && <p className="text-red-500 text-sm">{errors.prompt.message}</p>}
      </div>

      {!hasEnoughCredits && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-600 text-sm font-medium">
          Not enough credits. Claim your free daily credit from the sidebar.
        </div>
      )}

      {/* actions */}
      <div className="flex gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 border border-zinc-200 text-zinc-600 hover:text-zinc-900 hover:border-zinc-300 text-sm font-semibold h-11 rounded-xl transition-all bg-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading || !hasEnoughCredits}
          className="flex-1 flex items-center justify-center gap-2 bg-zinc-900 text-white text-sm font-semibold h-11 rounded-xl hover:bg-zinc-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <>
              <RefreshCw className="w-4 h-4" />
              Regenerate
            </>
          )}
        </button>
      </div>
    </form>
  );
};