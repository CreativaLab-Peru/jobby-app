"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Company } from "@prisma/client";

export type AdminCompanyDetail = Pick<
  Company,
  "id" | "name" | "slug" | "logoUrl" | "ruc" | "website" | "primaryColor" | "isActive" | "onboardingStep" | "createdAt" | "updatedAt"
> & {
  _count: {
    members: number;
    invitations: number;
  };
};

export type GetAdminCompanyResult =
  | { success: true; data: AdminCompanyDetail }
  | { success: false; error: string };

export const getAdminCompanyById = async (
  companyId: string
): Promise<GetAdminCompanyResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        slug: true,
        logoUrl: true,
        ruc: true,
        website: true,
        primaryColor: true,
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
    });

    if (!company) {
      return { success: false, error: "Empresa no encontrada" };
    }

    return { success: true, data: company };
  } catch (error) {
    console.error("[ADMIN_GET_COMPANY_ERROR]", error);
    return { success: false, error: "Error obteniendo empresa" };
  }
};

