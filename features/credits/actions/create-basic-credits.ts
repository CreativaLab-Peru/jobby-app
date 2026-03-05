import {rechargeCredits, RechargeCreditsBody} from "@/features/credits/actions/recharge-credits";
import {CreditBalanceType} from "@prisma/client";

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
    const result = await rechargeCredits(bodyManageCvs);
    if (!result) throw new Error("Failed to create basic credits");

    const resultAI = await rechargeCredits(bodyAIActions);
    if (!resultAI) throw new Error("Failed to create basic AI action credits");

    return true;
  } catch (e){
    console.error("[ERROR_CREATE_BASIC_CREDITS]", e);
    return false;
  }
}
