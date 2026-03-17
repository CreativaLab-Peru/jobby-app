"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { Prisma } from "@prisma/client";
import { syncPlanToPaddle } from "@/features/billing/actions/admin/sync-plan-to-paddle";

export type CreateAdminPlanResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

export interface CreateAdminPlanInput {
  slug: string;
  name: string;
  description?: string | null;
  priceCentsPEN: number;
  priceCentsUSD: number;
  manageCvsCredits: number;
  aiAnalysisCredits: number;
  opportunitiesCredits: number;
  features?: unknown;
}

export const createAdminPlan = async (
  input: CreateAdminPlanInput
): Promise<CreateAdminPlanResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    if (!input.slug.trim() || !input.name.trim()) {
      return { success: false, error: "Slug y nombre son requeridos." };
    }

    // Check slug uniqueness
    const existing = await prisma.paymentPlan.findUnique({
      where: { slug: input.slug.trim() },
      select: { id: true },
    });

    if (existing) {
      return { success: false, error: `Ya existe un plan con el slug "${input.slug}".` };
    }

    const plan = await prisma.paymentPlan.create({
      data: {
        slug: input.slug.trim(),
        name: input.name.trim(),
        description: input.description?.trim() || null,
        paymentType: "ONE_TIME",
        priceCentsPEN: input.priceCentsPEN,
        priceCentsUSD: input.priceCentsUSD,
        manualCvLimit: input.manageCvsCredits,
        uploadCvLimit: 0,
        features: (input.features as Prisma.InputJsonValue) ?? null,
      },
    });

    const packageCode = input.slug.trim().toUpperCase();

    await prisma.creditPackage.createMany({
      data: [
        {
          code: packageCode,
          name: `${input.name.trim()} MANAGE CVS`,
          credits: input.manageCvsCredits,
          priceCents: 0,
          currency: "USD",
          active: true,
          type: "MANAGE_CVS",
          planId: plan.id,
        },
        {
          code: packageCode,
          name: `${input.name.trim()} AI ACTIONS`,
          credits: input.aiAnalysisCredits,
          priceCents: 0,
          currency: "USD",
          active: true,
          type: "AI_ACTIONS",
          planId: plan.id,
        },
        {
          code: packageCode,
          name: `${input.name.trim()} OPPORTUNITIES`,
          credits: input.opportunitiesCredits,
          priceCents: 0,
          currency: "USD",
          active: true,
          type: "SEARCH_OPPORTUNITIES",
          planId: plan.id,
        },
      ],
    });

    let message = "Plan creado exitosamente";
    try {
      await syncPlanToPaddle({
        planId: plan.id,
        slug: plan.slug,
        name: plan.name,
        description: plan.description,
        priceCentsUSD: Number(plan.priceCentsUSD),
        paddleProductId: plan.paddleProductId,
      });
    } catch (error) {
      console.error("[ADMIN_CREATE_PLAN_PADDLE_SYNC_ERROR]", error);
      message = "Plan creado, pero no se pudo sincronizar el precio en Paddle";
    }

    revalidatePath("/admin/plans");

    return { success: true, data: { id: plan.id }, message };
  } catch (error) {
    console.error("[ADMIN_CREATE_PLAN_ERROR]", error);
    return { success: false, error: "Error creando plan" };
  }
};

