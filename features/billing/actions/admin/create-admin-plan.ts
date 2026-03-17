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
  manualCvLimit: number;
  uploadCvLimit: number;
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
        manualCvLimit: input.manualCvLimit,
        uploadCvLimit: input.uploadCvLimit,
        features: (input.features as Prisma.InputJsonValue) ?? null,
      },
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

