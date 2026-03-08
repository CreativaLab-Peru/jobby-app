"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { CreditPackage } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminCreditPackageItem = CreditPackage & {
  _count: { invoice: number };
};

export type AdminCreditPackageListResult =
  | {
      success: true;
      data: {
        packages: AdminCreditPackageItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminCreditPackagesOptions {
  query?: string;
  active?: "all" | "active" | "inactive" | null;
  type?: string | null;
  sortBy?: "createdAt" | "name" | "priceCents" | "credits";
  sortOrder?: "asc" | "desc";
}

export const getAdminCreditPackages = async (
  skip = 0,
  take = 10,
  options?: GetAdminCreditPackagesOptions
): Promise<AdminCreditPackageListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.CreditPackageWhereInput = {};

    if (options?.active === "active") {
      where.active = true;
    } else if (options?.active === "inactive") {
      where.active = false;
    }

    if (options?.type) {
      where.type = options.type as never;
    }

    if (options?.query) {
      where.OR = [
        { name: { contains: options.query, mode: "insensitive" } },
        { code: { contains: options.query, mode: "insensitive" } },
      ];
    }

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [packages, totalCount] = await Promise.all([
      prisma.creditPackage.findMany({
        where,
        skip,
        take,
        include: {
          _count: { select: { invoice: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.creditPackage.count({ where }),
    ]);

    return {
      success: true,
      data: {
        packages: packages as AdminCreditPackageItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_CREDIT_PACKAGES_ERROR]", error);
    return { success: false, error: "Error obteniendo paquetes de creditos" };
  }
};

