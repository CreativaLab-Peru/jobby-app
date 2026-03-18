"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { CreditBalanceType } from "@prisma/client";

export type CreateAdminCreditPackageResult =
  | { success: true; data: { id: string }; message: string }
  | { success: false; error: string };

export interface CreateAdminCreditPackageInput {
  code: string;
  name: string;
  credits: number;
  priceCents?: number;
  currency?: string;
  active?: boolean;
  type: CreditBalanceType;
}

export const createAdminCreditPackage = async (
  input: CreateAdminCreditPackageInput
): Promise<CreateAdminCreditPackageResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    if (!input.code.trim() || !input.name.trim()) {
      return { success: false, error: "Codigo y nombre son requeridos." };
    }

    if (input.credits < 0) {
      return { success: false, error: "Los creditos deben ser mayores o iguales a 0." };
    }

    const pkg = await prisma.creditPackage.create({
      data: {
        code: input.code.trim(),
        name: input.name.trim(),
        credits: input.credits,
        priceCents: input.priceCents ?? 0,
        currency: input.currency || "USD",
        active: input.active ?? true,
        type: input.type,
      },
    });

    revalidatePath("/admin/credit-packages");

    return { success: true, data: { id: pkg.id }, message: "Paquete creado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_CREATE_CREDIT_PACKAGE_ERROR]", error);
    return { success: false, error: "Error creando paquete" };
  }
};

