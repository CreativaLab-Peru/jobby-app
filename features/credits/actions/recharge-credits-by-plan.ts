import {prisma} from "@/lib/prisma";
import {rechargeCredits} from "@/features/credits/actions/recharge-credits";
import {logsService} from "@/features/share/services/logs-service";
import {LogAction, LogLevel} from "@prisma/client";

/**
 * RECARGA DE CRÉDITOS POR PLAN DE PAGO
 * Se usa tras un pago exitoso (Mercado pago u otros)
 */
export const rechargeCreditsByPlan = async (paymentPlanId: string, userId: string) => {
  try {
    const paymentPlan = await prisma.paymentPlan.findUnique({
      where: {id: paymentPlanId},
    });
    if (!paymentPlan) {
      throw new Error("Payment plan not found");
    }

    const code = paymentPlan.slug.toUpperCase();
    if (!code) {
      throw new Error("Payment plan code not found");
    }

    const creditsPackage = await prisma.creditPackage.findMany({
      where: {
        code,
      }
    })

    if (!creditsPackage || creditsPackage.length === 0) {
      throw new Error("Credits package not found for the given plan code");
    }

    // Usamos $transaction para que sea "todo o nada"
    await prisma.$transaction(async (tx) => {
      const paymentPlan = await tx.paymentPlan.findUnique({
        where: { id: paymentPlanId },
      });

      if (!paymentPlan) throw new Error("PLAN_NOT_FOUND");

      const code = paymentPlan.slug.toUpperCase();
      const creditsPackage = await tx.creditPackage.findMany({
        where: { code }
      });

      if (!creditsPackage.length) throw new Error("PACKAGES_NOT_FOUND");

      for (const creditPackage of creditsPackage) {
        await rechargeCredits({
          userId,
          amount: creditPackage.credits,
          description: `Recarga por plan ${paymentPlan.name}`,
          type: creditPackage.type as any,
          metadata: { paymentPlanId }
        }, tx);
      }
    });
  } catch (error) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "MERCADO_PAGO_INTEGRATION",
      entityId: paymentPlanId,
      message: `Started rechargeCreditsByPlan info of payment: ${paymentPlanId}`,
      metadata: {paymentId: paymentPlanId, userId},
    });
    console.error("[ERROR_RECHARGE_CREDITS_BY_PLAN]", error);
    throw error;
  }
};
