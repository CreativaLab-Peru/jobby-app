"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { PaymentPlan, UserPayment, User } from "@prisma/client";

export type AdminPaymentDetail = UserPayment & {
  plan: PaymentPlan;
  user: Pick<User, "id" | "email" | "name" | "image" | "role" | "createdAt">;
};

export type AdminPaymentByIdResult =
  | { success: true; data: AdminPaymentDetail }
  | { success: false; error: string };

export const getAdminPaymentById = async (
  paymentId: string
): Promise<AdminPaymentByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const payment = await prisma.userPayment.findUnique({
      where: { id: paymentId },
      include: {
        plan: true,
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
          },
        },
      },
    });

    if (!payment) {
      return { success: false, error: "Pago no encontrado" };
    }

    const paymentParsed = JSON.parse(JSON.stringify(payment)) as AdminPaymentDetail;

    return {
      success: true,
      data: paymentParsed,
    };
  } catch (error) {
    console.error("[ADMIN_GET_PAYMENT_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo pago" };
  }
};

