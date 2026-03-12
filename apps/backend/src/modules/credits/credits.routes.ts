import { Router } from "express";
import { creditsController } from "./credits.controller";
import { authenticate } from "../../middlewares/auth.middleware";
import { authRateLimiter } from "../../middlewares/rateLimiter";

const router = Router();

router.use(authenticate);
router.post("/claim", authRateLimiter, creditsController.claim);

export default router;