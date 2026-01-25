import {rechargeCredits} from "@/features/credits/actions/recharge-credits";

/**
 * DEVOLUCIÓN (REFUND)
 * Crítico si la API de IA falla tras haber cobrado.
 */
export const refundCredits = async (userId: string, amount: number, reason: string) => {
  return await rechargeCredits(userId, amount, `REFUND: ${reason}`, { reason });
};
