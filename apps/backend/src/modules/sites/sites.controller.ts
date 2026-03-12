import { Request, Response } from "express";
import { sitesService } from "./sites.service";
import { asyncHandler } from "../../middlewares/asyncHandler";

export const sitesController = {
  generate: asyncHandler(async (req: Request, res: Response) => {
    const result = await sitesService.generate(req.userId!, req.body);
    res.status(202).json({ success: true, ...result });
  }),

  regenerate: asyncHandler(async (req: Request, res: Response) => {
    const result = await sitesService.regenerate(
      req.userId!,
      req.params.siteId as string,
      req.body
    );
    res.status(202).json({ success: true, ...result });
  }),

  getStatus: asyncHandler(async (req: Request, res: Response) => {
    const result = await sitesService.getStatus(req.params.id as string, req.userId!);
    res.json({ success: true, ...result });
  }),

  getMySites: asyncHandler(async (req: Request, res: Response) => {
    const result = await sitesService.getMySites(req.userId!);
    res.json({ success: true, sites: result });
  }),
  getSiteGenerations: asyncHandler(async (req: Request, res: Response) => {
    const result = await sitesService.getSiteGenerations(req.userId!, req.params.siteId as string);
    res.json({ success: true, generations: result });
  }),
  deleteSite: asyncHandler(async (req: Request, res: Response) => {
    await sitesService.deleteSite(req.userId!, req.params.siteId as string);
    res.json({ success: true, message: "Site deleted" });
  }),
};