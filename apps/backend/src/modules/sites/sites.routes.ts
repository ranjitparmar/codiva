import { Router } from "express";
import { sitesController } from "./sites.controller";
import { validate } from "../../middlewares/validate";
import { authenticate } from "../../middlewares/auth.middleware";
import { generateSiteSchema, regenerateSiteSchema } from "./sites.schema";

const router = Router();

router.use(authenticate);

router.post("/generate", validate(generateSiteSchema), sitesController.generate);
router.post("/:siteId/regenerate", validate(regenerateSiteSchema), sitesController.regenerate);
router.get("/generations/:id/status", sitesController.getStatus);
router.get("/", sitesController.getMySites);
router.get("/:siteId/generations", sitesController.getSiteGenerations);
router.delete("/:siteId", sitesController.deleteSite);
export default router;