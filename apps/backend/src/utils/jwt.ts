import jwt, { JwtPayload } from "jsonwebtoken";
import { env } from "../config/env";

const JWT_SECRET = env.JWT_SECRET

interface TokenPayload extends JwtPayload{
    userId: string;
}

export const generateToken = (userId: string) => {
    return jwt.sign({ userId: userId }, JWT_SECRET, { expiresIn: "7d" })
}

export const verifyToken = (token: string): TokenPayload => {
    return jwt.verify(token, JWT_SECRET) as TokenPayload
}