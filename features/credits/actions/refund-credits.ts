import {rechargeCredits, RechargeCreditsBody} from "@/features/credits/actions/recharge-credits";
import {CreditBalanceType} from "@prisma/client";

/**
 * DEVOLUCIÓN (REFUND)
 * Crítico si la API de IA falla tras haber cobrado.
 */
export const refundCredits = async (
  userId: string,
  amount: number,
  reason: string,
  type: CreditBalanceType
) => {

  const body: RechargeCreditsBody = {
    userId,
    amount,
    description: `REFUND: ${reason}`,
    type,
  }
  return await rechargeCredits(body);
};
