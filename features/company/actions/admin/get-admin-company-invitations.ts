"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { InvitationStatus, CompanyRole } from "@prisma/client";

export interface AdminInvitationItem {
  id: string;
  email: string;
  role: CompanyRole;
  status: InvitationStatus;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export type AdminCompanyInvitationsResult =
  | {
  success: true;
  data: {
    companyId: string;
    companyName: string;
    companySlug: string;
    invitations: AdminInvitationItem[];
    totalCount: number;
  };
}
  | { success: false; error: string };

export const getAdminCompanyInvitations = async (
  companyId: string,
  skip = 0,
  take = 10
): Promise<AdminCompanyInvitationsResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    // Buscamos la empresa y sus invitaciones paginadas
    const company = await prisma.company.findUnique({
      where: { id: companyId },
      select: {
        id: true,
        name: true,
        slug: true,
        invitations: {
          skip,
          take,
          orderBy: { createdAt: "desc" },
          select: {
            id: true,
            email: true,
            role: true,
            status: true,
            token: true,
            expiresAt: true,
            createdAt: true,
          },
        },
        _count: {
          select: { invitations: true }
        }
      },
    });

    if (!company) {
      return { success: false, error: "Empresa no encontrada" };
    }

    return {
      success: true,
      data: {
        companyId: company.id,
        companyName: company.name,
        companySlug: company.slug,
        invitations: company.invitations,
        totalCount: company._count.invitations,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_INVITATIONS_ERROR]", error);
    return { success: false, error: "Error al obtener las invitaciones" };
  }
};
