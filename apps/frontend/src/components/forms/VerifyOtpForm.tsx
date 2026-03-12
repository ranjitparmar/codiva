"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, Mail, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";

export const VerifyOtpForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const { setAuth } = useAuthStore();

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [cooldown, setCooldown] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [cooldown]);

  const handleVerify = async () => {
    if (otp.length !== 6) { toast.error("Enter the 6-digit code"); return; }
    setLoading(true);
    try {
      const res = await authApi.verifyOtp(email, otp);
      Cookies.set("token", res.token, { expires: 7, sameSite: "lax" });
      const me = await authApi.me();
      setAuth(me.user, res.token);
      toast.success("Email verified! Welcome to Codiva.");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid code");
      setOtp("");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResendLoading(true);
    try {
      await authApi.resendOtp(email);
      toast.success("New code sent.");
      setCooldown(60);
      setCanResend(false);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Could not resend code");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-100/80 p-10">
        <div className="mb-8">
          <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
            <Mail className="w-6 h-6 text-zinc-600" />
          </div>
          <h1
            className="text-3xl font-bold text-zinc-900 tracking-tight mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Check your email
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            We sent a 6-digit code to{" "}
            <span className="font-semibold text-zinc-700">{email}</span>
          </p>
        </div>

        <div className="space-y-5">
          <Input
            type="text"
            inputMode="numeric"
            maxLength={6}
            value={otp}
            onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
            onKeyDown={(e) => e.key === "Enter" && handleVerify()}
            placeholder="000000"
            className="h-16 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 text-3xl font-bold text-center tracking-[0.6em] placeholder:text-zinc-300 placeholder:tracking-[0.6em] focus-visible:ring-zinc-900 focus-visible:border-zinc-900"
          />

          <button
            onClick={handleVerify}
            disabled={loading || otp.length !== 6}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold h-12 rounded-xl hover:bg-zinc-700 transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Verify email
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>

          <div className="text-center pt-2">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resendLoading}
                className="text-sm font-medium text-zinc-900 hover:underline disabled:opacity-50"
              >
                {resendLoading ? "Sending..." : "Resend code"}
              </button>
            ) : (
              <p className="text-sm text-zinc-400">
                Resend in <span className="font-mono font-semibold text-zinc-700">{cooldown}s</span>
              </p>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};