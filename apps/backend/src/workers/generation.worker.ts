import { Worker, Job } from "bullmq";
import { openai } from "../lib/openai";
import { redisConnection } from "../lib/queue";
import { siteRepository } from "../repositories/site.repository";
import { authRepository } from "../repositories/auth.repository";
import { generationRepository } from "../repositories/generation.repository";
import { resolveSubdomain } from "../utils/subdomain";
import { writeSiteFiles } from "../utils/nginx";
import { GenerationStatus, GenerationTier } from "../generated/prisma/client";
import { env } from "../config/env";

export interface GenerationJobData {
  generationId: string;
  siteId: string;
  userId: string;
  prompt: string;
  tier: GenerationTier;
  creditsUsed: number;
  requestedSubdomain?: string;
  existingSubdomain?: string;
}

const stripMarkdownFences = (raw: string): string => {
  return raw
    .replace(/^```[a-zA-Z]*\n?/m, "")
    .replace(/```$/m, "")
    .trim();
};

const validateHtml = (html: string): { valid: boolean; reason?: string } => {
  const start = html.trimStart().toLowerCase();
  const end = html.trimEnd().toLowerCase();

  if (!start.startsWith("<!doctype html") && !start.startsWith("<html")) {
    return { valid: false, reason: "Output does not start with valid HTML" };
  }
  if (!end.endsWith("</html>")) {
    return { valid: false, reason: "Output does not end with </html>" };
  }

  return { valid: true };
};

const generateHtml = async (prompt: string, model: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model,
    messages: [
      {
        role: "system",
        content: `You are an expert frontend developer specializing in beautiful, modern websites.

Your task is to generate a complete, single-file HTML website based on the user's description.

Rules you MUST follow:
- Return ONLY raw HTML. No markdown, no code fences, no backticks, no explanation whatsoever.
- Start your response with <!DOCTYPE html> and end with </html>. Nothing before or after.
- Use only inline CSS (inside <style> in <head>) and vanilla JS (inside <script> before </body>).
- Do NOT use any external libraries, CDNs, or frameworks.
- Make it visually impressive: modern design, smooth animations, good typography, coherent color palette.
- Fully responsive across mobile, tablet, and desktop.
- Content must be meaningful and relevant to the prompt — no lorem ipsum or placeholder text.`,
      },
      { role: "user", content: prompt },
    ],
  });

  return response.choices[0].message.content ?? "";
};

const generateSlug = async (prompt: string): Promise<string> => {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `Generate a short subdomain slug for a website based on the user's description.
- 2 to 4 words max, joined by hyphens
- Lowercase letters and hyphens only
- Return ONLY the slug, nothing else
Examples: "cool-portfolio", "dog-grooming-studio", "startup-landing"`,
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 20,
  });

  return response.choices[0].message.content?.trim() ?? "my-site";
};

export const startGenerationWorker = () => {
  const worker = new Worker<GenerationJobData>(
    "generation",
    async (job: Job<GenerationJobData>) => {
      const {
        generationId,
        siteId,
        userId,
        prompt,
        tier,
        creditsUsed,
        requestedSubdomain,
        existingSubdomain,
      } = job.data;

      console.log(`[worker] job ${job.id} started | generation: ${generationId}`);

      try {
        await generationRepository.updateStatus(generationId, GenerationStatus.GENERATING);
        console.log(`[worker] ${generationId} → GENERATING`);

        const model = tier === GenerationTier.PRO ? "gpt-4.1" : "gpt-4o-mini";

        const [rawHtml, aiSlug] = await Promise.all([
          generateHtml(prompt, model),
          existingSubdomain ? Promise.resolve("") : generateSlug(prompt),
        ]);

        const html = stripMarkdownFences(rawHtml);
        const validation = validateHtml(html);
        if (!validation.valid) throw new Error(validation.reason);

        let subdomain = existingSubdomain ?? (await resolveSubdomain(requestedSubdomain, aiSlug));

        if (!subdomain) {
          subdomain = siteId.slice(0, 8);
        }
        subdomain = subdomain.toLowerCase();

        const filePath = await writeSiteFiles(subdomain, html);

        if (!existingSubdomain) {
          await siteRepository.updateSubdomain(siteId, subdomain, filePath);
        }

        await generationRepository.updateStatus(generationId, GenerationStatus.READY);
        console.log(`[worker] ${generationId} → READY | ${subdomain}.${env.APP_DOMAIN}`);
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : "Unknown error";

        await generationRepository.updateStatus(generationId, GenerationStatus.FAILED, errorMsg);
        await authRepository.incrementCredits(userId, creditsUsed);

        console.error(`[worker] ${generationId} → FAILED | ${errorMsg} | refunded ${creditsUsed} credits`);
      }
    },
    { connection: redisConnection }
  );

  worker.on("failed", (job, err) => {
    console.error(`[worker] job ${job?.id} permanently failed:`, err.message);
  });

  console.log("[worker] generation worker ready");
  return worker;
};