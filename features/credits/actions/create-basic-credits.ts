import {rechargeCredits, RechargeCreditsBody} from "@/features/credits/actions/recharge-credits";
import {CreditBalanceType} from "@prisma/client";
import {prisma} from "@/lib/prisma";

export const createBasicCredits = async (userId: string) => {
  try {
    if (!userId) throw new Error("User ID is required");

    const bodyManageCvs: RechargeCreditsBody = {
      userId,
      amount: 1,
      description: "Créditos básicos iniciales al registrarse",
      type: CreditBalanceType.MANAGE_CVS
    }

    const bodyAIActions: RechargeCreditsBody = {
      userId,
      amount: 1,
      description: "Créditos básicos iniciales al registrarse",
      type: CreditBalanceType.AI_ACTIONS
    }

    const bodyOpp: RechargeCreditsBody = {
      userId,
      amount: 1,
      description: "Créditos básicos iniciales al registrarse",
      type: CreditBalanceType.SEARCH_OPPORTUNITIES
    }

    prisma.$transaction(async (tx) => {
      await rechargeCredits(bodyManageCvs, tx);
      await rechargeCredits(bodyAIActions, tx);
      await rechargeCredits(bodyOpp, tx);
    })

    return true;
  } catch (e){
    console.error("[ERROR_CREATE_BASIC_CREDITS]", e);
    return false;
  }
}
