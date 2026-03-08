"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { User } from "@prisma/client";

export type AdminUserDetail = User & {
  _count: {
    cvs: number;
    payments: number;
    sessions: number;
    complaints: number;
  };
};

export type AdminUserDetailResult =
  | { success: true; data: AdminUserDetail }
  | { success: false; error: string };

export const getAdminUserById = async (
  userId: string
): Promise<AdminUserDetailResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        _count: {
          select: {
            cvs: true,
            payments: true,
            sessions: true,
            complaints: true,
          },
        },
      },
    });

    if (!user) {
      return { success: false, error: "Usuario no encontrado" };
    }

    return { success: true, data: user };
  } catch (error) {
    console.error("[ADMIN_GET_USER_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo usuario" };
  }
};

