import bcrypt from "bcrypt";
import { authRepository } from "../../repositories/auth.repository";
import { redis } from "../../lib/redis";
import { saveOtp, verifyOtp } from "../../lib/otp";
import { sendOtpEmail } from "../../utils/email";
import { generateToken } from "../../utils/jwt";
import { constants } from "../../config/constants";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../errors";
import type {
  RegisterInput,
  LoginInput,
  VerifyOtpInput,
  ResendOtpInput,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
} from "./auth.schema";

export const authService = {
  register: async ({ email, password }: RegisterInput) => {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      if (existing.isVerified) {
        throw new ConflictError("Email already registered");
      }

      const cooldownKey = `otp:cooldown:${email}`;
      const onCooldown = await redis.get(cooldownKey);
      if (onCooldown) {
        throw new ValidationError("An OTP was already sent. Please check your email or wait 60 seconds.");
      }

      await authRepository.deleteByEmail(email);
      await redis.del(`otp:cooldown:${email}`);
    }

    const passwordHash = await bcrypt.hash(password, constants.BCRYPT_ROUNDS);
    await authRepository.create(email, passwordHash);

    // saveOtp generates internally and returns the code
    const otp = await saveOtp(email);
    await sendOtpEmail(email, otp);

    await redis.set(`otp:cooldown:${email}`, "1", "EX", constants.OTP_RESEND_SECONDS);

    return { message: "Registered successfully. Check your email for the OTP." };
  },

  verifyOtp: async (email: string, inputOtp: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");
    if (user.isVerified) throw new ConflictError("Email already verified");

    // verifyOtp now throws on failure, no return value to check
    await verifyOtp(email, inputOtp);

    const updated = await authRepository.markVerified(email);
    const token = generateToken(updated.id);

    return { token, message: "Email verified successfully." };
  },

  resendOtp: async (email: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");
    if (user.isVerified) throw new ConflictError("Email already verified");

    const cooldownKey = `otp:cooldown:${email}`;
    const onCooldown = await redis.get(cooldownKey);
    if (onCooldown) throw new ValidationError("Please wait 60 seconds before requesting a new OTP");

    const otp = await saveOtp(email);
    await sendOtpEmail(email, otp);
    await redis.set(cooldownKey, "1", "EX", constants.OTP_RESEND_SECONDS);

    return { message: "OTP resent. Check your email." };
  },

  login: async ({ email, password }: LoginInput) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new UnauthorizedError("Invalid credentials");

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Invalid credentials");

    if (!user.isVerified) throw new UnauthorizedError("Please verify your email first");

    const token = generateToken(user.id);
    return { token };
  },

  me: async (userId: string) => {
    const user = await authRepository.findMeById(userId);
    if (!user) throw new NotFoundError("User not found");
    return user;
  },

  changePassword: async (userId: string, input: ChangePasswordInput) => {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    const valid = await bcrypt.compare(input.currentPassword, user.passwordHash);
    if (!valid) throw new UnauthorizedError("Current password is incorrect");

    const hash = await bcrypt.hash(input.newPassword, constants.BCRYPT_ROUNDS);
    await authRepository.updatePassword(userId, hash);
  },

  forgotPassword: async (input: ForgotPasswordInput) => {
    const user = await authRepository.findByEmail(input.email);
    if (user && user.isVerified) {
      const otp = await saveOtp(`reset:${input.email}`);
      await sendOtpEmail(input.email, otp, "reset");
    }
  },

  resetPassword: async (input: ResetPasswordInput) => {
    await verifyOtp(`reset:${input.email}`, input.otp);

    const user = await authRepository.findByEmail(input.email);
    if (!user) throw new NotFoundError("User not found");

    const hash = await bcrypt.hash(input.newPassword, constants.BCRYPT_ROUNDS);
    await authRepository.updatePassword(user.id, hash);
  },
};