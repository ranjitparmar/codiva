"use client";
import { cn } from "@/lib/utils";

import Link from "next/link";
import { Site } from "@/types";
import { formatRelativeTime } from "@/lib/utils";
import { Globe, ExternalLink, ArrowUpRight } from "lucide-react";

const statusConfig = {
  READY: { dot: "bg-emerald-500", label: "Live", color: "text-emerald-600", bg: "bg-emerald-50" },
  FAILED: { dot: "bg-red-500", label: "Failed", color: "text-red-600", bg: "bg-red-50" },
  GENERATING: { dot: "bg-amber-500 animate-pulse", label: "Generating", color: "text-amber-600", bg: "bg-amber-50" },
  PENDING: { dot: "bg-zinc-300", label: "Pending", color: "text-zinc-500", bg: "bg-zinc-50" },
} as const;

export const SiteCard = ({ site }: { site: Site }) => {
  const latestGen = site.generations?.[0];
  const status = latestGen?.status ?? "PENDING";
  const config = statusConfig[status];
  const siteUrl = site.subdomain
    ? `https://${site.subdomain}.codiva.ranjitparmar.in`
    : null;

  return (
    <Link href={`/sites/${site.id}`}>
      <div className="group bg-white rounded-2xl border border-zinc-200 hover:border-zinc-300 hover:shadow-lg hover:shadow-zinc-100 hover:-translate-y-1 transition-all duration-300 p-6 cursor-pointer h-full flex flex-col">
        {/* top */}
        <div className="flex items-start justify-between mb-5">
          <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center group-hover:bg-zinc-900 transition-colors duration-300">
            <Globe className="w-4 h-4 text-zinc-500 group-hover:text-white transition-colors duration-300" />
          </div>
          <div className={cn(`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full`, config.bg, config.color)}>
            <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            {config.label}
          </div>
        </div>

        {/* content */}
        <div className="flex-1 space-y-2">
          <p className="text-base font-bold text-zinc-900 font-mono truncate">
            {site.subdomain ?? "—"}
          </p>
          {latestGen?.prompt && (
            <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
              {latestGen.prompt}
            </p>
          )}
        </div>

        {/* footer */}
        <div className="mt-5 pt-4 border-t border-zinc-100 flex items-center justify-between">
          <span className="text-xs text-zinc-400">
            {formatRelativeTime(site.createdAt)}
          </span>
          {siteUrl && status === "READY" && (
            <span
              onClick={(e) => { e.preventDefault(); window.open(siteUrl, "_blank"); }}
              className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-900 transition-colors font-medium"
            >
              Visit site
              <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
          )}
        </div>
      </div>
    </Link>
  );
};

