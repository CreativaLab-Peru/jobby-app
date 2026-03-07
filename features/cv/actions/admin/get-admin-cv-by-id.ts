"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, CvEvaluation, CvSection, EvaluationScore, Recommendation, User } from "@prisma/client";

export type AdminCvWithSections = Cv & {
  sections: CvSection[];
  user: Pick<User, "id" | "email" | "name"> | null;
  evaluations: (CvEvaluation & {
    scores: EvaluationScore[];
    recommendations: Recommendation[];
  })[];
  _count: {
    previews: number;
    queueJobs: number;
    opportunities: number;
  };
};

export type AdminCvByIdResult =
  | { success: true; data: AdminCvWithSections }
  | { success: false; error: string };

export const getAdminCvById = async (cvId: string): Promise<AdminCvByIdResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver CVs." };
    }

    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      include: {
        sections: { orderBy: { order: "asc" } },
        user: { select: { id: true, email: true, name: true } },
        evaluations: {
          include: { scores: true, recommendations: true },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            previews: true,
            queueJobs: true,
            opportunities: true,
          },
        },
      },
    });

    if (!cv) {
      return { success: false, error: "CV no encontrado" };
    }

    return { success: true, data: cv as AdminCvWithSections };
  } catch (error) {
    console.error("[ADMIN_GET_CV_BY_ID_ERROR]", error);
    return { success: false, error: "Error obteniendo CV" };
  }
};
