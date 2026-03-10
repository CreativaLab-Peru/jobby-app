"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { revalidatePath } from "next/cache";
import { CreditBalanceType } from "@prisma/client";

export type UpdateAdminCreditPackageResult =
  | { success: true; message: string }
  | { success: false; error: string };

export interface UpdateAdminCreditPackageInput {
  code?: string;
  name?: string;
  credits?: number;
  priceCents?: number;
  currency?: string;
  active?: boolean;
  type?: CreditBalanceType;
  planId?: string | null;
}

export const updateAdminCreditPackage = async (
  packageId: string,
  input: UpdateAdminCreditPackageInput
): Promise<UpdateAdminCreditPackageResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const existing = await prisma.creditPackage.findUnique({
      where: { id: packageId },
      select: { id: true },
    });

    if (!existing) {
      return { success: false, error: "Paquete no encontrado" };
    }

    const data: Record<string, unknown> = {};

    if (input.code !== undefined) data.code = input.code.trim();
    if (input.name !== undefined) data.name = input.name.trim();
    if (input.credits !== undefined) data.credits = input.credits;
    if (input.priceCents !== undefined) data.priceCents = input.priceCents;
    if (input.currency !== undefined) data.currency = input.currency;
    if (input.active !== undefined) data.active = input.active;
    if (input.type !== undefined) data.type = input.type;
    if ("planId" in input) data.planId = input.planId ?? null;

    await prisma.creditPackage.update({
      where: { id: packageId },
      data,
    });

    revalidatePath("/admin/credit-packages");
    revalidatePath(`/admin/credit-packages/${packageId}`);

    return { success: true, message: "Paquete actualizado exitosamente" };
  } catch (error) {
    console.error("[ADMIN_UPDATE_CREDIT_PACKAGE_ERROR]", error);
    return { success: false, error: "Error actualizando paquete" };
  }
};

