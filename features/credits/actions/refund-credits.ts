/**
 * DEVOLUCIÓN (REFUND)
 * Crítico si la API de IA falla tras haber cobrado.
 */
export const refundCredits = async (userId: string, amount: number, reason: string) => {

  // TODO: Implementar la lógica de reembolso
  // const body: RechargeCreditsBody = {
  //   userId,
  //   amount,
  //   description: `REFUND: ${reason}`,
  //   type: "", // Asumimos que el reembolso es al balance principal
  // }
  // return await rechargeCredits(userId, amount, `REFUND: ${reason}`, { reason });

  return null;
};
