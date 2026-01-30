"use server"

import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";
import {CreditBalanceType} from "@prisma/client";

export type CreditLimits = {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
};

export const getCurrentCreditLimits = async (): Promise<CreditLimits> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const [manageCvsLimit, aiActionsLimit, opportunitiesActionsLimit] = await Promise.all([
      prisma.userCreditBalance.findFirst({
        where: {
          userId: currentUser.id,
          type: CreditBalanceType.MANAGE_CVS
        }
      }),
      prisma.userCreditBalance.findFirst({
        where: {
          userId: currentUser.id,
          type: CreditBalanceType.AI_ACTIONS
        }
      }),
      prisma.userCreditBalance.findFirst({
        where: {
          userId: currentUser.id,
          type: CreditBalanceType.SEARCH_OPPORTUNITIES
        }
      })
    ]);

    return {
      manageCvsLimit: manageCvsLimit?.amount || 0,
      aiActionsLimit: aiActionsLimit?.amount || 0,
      opportunitiesActionsLimit: opportunitiesActionsLimit?.amount || 0,
    };

  } catch (e){
    console.error("[ERROR_CREATE_BASIC_CREDITS]", e);
    return {
      manageCvsLimit: 0,
      aiActionsLimit: 0,
      opportunitiesActionsLimit: 0,
    };
  }
}
