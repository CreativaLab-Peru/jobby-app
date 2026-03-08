"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { CreditPackage, Invoice, User } from "@prisma/client";

export type AdminCreditPackageDetail = CreditPackage & {
  invoice: (Pick<Invoice, "id" | "userId" | "amountTotal" | "currency" | "status" | "provider" | "createdAt"> & {
    user: Pick<User, "id" | "email" | "name">;
  })[];
  _count: { invoice: number };
};

export type AdminCreditPackageByIdResult =
  | { success: true; data: AdminCreditPackageDetail }
  | { success: false; error: string };

export const getAdminCreditPackageById = async (
  packageId: string
): Promise<AdminCreditPackageByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const pkg = await prisma.creditPackage.findUnique({
      where: { id: packageId },
      include: {
        invoice: {
          select: {
            id: true,
            userId: true,
            amountTotal: true,
            currency: true,
            status: true,
            provider: true,
            createdAt: true,
            user: { select: { id: true, email: true, name: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 20,
        },
        _count: { select: { invoice: true } },
      },
    });

    if (!pkg) {
      return { success: false, error: "Paquete no encontrado" };
    }

    return { success: true, data: pkg as AdminCreditPackageDetail };
  } catch (error) {
    console.error("[ADMIN_GET_CREDIT_PACKAGE_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo paquete" };
  }
};

