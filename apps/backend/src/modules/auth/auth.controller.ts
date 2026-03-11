import { Request, Response } from "express";
import { authService } from "./auth.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

export const authController = {
  register: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.register(req.body);
    res.status(201).json({ success: true, ...result });
  }),

  verifyOtp: asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;
    const result = await authService.verifyOtp(email, otp);
    res.json({ success: true, ...result });
  }),

  resendOtp: asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;
    const result = await authService.resendOtp(email);
    res.json({ success: true, ...result });
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.login(req.body);
    res.json({ success: true, ...result });
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const result = await authService.me(req.userId!);
    res.json({ success: true, user: result });
  }),
};