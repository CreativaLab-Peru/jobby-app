import { rechargeCredits, RechargeCreditsBody } from "@/features/credits/actions/recharge-credits";
import { CreditBalanceType, Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ONBOARDING_CREDITS_DESCRIPTION = "Créditos básicos iniciales al registrarse";
const ONBOARDING_CREDITS_SOURCE = "onboarding_free_grant";

export const createBasicCredits = async (
  userId: string,
  tx?: Prisma.TransactionClient,
): Promise<boolean> => {
  if (!userId) throw new Error("User ID is required");

  const metadata: Prisma.InputJsonValue = {
    source: ONBOARDING_CREDITS_SOURCE,
    version: 1,
  };

  try {
    const execute = async (client: Prisma.TransactionClient) => {
      const creditTypes = [
        CreditBalanceType.MANAGE_CVS,
        CreditBalanceType.AI_ACTIONS,
        CreditBalanceType.SEARCH_OPPORTUNITIES,
      ];

      for (const type of creditTypes) {
        const body: RechargeCreditsBody = {
          userId,
          amount: 1,
          description: ONBOARDING_CREDITS_DESCRIPTION,
          type,
          metadata,
          transactionType: TransactionType.BONUS,
        };
        await rechargeCredits(body, client);
      }
    };

    if (tx) {
      await execute(tx);
    } else {
      await prisma.$transaction(execute);
    }

    return true;
  } catch (error) {
    console.error("[ERROR_CREATE_BASIC_CREDITS]", error);
    return false;
  }
};