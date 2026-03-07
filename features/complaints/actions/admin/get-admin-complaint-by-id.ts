"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Complaint, User } from "@prisma/client";

export type AdminComplaintDetail = Complaint & {
  user: Pick<User, "id" | "email" | "name" | "image" | "role" | "createdAt" | "isBlocked">;
};

export type AdminComplaintByIdResult =
  | { success: true; data: AdminComplaintDetail }
  | { success: false; error: string };

export const getAdminComplaintById = async (
  complaintId: string
): Promise<AdminComplaintByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const complaint = await prisma.complaint.findUnique({
      where: { id: complaintId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            image: true,
            role: true,
            createdAt: true,
            isBlocked: true,
          },
        },
      },
    });

    if (!complaint) {
      return { success: false, error: "Reclamo no encontrado" };
    }

    return { success: true, data: complaint as AdminComplaintDetail };
  } catch (error) {
    console.error("[ADMIN_GET_COMPLAINT_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo reclamo" };
  }
};

