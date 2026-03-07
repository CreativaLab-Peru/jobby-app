"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, CvEvaluation, CvPreview, CvSection, EvaluationScore, Recommendation, QueueJob, User } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminCvWithRelations = Cv & {
  evaluations: (CvEvaluation & {
    scores: EvaluationScore[];
    recommendations: Recommendation[];
  })[];
  sections: CvSection[];
  previews: CvPreview[];
  queueJobs: QueueJob[];
  user: Pick<User, "id" | "email" | "name"> | null;
};

export type AdminCvListResult =
  | {
      success: true;
      data: {
        cvs: AdminCvWithRelations[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export const getAdminCvs = async (
  skip = 0,
  take = 10,
  options?: { includeDeleted?: boolean; query?: string }
): Promise<AdminCvListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return admin;
    }

    const where: Prisma.CvWhereInput = {};

    if (!options?.includeDeleted) {
      where.deletedAt = null;
    }

    if (options?.query) {
      where.OR = [
        { title: { contains: options.query, mode: "insensitive" } },
        { user: { email: { contains: options.query, mode: "insensitive" } } },
        { user: { name: { contains: options.query, mode: "insensitive" } } },
      ];
    }

    const cvs = await prisma.cv.findMany({
      where,
      skip,
      take,
      include: {
        user: { select: { id: true, email: true, name: true } },
        evaluations: {
          include: { scores: true, recommendations: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
        sections: { orderBy: { order: "asc" } },
        previews: { orderBy: { createdAt: "desc" }, take: 1 },
        queueJobs: { orderBy: { createdAt: "desc" }, take: 1 },
      },
      orderBy: { createdAt: "desc" },
    });

    const totalCount = await prisma.cv.count({ where });

    return {
      success: true,
      data: {
        cvs,
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_CVS_ERROR]", error);
    return { success: false, error: "Error obteniendo CVs" };
  }
};

