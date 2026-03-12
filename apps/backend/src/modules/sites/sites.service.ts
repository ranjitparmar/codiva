import { siteRepository } from "../../repositories/site.repository";
import { authRepository } from "../../repositories/auth.repository";
import { generationQueue } from "../../lib/queue";
import { constants } from "../../config/constants";
import { GenerationTier } from "../../generated/prisma/client";
import { InsufficientCreditsError, NotFoundError, ConflictError } from "../../errors";
import type { GenerateSiteInput, RegenerateSiteInput } from "./sites.schema";
import { generationRepository } from "../../repositories/generation.repository";
import { env } from "../../config/env";
import { deleteSiteFiles } from "../../utils/nginx";

const getCreditCost = (tier: GenerationTier): number => {
  return tier === GenerationTier.PRO ? constants.CREDITS_PRO : constants.CREDITS_STANDARD;
};

export const sitesService = {
  generate: async (userId: string, input: GenerateSiteInput) => {
    const { prompt, tier, requestedSubdomain } = input;
    const creditsUsed = getCreditCost(tier);

    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    if (user.credits < creditsUsed) throw new InsufficientCreditsError();

    await authRepository.incrementCredits(userId, -creditsUsed);

    const site = await siteRepository.create(userId);
    const generation = await generationRepository.create(site.id, prompt, tier, creditsUsed, requestedSubdomain);


    await generationQueue.add("generate", {
      generationId: generation.id,
      siteId: site.id,
      userId,
      prompt,
      tier,
      creditsUsed,
      requestedSubdomain,
    });

    return { generationId: generation.id, siteId: site.id };
  },

  regenerate: async (userId: string, siteId: string, input: RegenerateSiteInput) => {
    const { prompt, tier } = input;
    const creditsUsed = getCreditCost(tier);

    const site = await siteRepository.findById(siteId);
    if (!site) throw new NotFoundError("Site not found");
    if (site.userId !== userId) throw new NotFoundError("Site not found");
    if (!site.subdomain) throw new ConflictError("Site has no active deployment to regenerate");

    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");
    if (user.credits < creditsUsed) throw new InsufficientCreditsError();

    await authRepository.incrementCredits(userId, -creditsUsed);

    const generation = await generationRepository.create(siteId, prompt, tier, creditsUsed);


    await generationQueue.add("generate", {
      generationId: generation.id,
      siteId,
      userId,
      prompt,
      tier,
      creditsUsed,
      existingSubdomain: site.subdomain,
    });

    return { generationId: generation.id, siteId };
  },

  getStatus: async (generationId: string, userId: string) => {
    const generation = await generationRepository.findById(generationId);
    if (!generation) throw new NotFoundError("Generation not found");
    if (generation.site.userId !== userId) throw new NotFoundError("Generation not found");

    return {
      status: generation.status,
      subdomain: generation.site.subdomain ?? null,
      url: generation.site.subdomain
        ? `https://${generation.site.subdomain}.${env.APP_DOMAIN}`
        : null,
      errorMsg: generation.errorMsg ?? null,
    };
  },

  getMySites: async (userId: string) => {
    return siteRepository.findByUserId(userId);
  },
  getSiteGenerations: async (userId: string, siteId: string) => {
    const site = await siteRepository.findById(siteId);
    if (!site) throw new NotFoundError("Site not found");
    if (site.userId !== userId) throw new NotFoundError("Site not found");

    return generationRepository.findBySiteId(siteId);
  },
  deleteSite: async (userId: string, siteId: string) => {
    const site = await siteRepository.findById(siteId);
    if (!site) throw new NotFoundError("Site not found");
    if (site.userId !== userId) throw new NotFoundError("Site not found");

    if (site.subdomain) {
      await deleteSiteFiles(site.subdomain);
    }

    await siteRepository.deleteById(siteId);
  },
};