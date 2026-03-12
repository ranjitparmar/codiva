import rateLimit from "express-rate-limit";

export const authRateLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 Minutes
  max: 15,
  message: { success: false, message: "Too many requests, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});