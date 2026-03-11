import { AppError } from "../errors";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    if (err instanceof AppError && err.isOperational) {
        return res.status(err.statusCode).json({
            success: false,
            message: err.message
        })
    }

    // unhandled errors
    console.error("[e] Unhandled Error: ", err)

    // general handler
    return res.status(500).json({
        success: false,
        message: "Internal Server Error"
    })
}