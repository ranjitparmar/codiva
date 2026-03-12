import { Request, Response } from "express";
import { creditsService } from "./credits.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

export const creditsController = {
  claim: asyncHandler(async (req: Request, res: Response) => {
    const result = await creditsService.claim(req.userId!);
    res.json({ success: true, ...result });
  }),
};