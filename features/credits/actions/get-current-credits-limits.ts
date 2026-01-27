"use server"

import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";
import {CreditBalanceType} from "@prisma/client";

export type CreditLimits = {
  manageCvsLimit: number;
  aiActionsLimit: number;
};

export const getCurrentCreditLimits = async (): Promise<CreditLimits> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User not found");

    const manageCvsLimit = await prisma.userCreditBalance.findFirst({
      where: {
        userId: currentUser.id,
        type: CreditBalanceType.MANAGE_CVS
      }
    })
    const aiActionsLimit = await prisma.userCreditBalance.findFirst({
      where: {
        userId: currentUser.id,
        type: CreditBalanceType.AI_ACTIONS
      }
    })

    return {
      manageCvsLimit: manageCvsLimit?.amount || 0,
      aiActionsLimit: aiActionsLimit?.amount || 0,
    };

  } catch (e){
    console.error("[ERROR_CREATE_BASIC_CREDITS]", e);
    return {
      manageCvsLimit: 0,
      aiActionsLimit: 0,
    };
  }
}
