"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, CvSection, User } from "@prisma/client";

export type AdminCvWithSections = Cv & {
  sections: CvSection[];
  user: Pick<User, "id" | "email" | "name"> | null;
};

export type AdminCvByIdResult =
  | { success: true; data: AdminCvWithSections }
  | { success: false; error: string };

export const getAdminCvById = async (cvId: string): Promise<AdminCvByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return admin;
    }

    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      include: {
        sections: { orderBy: { order: "asc" } },
        user: { select: { id: true, email: true, name: true } },
      },
    });

    if (!cv) {
      return { success: false, error: "CV no encontrado" };
    }

    return { success: true, data: cv };
  } catch (error) {
    console.error("[ADMIN_GET_CV_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo CV" };
  }
};

