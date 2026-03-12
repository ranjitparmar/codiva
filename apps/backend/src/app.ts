import express, { Application, Request, Response } from "express";
import authRoutes from "./modules/auth/auth.routes";
import sitesRoutes from "./modules/sites/sites.routes";
import creditsRoutes from "./modules/credits/credits.routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";
import helmet from "helmet";
import { env } from "./config/env";

const app: Application = express();

// middlewares
app.use(helmet());
app.use(cors({ origin: env.FRONTEND_URL, credentials: true, }));
app.use(express.json())

// health route
app.get("/", (req: Request, res: Response) => {
    return res.json({
        success: true,
        message: "Server is Live"
    })
})

// routes
app.use("/api/auth", authRoutes)
app.use("/api/sites", sitesRoutes);
app.use("/api/credits", creditsRoutes);

// global error handler
app.use(errorHandler)

// export app
export default app