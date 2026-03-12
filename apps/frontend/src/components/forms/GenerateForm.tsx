"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { sitesApi } from "@/lib/api/sites.api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Sparkles, Zap, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import type { GenerationTier } from "@/types";

const schema = z.object({
  prompt: z.string().min(10, "Describe your site in at least 10 characters"),
  requestedSubdomain: z
    .string()
    .regex(/^[a-z0-9-]*$/, "Only lowercase letters, numbers and hyphens")
    .min(3, "At least 3 characters")
    .max(40, "Max 40 characters")
    .optional()
    .or(z.literal("")),
});

type FormData = z.infer<typeof schema>;

const tiers: {
  value: GenerationTier;
  label: string;
  description: string;
  credits: number;
  icon: typeof Zap;
}[] = [
  {
    value: "STANDARD",
    label: "Standard",
    description: "GPT-4o-mini — fast and lightweight",
    credits: 1,
    icon: Zap,
  },
  {
    value: "PRO",
    label: "Pro",
    description: "GPT-4o — polished, detailed results",
    credits: 5,
    icon: Sparkles,
  },
];

interface Props {
  onSuccess: (generationId: string, siteId: string) => void;
}

export const GenerateForm = ({ onSuccess }: Props) => {
  const { user } = useAuthStore();
  const [tier, setTier] = useState<GenerationTier>("STANDARD");
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  const creditCost = tier === "PRO" ? 5 : 1;
  const hasEnoughCredits = (user?.credits ?? 0) >= creditCost;

  const onSubmit = async (data: FormData) => {
    if (!hasEnoughCredits) {
      toast.error(`You need ${creditCost} credits for ${tier} generation`);
      return;
    }
    setLoading(true);
    try {
      const res = await sitesApi.generate({
        prompt: data.prompt,
        tier,
        requestedSubdomain: data.requestedSubdomain || undefined,
      });
      onSuccess(res.generationId, res.siteId);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to start generation");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-7">
      {/* tier */}
      <div className="space-y-3">
        <Label className="text-zinc-700 font-medium text-base">Generation model</Label>
        <div className="grid grid-cols-2 gap-3">
          {tiers.map((t) => {
            const Icon = t.icon;
            const selected = tier === t.value;
            const affordable = (user?.credits ?? 0) >= t.credits;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => setTier(t.value)}
                className={cn(
                  "relative flex flex-col gap-2 rounded-2xl border-2 p-5 text-left transition-all duration-200",
                  selected
                    ? "border-zinc-900 bg-zinc-900 text-white shadow-lg"
                    : "border-zinc-200 bg-white hover:border-zinc-300 text-zinc-700",
                  !affordable && "opacity-40 cursor-not-allowed"
                )}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Icon className={cn("w-4 h-4", selected ? "text-white" : "text-zinc-500")} />
                    <span className={cn("font-bold text-base", selected ? "text-white" : "text-zinc-900")}>
                      {t.label}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-mono font-semibold px-2.5 py-1 rounded-full",
                      selected ? "bg-white/20 text-white" : "bg-zinc-100 text-zinc-500"
                    )}
                  >
                    {t.credits} cr
                  </span>
                </div>
                <p className={cn("text-sm leading-relaxed", selected ? "text-zinc-300" : "text-zinc-400")}>
                  {t.description}
                </p>
              </button>
            );
          })}
        </div>
      </div>

      {/* prompt */}
      <div className="space-y-2">
        <Label className="text-zinc-700 font-medium text-base" htmlFor="prompt">
          Describe your website
        </Label>
        <Textarea
          id="prompt"
          placeholder="A dark-themed portfolio for a frontend developer named Alex. Include sections for projects, skills, and a contact form. Minimal design with smooth scroll animations."
          rows={5}
          className="rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base resize-none leading-relaxed"
          {...register("prompt")}
        />
        {errors.prompt && <p className="text-red-500 text-sm">{errors.prompt.message}</p>}
      </div>

      {/* subdomain */}
      <div className="space-y-2">
        <Label className="text-zinc-700 font-medium text-base" htmlFor="requestedSubdomain">
          Preferred subdomain{" "}
          <span className="text-zinc-400 font-normal">(optional)</span>
        </Label>
        <div className="flex rounded-xl overflow-hidden border border-zinc-200 focus-within:border-zinc-900 focus-within:ring-2 focus-within:ring-zinc-900/10 transition-all bg-zinc-50">
          <Input
            id="requestedSubdomain"
            placeholder="my-portfolio"
            className="flex-1 border-0 bg-transparent text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-0 h-12 text-base font-mono shadow-none"
            {...register("requestedSubdomain")}
          />
          <div className="flex items-center px-4 bg-zinc-100 border-l border-zinc-200 text-sm text-zinc-400 font-mono whitespace-nowrap">
            .codiva.ranjitparmar.in
          </div>
        </div>
        {errors.requestedSubdomain && (
          <p className="text-red-500 text-sm">{errors.requestedSubdomain.message}</p>
        )}
        <p className="text-zinc-400 text-sm">Leave empty and AI will pick a name based on your prompt.</p>
      </div>

      {/* cost row */}
      <div className="flex items-center justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-5 py-4">
        <span className="text-zinc-500 text-sm">Generation cost</span>
        <div className="flex items-center gap-3">
          <span className="text-zinc-900 font-bold text-base">
            {creditCost} credit{creditCost > 1 ? "s" : ""}
          </span>
          <span className="text-zinc-400 text-sm">
            {user?.credits ?? 0} available
          </span>
        </div>
      </div>

      {!hasEnoughCredits && (
        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-3 text-red-600 text-sm font-medium">
          Not enough credits. Claim your free daily credit from the sidebar.
        </div>
      )}

      <button
        type="submit"
        disabled={loading || !hasEnoughCredits}
        className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold h-13 py-3.5 rounded-xl hover:bg-zinc-700 transition-all duration-200 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Starting generation...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Generate site
            <ArrowRight className="w-4 h-4 ml-1" />
          </>
        )}
      </button>
    </form>
  );
};