"use server"

import { prisma } from "@/lib/prisma";
import { paddle, BASE_URL } from "@/features/billing/domain/paddle-client";

const PREFERENCE_PLAN = "starter";

function getPaddlePriceId(slug: string): string | null {
  const key = `PADDLE_PRICE_ID_${slug.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key] ?? null;
}

export const createCheckoutForNewUserPaddle = async (temporalUserId: string) => {
  try {
    if (!BASE_URL) throw new Error("BASE_URL no definida en variables de entorno");

    const temporalUser = await prisma.temporalUser.findFirst({
      where: { id: temporalUserId },
    });
    if (!temporalUser) {
      return { success: false, error: "No se ha encontrado el usuario temporal" };
    }

    const paymentPlan = await prisma.paymentPlan.findFirst({
      where: { slug: PREFERENCE_PLAN },
    });
    if (!paymentPlan) {
      return { success: false, error: "No se ha encontrado el plan de pago" };
    }

    const priceId = getPaddlePriceId(paymentPlan.slug);
    if (!priceId) {
      return {
        success: false,
        error: `PADDLE_PRICE_ID_${paymentPlan.slug.toUpperCase()} no está configurado`,
      };
    }

    const transaction = await paddle.transactions.create({
      items: [{ priceId, quantity: 1 }],
      customData: {
        id: paymentPlan.id,
        email: temporalUser.email,
        type: paymentPlan.paymentType,
      },
    });

    if (!transaction?.id) {
      return { success: false, error: "No se pudo crear la transacción en Paddle" };
    }

    return { success: true, transactionId: transaction.id, email: temporalUser.email };
  } catch (error) {
    console.error("[ERROR_CREATE_CHECKOUT_PADDLE_NEW_USER]", error);
    return { success: false, error: "Ha ocurrido un error al procesar tu solicitud" };
  }
};
