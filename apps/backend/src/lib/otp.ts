import { redis } from "./redis";
import { constants } from "../config/constants";

const key = (email: string) => `otp:${email}`;

export const generateOtp = (): string => {
  return Math.floor(
    10 ** (constants.OTP_LENGTH - 1) +
      Math.random() * 9 * 10 ** (constants.OTP_LENGTH - 1)
  ).toString();
};

export const saveOtp = async (email: string, otp: string): Promise<void> => {
  await redis.set(
    key(email),
    JSON.stringify({ otp, attempts: 0 }),
    "EX",
    constants.OTP_EXPIRES_SECONDS
  );
};

export const verifyOtp = async (
  email: string,
  inputOtp: string
): Promise<{ valid: boolean; reason?: string }> => {
  const raw = await redis.get(key(email));

  if (!raw) return { valid: false, reason: "OTP expired or not found" };

  const { otp, attempts } = JSON.parse(raw);

  if (attempts >= constants.OTP_MAX_ATTEMPTS) {
    await redis.del(key(email));
    return { valid: false, reason: "Too many attempts, request a new OTP" };
  }

  if (otp !== inputOtp) {
    await redis.set(
      key(email),
      JSON.stringify({ otp, attempts: attempts + 1 }),
      "KEEPTTL"
    );
    return { valid: false, reason: "Incorrect OTP" };
  }

  await redis.del(key(email));
  return { valid: true };
};