import express, {Application, Request, Response} from "express";
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

// export app
export default app