import z from "zod";
import dotenv from "dotenv";

// load env
dotenv.config();

// env schema
const envSchema = z.object({
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
    PORT: z.string().default("3000"),
    DATABASE_URL: z.string().min(1),
    RESEND_API_KEY: z.string().min(1),
    REDIS_URL: z.string().min(1),
    JWT_SECRET: z.string().min(8)
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success){
    console.error("[e] Invalid environment variables.");
    console.error(parsed.error.flatten().fieldErrors);
    process.exit(1);
}

// export env on success
export const env = parsed.data;