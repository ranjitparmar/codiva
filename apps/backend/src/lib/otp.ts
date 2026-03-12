import crypto from "crypto";
import { redis } from "./redis";
import { constants } from "../config/constants";
import { AppError } from "../errors";

export const generateOtp = () => {
  return String(crypto.randomInt(100000, 999999));
};

export const saveOtp = async (key: string) => {
  const code = generateOtp();
  await redis.set(
    `otp:${key}`,
    JSON.stringify({ code, attempts: 0 }),
    "EX",
    constants.OTP_EXPIRES_SECONDS
  );
  return code;
};

export const verifyOtp = async (key: string, inputCode: string) => {
  const raw = await redis.get(`otp:${key}`);
  if (!raw) throw new AppError("Code expired or invalid", 400);

  const data = JSON.parse(raw);

  if (data.attempts >= constants.OTP_MAX_ATTEMPTS) {
    await redis.del(`otp:${key}`);
    throw new AppError("Too many attempts. Request a new code.", 429);
  }

  if (data.code !== inputCode) {
    data.attempts += 1;
    await redis.set(`otp:${key}`, JSON.stringify(data), "KEEPTTL");
    throw new AppError("Invalid code", 400);
  }

  await redis.del(`otp:${key}`);
  return true;
};