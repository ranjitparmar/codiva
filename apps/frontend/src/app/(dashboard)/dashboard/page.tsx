"use client";

import { useAuthStore } from "@/store/auth.store";
import { useQuery } from "@tanstack/react-query";
import { sitesApi } from "@/lib/api/sites.api";
import { SiteCard } from "@/components/dashboard/SiteCard";
import { motion } from "framer-motion";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, Globe, Sparkles, CheckCircle, Zap } from "lucide-react";
import type { Site } from "@/types";

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
};

export default function DashboardPage() {
  const { user } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ["sites"],
    queryFn: async () => {
      const res = await sitesApi.getMySites();
      return res.sites as Site[];
    },
  });

  const liveSites = data?.filter(s => s.generations?.[0]?.status === "READY").length ?? 0;
  const totalGenerations = data?.reduce((acc, s) => acc + (s.generations?.length ?? 0), 0) ?? 0;

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-10"
      >
        <div className="flex items-start justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-zinc-900 tracking-tight mb-1"
              style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
            >
              {getGreeting()}, {user?.email?.split("@")[0]}.
            </h1>
            <p className="text-zinc-400 text-base">Here's what you've built so far.</p>
          </div>
          <Link
            href="/sites/new"
            className="hidden sm:flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-zinc-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            New site
          </Link>
        </div>

        {/* stats */}
        {!isLoading && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[
              { label: "Total sites", value: data?.length ?? 0, icon: Globe },
              { label: "Live sites", value: liveSites, icon: CheckCircle },
              { label: "Generations", value: totalGenerations, icon: Zap },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.05 }}
                className="bg-white rounded-2xl border border-zinc-200 px-5 py-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <stat.icon className="w-4 h-4 text-zinc-400" />
                  <span className="text-sm text-zinc-400">{stat.label}</span>
                </div>
                <p
                  className="text-3xl font-bold text-zinc-900"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      {/* mobile new site */}
      <div className="sm:hidden mb-6">
        <Link
          href="/sites/new"
          className="flex items-center justify-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-5 py-3 rounded-xl w-full hover:bg-zinc-700 transition-all"
        >
          <Plus className="w-4 h-4" />
          Generate new site
        </Link>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48 rounded-2xl bg-zinc-100" />
          ))}
        </div>
      ) : data?.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center justify-center py-28 text-center"
        >
          <div className="w-16 h-16 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
            <Sparkles className="w-7 h-7 text-zinc-400" />
          </div>
          <h3
            className="text-xl font-bold text-zinc-900 mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            No sites yet
          </h3>
          <p className="text-zinc-400 text-sm mb-8 max-w-xs leading-relaxed">
            Describe any website in plain English and Codiva will generate and deploy it in seconds.
          </p>
          <Link
            href="/sites/new"
            className="flex items-center gap-2 bg-zinc-900 text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-zinc-700 transition-all shadow-sm"
          >
            <Plus className="w-4 h-4" />
            Generate your first site
          </Link>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data?.map((site, i) => (
            <motion.div
              key={site.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.06 }}
            >
              <SiteCard site={site} />
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}