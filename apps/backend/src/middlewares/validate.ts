import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ValidationError } from "../errors";

export const validate = (schema: ZodSchema) => (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body)

    if (!result.success){
        const message = result.error.issues[0].message;
        return next(new ValidationError(message))
    }

    req.body = result.data
    next()
}