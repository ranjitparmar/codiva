import {z} from "zod";
import { constants } from "../../config/constants";

export const registerSchema = z.object({
    email: z.email("Invalid email"),
    password: z.string("Invalid Password").min(8, "Password must be atleast 8 characters long")
})

export const loginSchema = z.object({
  email: z.email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

export const verifyOtpSchema = z.object({
  email: z.email("Invalid email"),
  otp: z.string().length(constants.OTP_LENGTH, "Invalid OTP"),
});

export const resendOtpSchema = z.object({
  email: z.email("Invalid email"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type VerifyOtpInput = z.infer<typeof verifyOtpSchema>;
export type ResendOtpInput = z.infer<typeof resendOtpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;