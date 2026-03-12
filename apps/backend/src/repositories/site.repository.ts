import prisma from "../lib/prisma";

export const siteRepository = {
  create: async (userId: string) => {
    return prisma.site.create({
      data: { userId },
    });
  },

  findById: async (id: string) => {
    return prisma.site.findUnique({ where: { id } });
  },

  findBySubdomain: async (subdomain: string) => {
    return prisma.site.findUnique({ where: { subdomain } });
  },

  findByUserId: async (userId: string) => {
    return prisma.site.findMany({
      where: { userId },
      include: {
        generations: {
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
      orderBy: { createdAt: "desc" },
    });
  },

  updateSubdomain: async (id: string, subdomain: string, filePath: string) => {
    return prisma.site.update({
      where: { id },
      data: { subdomain, filePath },
    });
  },
    deleteById: async (id: string) => {
    return prisma.site.delete({ where: { id } });
  },
};