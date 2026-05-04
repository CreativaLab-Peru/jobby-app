"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Company } from "@prisma/client";

export type AdminCompanyItem = Pick<
  Company,
  "id" | "name" | "slug" | "isActive" | "onboardingStep" | "createdAt" | "updatedAt"
> & {
  _count: {
    members: number;
    invitations: number;
  };
};

export type AdminCompaniesResult =
  | {
      success: true;
      data: {
        companies: AdminCompanyItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export const getAdminCompanies = async (
  skip = 0,
  take = 10,
): Promise<AdminCompaniesResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const [companies, totalCount] = await Promise.all([
      prisma.company.findMany({
        skip,
        take,
        select: {
          id: true,
          name: true,
          slug: true,
          isActive: true,
          onboardingStep: true,
          createdAt: true,
          updatedAt: true,
          _count: {
            select: {
              members: true,
              invitations: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.company.count(),
    ]);

    return {
      success: true,
      data: {
        companies,
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_COMPANIES_ERROR]", error);
    return { success: false, error: "Error obteniendo empresas" };
  }
};

