import prisma from "../lib/prisma";
import { constants } from "../config/constants";
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
    deductCredits: async (userId: string, amount: number) => {
        return prisma.user.update({
            where: { id: userId },
            data: { credits: { decrement: amount } },
        });
    },
    incrementCredits: async (id: string, amount: number) => {
        return prisma.user.update({
            where: { id },
            data: { credits: { increment: amount } },
        });
    },
    claimDailyCredit: async (id: string) => {
        return prisma.user.update({
            where: { id },
            data: {
                credits: { increment: constants.DAILY_CREDITS },
                lastCreditsClaimed: new Date(),
            },
        });
    },
    updatePassword: async (userId: string, passwordHash: string) => {
        return prisma.user.update({
            where: { id: userId },
            data: { passwordHash },
        });
    },
    deleteById: async (siteId: string) => {
        return prisma.site.delete({ where: { id: siteId } });
    },
}