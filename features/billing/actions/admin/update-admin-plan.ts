"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { syncPlanToPaddle } from "@/features/billing/actions/admin/sync-plan-to-paddle";

export type UpdateAdminPlanResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminPlanInput {
  name?: string;
  slug?: string;
  description?: string | null;
  priceCentsPEN?: number;
  priceCentsUSD?: number;
  paddleProductId?: string | null;
  paddlePriceIdUSD?: string | null;
  manualCvLimit?: number;
  uploadCvLimit?: number;
  features?: Record<string, unknown> | null;
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
    if (input.priceCentsPEN !== undefined) data.priceCentsPEN = input.priceCentsPEN || 0;
    if (input.priceCentsUSD !== undefined) data.priceCentsUSD = input.priceCentsUSD || 0;
    if (input.paddleProductId !== undefined) data.paddleProductId = input.paddleProductId || null;
    if (input.paddlePriceIdUSD !== undefined) data.paddlePriceIdUSD = input.paddlePriceIdUSD || null;
    if (input.manualCvLimit !== undefined) data.manualCvLimit = input.manualCvLimit;
    if (input.uploadCvLimit !== undefined) data.uploadCvLimit = input.uploadCvLimit;
    if (input.features !== undefined) data.features = input.features ?? null;

    const updatedPlan = await prisma.paymentPlan.update({
      where: { id: planId },
      data,
      select: {
        id: true,
        slug: true,
        name: true,
        description: true,
        priceCentsUSD: true,
        paddleProductId: true,
        paddlePriceIdUSD: true,
      },
    });

    const shouldSyncPaddle =
      Number(updatedPlan.priceCentsUSD) > 0 &&
      (input.priceCentsUSD !== undefined || !updatedPlan.paddlePriceIdUSD);

    let message = "Plan actualizado exitosamente";
    if (shouldSyncPaddle) {
      try {
        await syncPlanToPaddle({
          planId: updatedPlan.id,
          slug: updatedPlan.slug,
          name: updatedPlan.name,
          description: updatedPlan.description,
          priceCentsUSD: Number(updatedPlan.priceCentsUSD),
          paddleProductId: updatedPlan.paddleProductId,
        });
      } catch (error) {
        console.error("[ADMIN_UPDATE_PLAN_PADDLE_SYNC_ERROR]", error);
        message = "Plan actualizado, pero no se pudo sincronizar el precio en Paddle";
      }
    }

    revalidatePath("/admin/plans");
    revalidatePath(`/admin/plans/${planId}`);

    return { success: true, message };
  } catch (error) {
    console.error("[ADMIN_UPDATE_PLAN_ERROR]", error);
    return { success: false, error: "Error actualizando plan" };
  }
};

