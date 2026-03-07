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
  | { success: false, error: string };

export interface GetAdminCvsOptions {
  query?: string;
  includeDeleted?: boolean;
  cvType?: string | null;
  opportunityType?: string | null;
  status?: "active" | "deleted" | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "updatedAt" | "title";
  sortOrder?: "asc" | "desc";
}

export const getAdminCvs = async (
  skip = 0,
  take = 10,
  options?: GetAdminCvsOptions
): Promise<AdminCvListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver CVs." };
    }

    const where: Prisma.CvWhereInput = {};

    // Status filter (active/deleted)
    if (options?.status === "deleted") {
      where.deletedAt = { not: null };
    } else if (options?.status === "active" || !options?.includeDeleted) {
      where.deletedAt = null;
    }

    if (options?.query) {
      where.OR = [
        { title: { contains: options.query, mode: "insensitive" } },
        { user: { email: { contains: options.query, mode: "insensitive" } } },
        { user: { name: { contains: options.query, mode: "insensitive" } } },
      ];
    }

    if (options?.cvType) {
      where.cvType = options.cvType as never;
    }

    if (options?.opportunityType) {
      where.opportunityType = options.opportunityType as never;
    }

    if (options?.dateFrom || options?.dateTo) {
      where.createdAt = {};
      if (options?.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (where.createdAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [cvs, totalCount] = await Promise.all([
      prisma.cv.findMany({
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
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.cv.count({ where }),
    ]);

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
