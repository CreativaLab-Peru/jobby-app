"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { PaymentType } from "@prisma/client";

export type UpdateAdminPlanResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminPlanInput {
  name?: string;
  slug?: string;
  description?: string | null;
  paymentType?: PaymentType;
  priceCents?: number;
  currency?: string;
  manualCvLimit?: number;
  uploadCvLimit?: number;
  features?: unknown;
}

export const updateAdminPlan = async (
  planId: string,
  input: UpdateAdminPlanInput
): Promise<UpdateAdminPlanResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.paymentPlan.findUnique({
      where: { id: planId },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: "Plan no encontrado" };
    }

    // Check slug uniqueness if changing
    if (input.slug && input.slug.trim() !== existing.slug) {
      const slugTaken = await prisma.paymentPlan.findUnique({
        where: { slug: input.slug.trim() },
        select: { id: true },
      });
      if (slugTaken) {
        return { success: false, error: `Ya existe un plan con el slug "${input.slug}".` };
      }
    }

    const data: Record<string, unknown> = {};

    if (input.name !== undefined) data.name = input.name.trim();
    if (input.slug !== undefined) data.slug = input.slug.trim();
    if (input.description !== undefined) data.description = input.description?.trim() || null;
    if (input.paymentType !== undefined) data.paymentType = input.paymentType;
    if (input.priceCents !== undefined) data.priceCents = input.priceCents;
    if (input.currency !== undefined) data.currency = input.currency;
    if (input.manualCvLimit !== undefined) data.manualCvLimit = input.manualCvLimit;
    if (input.uploadCvLimit !== undefined) data.uploadCvLimit = input.uploadCvLimit;
    if (input.features !== undefined) data.features = input.features ?? null;

    await prisma.paymentPlan.update({
      where: { id: planId },
      data,
    });

    revalidatePath("/admin/plans");
    revalidatePath(`/admin/plans/${planId}`);

    return { success: true, message: "Plan actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_PLAN_ERROR]", error);
    return { success: false, error: "Error actualizando plan" };
  }
};

