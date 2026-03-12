"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth.api";
import { Loader2, ArrowRight, KeyRound } from "lucide-react";

export const ForgotPasswordForm = () => {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  // reset form
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [resetting, setResetting] = useState(false);

  const handleSend = async () => {
    if (!email) return;
    setLoading(true);
    try {
      await authApi.forgotPassword(email);
      setSent(true);
      toast.success("If that email exists, a reset code was sent.");
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    if (!otp || !newPassword) return;
    setResetting(true);
    try {
      await authApi.resetPassword(email, otp, newPassword);
      toast.success("Password reset! Sign in with your new password.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid or expired code");
    } finally {
      setResetting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-md"
    >
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-xl shadow-zinc-100/80 p-10">
        <div className="mb-8">
          <div className="w-14 h-14 bg-zinc-100 rounded-2xl flex items-center justify-center mb-6">
            <KeyRound className="w-6 h-6 text-zinc-600" />
          </div>
          <h1
            className="text-3xl font-bold text-zinc-900 tracking-tight mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            {sent ? "Check your email" : "Forgot password?"}
          </h1>
          <p className="text-zinc-400 leading-relaxed">
            {sent
              ? `Enter the reset code sent to ${email} and choose a new password.`
              : "Enter your email and we'll send you a reset code."}
          </p>
        </div>

        {!sent ? (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-zinc-700 font-medium">Email address</Label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="you@example.com"
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 text-base"
              />
            </div>
            <button
              onClick={handleSend}
              disabled={loading || !email}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold h-12 rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Send reset code <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        ) : (
          <div className="space-y-5">
            <div className="space-y-2">
              <Label className="text-zinc-700 font-medium">Reset code</Label>
              <Input
                type="text"
                inputMode="numeric"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 text-2xl font-bold text-center tracking-[0.5em] placeholder:text-zinc-300 focus-visible:ring-zinc-900"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-700 font-medium">New password</Label>
              <Input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 text-base"
              />
            </div>
            <button
              onClick={handleReset}
              disabled={resetting || otp.length !== 6 || newPassword.length < 8}
              className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold h-12 rounded-xl hover:bg-zinc-700 transition-all disabled:opacity-50"
            >
              {resetting ? <Loader2 className="w-5 h-5 animate-spin" /> : <>Reset password <ArrowRight className="w-4 h-4" /></>}
            </button>
          </div>
        )}
      </div>

      <p className="text-center text-sm text-zinc-400 mt-6">
        Remember it?{" "}
        <Link href="/login" className="text-zinc-900 font-semibold hover:underline">
          Back to sign in
        </Link>
      </p>
    </motion.div>
  );
};