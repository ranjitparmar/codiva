"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GenerateForm } from "@/components/forms/GenerateForm";
import { GenerationStatus } from "@/components/dashboard/GenerationStatus";
import { useRouter } from "next/navigation";
import { ArrowLeft, Sparkles } from "lucide-react";
import Link from "next/link";

export default function NewSitePage() {
  const router = useRouter();
  const [generationId, setGenerationId] = useState<string | null>(null);
  const [siteId, setSiteId] = useState<string | null>(null);

  const handleSuccess = (gId: string, sId: string) => {
    setGenerationId(gId);
    setSiteId(sId);
  };

  const handleComplete = () => {
    setTimeout(() => {
      if (siteId) router.push(`/sites/${siteId}`);
    }, 2500);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 text-sm font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to dashboard
        </Link>

        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-zinc-900 rounded-xl flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <h1
              className="text-3xl font-bold text-zinc-900 tracking-tight"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Generate a site
            </h1>
          </div>
          <p className="text-zinc-400 text-base ml-[52px]">
            Describe what you want built. AI handles the rest.
          </p>
        </div>

        <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8">
          {generationId ? (
            <GenerationStatus
              generationId={generationId}
              onComplete={handleComplete}
            />
          ) : (
            <GenerateForm onSuccess={handleSuccess} />
          )}
        </div>
      </motion.div>
    </div>
  );
}