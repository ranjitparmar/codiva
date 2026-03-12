import { authRepository } from "../../repositories/auth.repository";
import { constants } from "../../config/constants";
import { NotFoundError, ValidationError } from "../../errors";

export const creditsService = {
  claim: async (userId: string) => {
    const user = await authRepository.findById(userId);
    if (!user) throw new NotFoundError("User not found");

    if (user.lastCreditsClaimed) {
      const hoursSinceClaim =
        (Date.now() - new Date(user.lastCreditsClaimed).getTime()) / (1000 * 60 * 60);

      if (hoursSinceClaim < 24) {
        const hoursLeft = Math.ceil(24 - hoursSinceClaim);
        throw new ValidationError(`Come back in ${hoursLeft} hour${hoursLeft === 1 ? "" : "s"} to claim your next credit`);
      }
    }

    await authRepository.claimDailyCredit(userId);
    return { credited: constants.DAILY_CREDITS, message: "Daily credit claimed successfully" };
  },
};