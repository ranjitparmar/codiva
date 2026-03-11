import Redis from "ioredis";
import { env } from "../config/env";

export const redis = new Redis(env.REDIS_URL)

redis.on("connect", ()=>{
    console.log("[i] Redis Connected.")
})

redis.on("error", (e)=>{
    throw new Error(`[e] Redis error: ${e}`)
})