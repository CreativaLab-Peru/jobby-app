"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { syncPlanToPaddle } from "@/features/billing/actions/admin/sync-plan-to-paddle";
import { Prisma } from "@prisma/client";

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
  manageCvsCredits?: number;
  aiAnalysisCredits?: number;
  opportunitiesCredits?: number;
  features?: Prisma.InputJsonObject | null;
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

    const data: Prisma.PaymentPlanUpdateInput = {};

    if (input.name !== undefined) data.name = input.name.trim();
    if (input.slug !== undefined) data.slug = input.slug.trim();
    if (input.description !== undefined) data.description = input.description?.trim() || null;
    if (input.priceCentsPEN !== undefined) data.priceCentsPEN = input.priceCentsPEN || 0;
    if (input.priceCentsUSD !== undefined) data.priceCentsUSD = input.priceCentsUSD || 0;
    if (input.paddleProductId !== undefined) data.paddleProductId = input.paddleProductId || null;
    if (input.paddlePriceIdUSD !== undefined) data.paddlePriceIdUSD = input.paddlePriceIdUSD || null;
    if (input.manageCvsCredits !== undefined) data.manualCvLimit = input.manageCvsCredits;
    data.uploadCvLimit = 0;
    if (input.features !== undefined) {
      data.features = input.features ?? Prisma.JsonNull;
    }

    const updatedPlan = await prisma.$transaction(async (tx) => {
      const plan = await tx.paymentPlan.update({
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

      const packageCode = plan.slug.toUpperCase();

      const packageDefinitions = [
        {
          type: "MANAGE_CVS" as const,
          name: `${plan.name} MANAGE CVS`,
          credits: input.manageCvsCredits,
        },
        {
          type: "AI_ACTIONS" as const,
          name: `${plan.name} AI ACTIONS`,
          credits: input.aiAnalysisCredits,
        },
        {
          type: "SEARCH_OPPORTUNITIES" as const,
          name: `${plan.name} OPPORTUNITIES`,
          credits: input.opportunitiesCredits,
        },
      ];

      for (const packageDefinition of packageDefinitions) {
        if (packageDefinition.credits === undefined) continue;

        const updatedCount = await tx.creditPackage.updateMany({
          where: {
            planId: plan.id,
            type: packageDefinition.type,
          },
          data: {
            code: packageCode,
            name: packageDefinition.name,
            credits: packageDefinition.credits,
            active: true,
            priceCents: 0,
            currency: "USD",
          },
        });

        if (updatedCount.count === 0) {
          await tx.creditPackage.create({
            data: {
              planId: plan.id,
              type: packageDefinition.type,
              code: packageCode,
              name: packageDefinition.name,
              credits: packageDefinition.credits,
              active: true,
              priceCents: 0,
              currency: "USD",
            },
          });
        }
      }

      return plan;
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

