"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { sitesApi } from "@/lib/api/sites.api";
import { GenerationHistory } from "@/components/dashboard/GenerationHistory";
import { GenerationStatus } from "@/components/dashboard/GenerationStatus";
import { RegenerateForm } from "@/components/forms/RegenerateForm";
import { motion } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  ArrowLeft, ExternalLink, RefreshCw, Globe,
  Monitor, History, ArrowUpRight, Copy, Check, Trash2,
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import type { Generation, Site } from "@/types";

export default function SiteDetailPage() {
  const { siteId } = useParams<{ siteId: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();

  const [regenerating, setRegenerating] = useState(false);
  const [activeGenerationId, setActiveGenerationId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { data: site, isLoading: siteLoading } = useQuery<Site>({
    queryKey: ["site", siteId],
    queryFn: async () => {
      const res = await sitesApi.getMySites();
      const found = res.sites.find((s: Site) => s.id === siteId);
      if (!found) throw new Error("Site not found");
      return found;
    },
  });

  const { data: generations, isLoading: genLoading } = useQuery<Generation[]>({
    queryKey: ["site-generations", siteId],
    queryFn: async () => {
      const res = await sitesApi.getSiteGenerations(siteId);
      return res.generations;
    },
  });

  const latestGen = generations?.[0];
  const siteUrl = site?.subdomain
    ? `https://${site.subdomain}.codiva.ranjitparmar.in`
    : null;

  const handleCopyUrl = async () => {
    if (!siteUrl) return;
    await navigator.clipboard.writeText(siteUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("URL copied!");
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await sitesApi.deleteSite(siteId);
      toast.success("Site deleted");
      queryClient.invalidateQueries({ queryKey: ["sites"] });
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete site");
      setDeleting(false);
    }
  };

  const handleRegenerateSuccess = (generationId: string) => {
    setActiveGenerationId(generationId);
    setRegenerating(false);
  };

  const handleGenerationComplete = () => {
    setActiveGenerationId(null);
    queryClient.invalidateQueries({ queryKey: ["site", siteId] });
    queryClient.invalidateQueries({ queryKey: ["site-generations", siteId] });
    queryClient.invalidateQueries({ queryKey: ["me"] });
  };

  if (siteLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-64 rounded-xl bg-zinc-100" />
        <Skeleton className="h-[520px] w-full rounded-3xl bg-zinc-100" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center">
        <Globe className="w-10 h-10 text-zinc-300 mb-4" />
        <p className="text-zinc-500 font-medium mb-5">Site not found.</p>
        <button onClick={() => router.push("/dashboard")} className="text-sm text-zinc-400 hover:text-zinc-900 transition-colors">
          ← Back to dashboard
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-7"
    >
      {/* header */}
      <div>
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-900 text-sm font-medium mb-5 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Dashboard
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-zinc-100 rounded-2xl flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5 text-zinc-500" />
            </div>
            <div>
              <h1
                className="text-2xl font-bold text-zinc-900 font-mono tracking-tight"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                {site.subdomain ?? "pending..."}
              </h1>
              {siteUrl && (
                <a
                  href={siteUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-zinc-700 transition-colors mt-0.5"
                >
                  {siteUrl}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
              )}
            </div>
          </div>

          {/* actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {siteUrl && (
              <button
                onClick={handleCopyUrl}
                className="flex items-center gap-2 border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-xl transition-all bg-white shadow-sm"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? "Copied!" : "Copy URL"}
              </button>
            )}
            {siteUrl && (
              <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                <button className="flex items-center gap-2 border border-zinc-200 text-zinc-600 hover:border-zinc-300 hover:text-zinc-900 text-sm font-medium px-4 py-2.5 rounded-xl transition-all bg-white shadow-sm">
                  <ExternalLink className="w-4 h-4" />
                  Visit
                </button>
              </a>
            )}
            {!activeGenerationId && (
              <button
                onClick={() => setRegenerating((r) => !r)}
                className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-xl transition-all shadow-sm ${regenerating
                    ? "bg-zinc-100 text-zinc-700 border border-zinc-200"
                    : "bg-zinc-900 text-white hover:bg-zinc-700"
                  }`}
              >
                <RefreshCw className="w-4 h-4" />
                Regenerate
              </button>
            )}
            <AlertDialog>
              <AlertDialogTrigger>
                <button className="flex items-center gap-2 border border-red-200 text-red-500 hover:bg-red-50 text-sm font-medium px-4 py-2.5 rounded-xl transition-all bg-white shadow-sm">
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </AlertDialogTrigger>
              <AlertDialogContent className="bg-white border-zinc-200 rounded-2xl">
                <AlertDialogHeader>
                  <AlertDialogTitle
                    className="text-xl font-bold text-zinc-900"
                    style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                  >
                    Delete this site?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-zinc-500 text-base">
                    This will permanently delete{" "}
                    <span className="font-semibold text-zinc-700 font-mono">
                      {site.subdomain ?? "this site"}
                    </span>{" "}
                    and remove all its files. This action cannot be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="gap-2">
                  <AlertDialogCancel className="rounded-xl border-zinc-200 text-zinc-600 hover:bg-zinc-50">
                    Cancel
                  </AlertDialogCancel>
                  <AlertDialogAction
                    onClick={handleDelete}
                    disabled={deleting}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold"
                  >
                    {deleting ? "Deleting..." : "Yes, delete site"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>

      {/* active generation */}
      {activeGenerationId && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden"
        >
          <div className="px-8 py-4 border-b border-zinc-100 bg-zinc-50 flex items-center gap-2">
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse" />
            <span className="text-sm font-semibold text-zinc-700">Generation in progress</span>
          </div>
          <GenerationStatus generationId={activeGenerationId} onComplete={handleGenerationComplete} />
        </motion.div>
      )}

      {/* regenerate form */}
      {regenerating && !activeGenerationId && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 bg-zinc-900 rounded-xl flex items-center justify-center">
              <RefreshCw className="w-4 h-4 text-white" />
            </div>
            <h3
              className="text-xl font-bold text-zinc-900"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              Regenerate site
            </h3>
          </div>
          <RegenerateForm
            siteId={siteId}
            defaultPrompt={latestGen?.prompt}
            onSuccess={handleRegenerateSuccess}
            onCancel={() => setRegenerating(false)}
          />
        </motion.div>
      )}

      {/* tabs */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <Tabs defaultValue="preview">
          <div className="px-6 pt-5 border-b border-zinc-100">
            <TabsList className="bg-zinc-100 rounded-xl p-1 h-auto gap-1">
              <TabsTrigger value="preview" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 text-sm gap-2 px-4 py-2 font-medium">
                <Monitor className="w-4 h-4" />
                Preview
              </TabsTrigger>
              <TabsTrigger value="history" className="rounded-lg data-[state=active]:bg-white data-[state=active]:text-zinc-900 data-[state=active]:shadow-sm text-zinc-500 text-sm gap-2 px-4 py-2 font-medium">
                <History className="w-4 h-4" />
                History
                {generations?.length ? (
                  <span className="bg-zinc-200 text-zinc-600 text-xs font-mono px-1.5 py-0.5 rounded-md">
                    {generations.length}
                  </span>
                ) : null}
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="preview" className="m-0">
            {siteUrl && latestGen?.status === "READY" ? (
              <>
                <div className="flex items-center gap-3 px-5 py-3 border-b border-zinc-100 bg-zinc-50/50">
                  <div className="flex gap-1.5">
                    <span className="w-3 h-3 rounded-full bg-red-400/60" />
                    <span className="w-3 h-3 rounded-full bg-amber-400/60" />
                    <span className="w-3 h-3 rounded-full bg-green-400/60" />
                  </div>
                  <div className="flex-1 bg-white border border-zinc-200 rounded-lg px-4 py-1.5 text-xs text-zinc-400 font-mono truncate">
                    {siteUrl}
                  </div>
                  <a href={siteUrl} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="w-4 h-4 text-zinc-400 hover:text-zinc-700 transition-colors" />
                  </a>
                </div>
                <iframe
                  src={siteUrl}
                  className="w-full h-[580px] border-0"
                  title={site.subdomain ?? "preview"}
                  sandbox="allow-scripts allow-same-origin"
                />
              </>
            ) : (
              <div className="flex flex-col items-center justify-center py-28 text-center px-8">
                <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-5">
                  <Monitor className="w-7 h-7 text-zinc-300" />
                </div>
                <h3
                  className="text-lg font-bold text-zinc-900 mb-2"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  No preview available
                </h3>
                <p className="text-zinc-400 text-sm max-w-xs leading-relaxed">
                  {latestGen?.status === "GENERATING" || latestGen?.status === "PENDING"
                    ? "Your site is still generating. Preview will appear once it's ready."
                    : latestGen?.status === "FAILED"
                      ? "Generation failed. Try clicking Regenerate to start again."
                      : "Generate your first site to see a live preview here."}
                </p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="history" className="m-0 p-6">
            <div className="mb-5">
              <h3
                className="text-lg font-bold text-zinc-900"
                style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
              >
                Generation history
              </h3>
              <p className="text-zinc-400 text-sm mt-1">Every generation attempt for this site.</p>
            </div>
            {genLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="h-24 rounded-2xl bg-zinc-100" />
                ))}
              </div>
            ) : (
              <GenerationHistory generations={generations ?? []} />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}