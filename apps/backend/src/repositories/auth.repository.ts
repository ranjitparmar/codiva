import prisma from "../lib/prisma";

export const authRepository = {
    findByEmail: async (email: string) => {
        return await prisma.user.findUnique({ where: { email } })
    },
    findById: async (id: string) => {
        return await prisma.user.findUnique({ where: { id } })
    },
    create: async (email: string, passwordHash: string) => {
        return await prisma.user.create({ data: { email, passwordHash } })
    },
    markVerified: async (email: string) => {
        return await prisma.user.update({ where: { email }, data: { isVerified: true } })
    },
    findMeById: async (id: string) => {
        return await prisma.user.findUnique({
            where: { id },
            select: {
                id: true,
                email: true,
                isVerified: true,
                credits: true,
                lastCreditsClaimed: true,
                createdAt: true
            }
        })
    },
    deleteByEmail: async (email: string): Promise<void> => {
        await prisma.user.delete({ where: { email } });
    },
}