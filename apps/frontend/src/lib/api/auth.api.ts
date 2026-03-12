import apiClient from "./client";
import { User } from "@/types";

export const authApi = {
  register: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/register", { email, password });
    return res.data;
  },

  verifyOtp: async (email: string, otp: string) => {
    const res = await apiClient.post("/auth/verify-otp", { email, otp });
    return res.data;
  },

  resendOtp: async (email: string) => {
    const res = await apiClient.post("/auth/resend-otp", { email });
    return res.data;
  },

  login: async (email: string, password: string) => {
    const res = await apiClient.post("/auth/login", { email, password });
    return res.data;
  },

  me: async (): Promise<{ success: boolean; user: User }> => {
    const res = await apiClient.get("/auth/me");
    return res.data;
  },
  changePassword: async (currentPassword: string, newPassword: string) => {
    const res = await apiClient.put("/auth/change-password", { currentPassword, newPassword });
    return res.data;
  },

  forgotPassword: async (email: string) => {
    const res = await apiClient.post("/auth/forgot-password", { email });
    return res.data;
  },

  resetPassword: async (email: string, otp: string, newPassword: string) => {
    const res = await apiClient.post("/auth/reset-password", { email, otp, newPassword });
    return res.data;
  },
};