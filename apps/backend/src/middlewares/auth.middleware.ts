import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt"
import { UnauthorizedError } from "../errors";


export const authenticate = (req: Request, res: Response, next: NextFunction)=>{
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith("Bearer ")){
        return next(new UnauthorizedError("No token provided"))
    }

    const token = authHeader.split(" ")[1]

    try{
        const payload = verifyToken(token)
        req.userId = payload.userId
        next()
    }catch {
        next(new UnauthorizedError("Invalid or expired token"))
    }
}