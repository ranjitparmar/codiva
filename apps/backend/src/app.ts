import express, {Application, Request, Response} from "express";
import authRoutes from "./modules/auth/auth.routes";
import { errorHandler } from "./middlewares/errorHandler";
import cors from "cors";

const app: Application = express();

// middlewares
app.use(cors())
app.use(express.json())

// health route
app.get("/", (req: Request, res: Response)=>{
    return res.json({
        success: true,
        message: "Server is Live"
    })
})

// routes
app.use("/api/auth", authRoutes)

// global error handler
app.use(errorHandler)

// export app
export default app