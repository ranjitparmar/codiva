import bcrypt from "bcrypt";
import { authRepository } from "../../repositories/auth.repository";
import { redis } from "../../lib/redis";
import { generateOtp, saveOtp, verifyOtp } from "../../lib/otp";
import { sendOtpEmail } from "../../utils/email";
import { generateToken } from "../../utils/jwt";
import { constants } from "../../config/constants";
import {
  ConflictError,
  NotFoundError,
  UnauthorizedError,
  ValidationError,
} from "../../errors";
import type { RegisterInput, LoginInput } from "./auth.schema";

export const authService = {
  register: async ({ email, password }: RegisterInput) => {
    const existing = await authRepository.findByEmail(email);
    if (existing) {
      if (existing.isVerified) {
        throw new ConflictError("Email already registered");
      }

      // check for cooldown
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

    const otp = generateOtp();
    await saveOtp(email, otp);
    await sendOtpEmail(email, otp);

    // set cooldown for emails
    await redis.set(`otp:cooldown:${email}`, "1", "EX", constants.OTP_RESEND_SECONDS);

    return { message: "Registered successfully. Check your email for the OTP." };
  },

  verifyOtp: async (email: string, inputOtp: string) => {
    const user = await authRepository.findByEmail(email);
    if (!user) throw new NotFoundError("User not found");
    if (user.isVerified) throw new ConflictError("Email already verified");

    const result = await verifyOtp(email, inputOtp);
    if (!result.valid) throw new ValidationError(result.reason);

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

    const otp = generateOtp();
    await saveOtp(email, otp);
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
};