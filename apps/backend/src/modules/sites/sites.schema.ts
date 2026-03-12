import { z } from "zod";
import { GenerationTier } from "../../generated/prisma/client";

const subdomainField = z
  .string()
  .regex(/^[a-z0-9-]+$/, "Subdomain can only contain lowercase letters, numbers and hyphens")
  .min(3)
  .max(40)
  .optional();

export const generateSiteSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  tier: z.nativeEnum(GenerationTier).default(GenerationTier.STANDARD),
  requestedSubdomain: subdomainField,
});

export const regenerateSiteSchema = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters"),
  tier: z.nativeEnum(GenerationTier).default(GenerationTier.STANDARD),
});

export type GenerateSiteInput = z.infer<typeof generateSiteSchema>;
export type RegenerateSiteInput = z.infer<typeof regenerateSiteSchema>;