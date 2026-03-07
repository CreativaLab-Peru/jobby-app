"use server"

import { prisma } from "@/lib/prisma";
import { paddle, BASE_URL } from "@/features/billing/domain/paddle-client";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

function getPaddlePriceId(slug: string): string | null {
  const key = `PADDLE_PRICE_ID_${slug.toUpperCase().replace(/-/g, "_")}`;
  return process.env[key] ?? null;
}

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
        user_id: currentUser.id,
        id: paymentPlan.id,
        type: paymentPlan.paymentType,
      },
    });

    if (!transaction?.id) {
      return { success: false, error: "No se pudo crear la transacción en Paddle" };
    }

    return { success: true, transactionId: transaction.id };
  } catch (error) {
    console.error("[ERROR_CREATE_CHECKOUT_PADDLE_AUTHENTICATED]", error);
    return { success: false, error: "Ha ocurrido un error al procesar tu solicitud" };
  }
};
