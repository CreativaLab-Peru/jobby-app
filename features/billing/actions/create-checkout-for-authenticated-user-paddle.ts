"use server"

import { prisma } from "@/lib/prisma";
import { paddle, BASE_URL } from "@/features/billing/domain/paddle-client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { syncPlanToPaddle } from "@/features/billing/actions/admin/sync-plan-to-paddle";

export const createCheckoutForAuthenticatedUserPaddle = async (slug: string) => {
  try {
    if (!BASE_URL) throw new Error("BASE_URL no definida en variables de entorno");

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, error: "No se ha encontrado el usuario" };
    }

    const paymentPlan = await prisma.paymentPlan.findFirst({
      where: { slug: slug.toLowerCase() },
    });
    if (!paymentPlan) {
      return { success: false, error: "No se ha encontrado el plan de pago" };
    }

    let priceId = paymentPlan.paddlePriceIdUSD;

    if (!priceId && Number(paymentPlan.priceCentsUSD) > 0) {
      const syncResult = await syncPlanToPaddle({
        planId: paymentPlan.id,
        slug: paymentPlan.slug,
        name: paymentPlan.name,
        description: paymentPlan.description,
        priceCentsUSD: Number(paymentPlan.priceCentsUSD),
        paddleProductId: paymentPlan.paddleProductId,
      });
      priceId = syncResult?.paddlePriceIdUSD ?? null;
    }

    if (!priceId) {
      return {
        success: false,
        error: `El plan de pago no tiene un precio de Paddle configurado. Por favor, contacta al soporte.`,
      };
    }

    let transaction;
    try {
      transaction = await paddle.transactions.create({
        items: [{ priceId, quantity: 1 }],
        customData: {
          user_id: currentUser.id,
          id: paymentPlan.id,
          type: paymentPlan.paymentType,
        },
      });
    } catch (error) {
      const paddleError = error as { code?: string };
      if (paddleError?.code === "transaction_price_not_found") {
        const syncResult = await syncPlanToPaddle({
          planId: paymentPlan.id,
          slug: paymentPlan.slug,
          name: paymentPlan.name,
          description: paymentPlan.description,
          priceCentsUSD: Number(paymentPlan.priceCentsUSD),
          paddleProductId: paymentPlan.paddleProductId,
        });

        if (!syncResult?.paddlePriceIdUSD) {
          return { success: false, error: "No se pudo sincronizar el precio del plan en Paddle" };
        }

        transaction = await paddle.transactions.create({
          items: [{ priceId: syncResult.paddlePriceIdUSD, quantity: 1 }],
          customData: {
            user_id: currentUser.id,
            id: paymentPlan.id,
            type: paymentPlan.paymentType,
          },
        });
      } else {
        throw error;
      }
    }

    if (!transaction?.id) {
      return { success: false, error: "No se pudo crear la transacción en Paddle" };
    }

    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.error("[ERROR_CREATE_CHECKOUT_PADDLE_AUTHENTICATED]", error);
    return { success: false, error: "Ha ocurrido un error al procesar tu solicitud" };
  }
};
