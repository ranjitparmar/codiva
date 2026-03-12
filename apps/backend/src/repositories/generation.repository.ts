import prisma from "../lib/prisma";
import { GenerationStatus, GenerationTier } from "../generated/prisma/client";

export const generationRepository = {
  create: async (
    siteId: string,
    prompt: string,
    tier: GenerationTier,
    creditsUsed: number,
    requestedSubdomain?: string
  ) => {
    return prisma.generation.create({
      data: {
        siteId,
        prompt,
        tier,
        creditsUsed,
        requestedSubdomain,
        status: GenerationStatus.PENDING,
      },
    });
  },

  findById: async (id: string) => {
    return prisma.generation.findUnique({
      where: { id },
      include: { site: true },
    });
  },

  findBySiteId: async (siteId: string) => {
    return prisma.generation.findMany({
      where: { siteId },
      orderBy: { createdAt: "desc" },
    });
  },

  updateStatus: async (
    id: string,
    status: GenerationStatus,
    errorMsg?: string
  ) => {
    return prisma.generation.update({
      where: { id },
      data: { status, ...(errorMsg && { errorMsg }) },
    });
  },
  
};