"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/auth.store";
import { creditsApi } from "@/lib/api/credits.api";
import { authApi } from "@/lib/api/auth.api";
import { toast } from "sonner";
import { Zap, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const getTimeUntilNextClaim = (lastClaimed: string | null): string | null => {
  if (!lastClaimed) return null;
  const diff = 86400000 - (Date.now() - new Date(lastClaimed).getTime());
  if (diff <= 0) return null;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
};

export const CreditsBadge = () => {
  const { user, setUser } = useAuthStore();
  const [claiming, setClaiming] = useState(false);
  const [timeLeft, setTimeLeft] = useState<string | null>(null);

  useEffect(() => {
    const update = () => setTimeLeft(getTimeUntilNextClaim(user?.lastCreditsClaimed ?? null));
    update();
    const t = setInterval(update, 60000);
    return () => clearInterval(t);
  }, [user?.lastCreditsClaimed]);

  const canClaim = !timeLeft;

  const handleClaim = async () => {
    if (!canClaim || claiming) return;
    setClaiming(true);
    try {
      await creditsApi.claim();
      const me = await authApi.me();
      setUser(me.user);
      toast.success("1 free credit claimed!");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not claim credit");
    } finally {
      setClaiming(false);
    }
  };

  return (
    <div
      onClick={handleClaim}
      title={canClaim ? "Click to claim your free daily credit" : `Next free credit in ${timeLeft}`}
      className={cn(
        "flex items-center gap-3 px-3 py-2.5 rounded-xl w-full transition-all select-none",
        canClaim ? "cursor-pointer hover:bg-amber-50" : "cursor-default"
      )}
    >
      <Zap className={cn("w-4 h-4 shrink-0", canClaim ? "text-amber-500" : "text-zinc-300")} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-bold text-zinc-900">{user?.credits ?? 0}</span>
        <span className="text-xs text-zinc-400">credits</span>
      </div>
      {claiming ? (
        <Loader2 className="w-3.5 h-3.5 animate-spin ml-auto text-zinc-400" />
      ) : canClaim ? (
        <span className="ml-auto text-xs text-amber-500 font-semibold">Free</span>
      ) : (
        <span className="ml-auto text-xs text-zinc-400 font-mono">{timeLeft}</span>
      )}
    </div>
  );
};