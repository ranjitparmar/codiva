"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { motion } from "framer-motion";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { authApi } from "@/lib/api/auth.api";
import { useAuthStore } from "@/store/auth.store";
import { Loader2, ArrowRight } from "lucide-react";
import Cookies from "js-cookie";

const schema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

type FormData = z.infer<typeof schema>;

export const LoginForm = () => {
  const router = useRouter();
  const { setAuth } = useAuthStore();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      const res = await authApi.login(data.email, data.password);
      Cookies.set("token", res.token, { expires: 7, sameSite: "lax" });
      const me = await authApi.me();
      setAuth(me.user, res.token);
      toast.success("Welcome back!");
      router.push("/dashboard");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Invalid credentials");
    } finally {
      setLoading(false);
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
          <h1
            className="text-3xl font-bold text-zinc-900 tracking-tight mb-2"
            style={{ fontFamily: "Bricolage Grotesque, sans-serif" }}
          >
            Welcome back
          </h1>
          <p className="text-zinc-400">Sign in to your Codiva account.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">Email address</Label>
            <Input
              type="email"
              placeholder="you@example.com"
              autoComplete="email"
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base"
              {...register("email")}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label className="text-zinc-700 font-medium">Password</Label>
            <Input
              type="password"
              placeholder="Your password"
              autoComplete="current-password"
              className="h-12 rounded-xl border-zinc-200 bg-zinc-50 text-zinc-900 placeholder:text-zinc-400 focus-visible:ring-zinc-900 focus-visible:border-zinc-900 text-base"
              {...register("password")}
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
            <div className="flex items-center justify-end">
              <Link href="/forgot-password" className="text-sm text-zinc-400 hover:text-zinc-700 transition-colors">
                Forgot password?
              </Link>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 bg-zinc-900 text-white text-base font-semibold h-12 rounded-xl hover:bg-zinc-700 transition-all duration-200 shadow-sm disabled:opacity-60 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Sign in
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>

      <p className="text-center text-sm text-zinc-400 mt-6">
        Don't have an account?{" "}
        <Link href="/register" className="text-zinc-900 font-semibold hover:underline">
          Create one free
        </Link>
      </p>
    </motion.div>
  );
};