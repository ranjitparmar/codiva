"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { useAuthStore } from "@/store/auth.store";
import { authApi } from "@/lib/api/auth.api";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Loader2, User, Lock, ShieldCheck } from "lucide-react";

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Required"),
  newPassword: z.string().min(8, "At least 8 characters"),
  confirmPassword: z.string().min(1, "Required"),
}).refine((d) => d.newPassword === d.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

type PasswordForm = z.infer<typeof passwordSchema>;

export default function SettingsPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  });

  const onChangePassword = async (data: PasswordForm) => {
    setLoading(true);
    try {
      await authApi.changePassword(data.currentPassword, data.newPassword);
      toast.success("Password updated successfully");
      reset();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl"
    >
      <div className="mb-8">
        <h1
          className="text-3xl font-bold text-zinc-900 tracking-tight mb-1"
          style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
        >
          Settings
        </h1>
        <p className="text-zinc-400 text-base">Manage your account preferences.</p>
      </div>

      {/* account info */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden mb-5">
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
            <User className="w-4 h-4 text-zinc-500" />
          </div>
          <h2
            className="text-lg font-bold text-zinc-900"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Account
          </h2>
        </div>
        <div className="px-8 py-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-500 text-sm font-medium">Email address</Label>
            <div className="h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 flex items-center">
              <span className="text-zinc-900 text-base">{user?.email}</span>
              {user?.isVerified && (
                <div className="ml-auto flex items-center gap-1.5 text-xs font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-zinc-500 text-sm font-medium">Credits remaining</Label>
              <div className="h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 flex items-center">
                <span
                  className="text-2xl font-bold text-zinc-900"
                  style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
                >
                  {user?.credits}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-500 text-sm font-medium">Member since</Label>
              <div className="h-12 rounded-xl border border-zinc-200 bg-zinc-50 px-4 flex items-center">
                <span className="text-zinc-700 text-sm">
                  {user?.createdAt
                    ? new Date(user.createdAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })
                    : "—"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* change password */}
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="px-8 py-5 border-b border-zinc-100 flex items-center gap-3">
          <div className="w-9 h-9 bg-zinc-100 rounded-xl flex items-center justify-center">
            <Lock className="w-4 h-4 text-zinc-500" />
          </div>
          <h2
            className="text-lg font-bold text-zinc-900"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Change password
          </h2>
        </div>
        <form onSubmit={handleSubmit(onChangePassword)} className="px-8 py-6 space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">Current password</Label>
            <Input
              type="password"
              placeholder="Your current password"
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base"
              {...register("currentPassword")}
            />
            {errors.currentPassword && (
              <p className="text-red-500 text-sm">{errors.currentPassword.message}</p>
            )}
          </div>

          <Separator className="bg-zinc-100" />

          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">New password</Label>
            <Input
              type="password"
              placeholder="Min. 8 characters"
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base"
              {...register("newPassword")}
            />
            {errors.newPassword && (
              <p className="text-red-500 text-sm">{errors.newPassword.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">Confirm new password</Label>
            <Input
              type="password"
              placeholder="Repeat your new password"
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center gap-2 bg-zinc-900 text-white text-sm font-semibold h-11 px-8 rounded-xl hover:bg-zinc-700 transition-all shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Update password"}
          </button>
        </form>
      </div>
    </motion.div>
  );
}