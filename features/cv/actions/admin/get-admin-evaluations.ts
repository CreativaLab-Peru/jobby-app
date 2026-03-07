"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import {
  Cv,
  CvEvaluation,
  EvaluationScore,
  Recommendation,
  User,
  JobStatus,
} from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminEvaluationWithRelations = CvEvaluation & {
  scores: EvaluationScore[];
  recommendations: Recommendation[];
  cv: Pick<Cv, "id" | "title" | "opportunityType" | "cvType"> & {
    user: Pick<User, "id" | "email" | "name"> | null;
  };
};

export type AdminEvaluationListResult =
  | {
      success: true;
      data: {
        evaluations: AdminEvaluationWithRelations[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminEvaluationsOptions {
  query?: string;
  status?: JobStatus | null;
  cvType?: string | null;
  opportunityType?: string | null;
  scoreMin?: number | null;
  scoreMax?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "overallScore" | "status";
  sortOrder?: "asc" | "desc";
}

export const getAdminEvaluations = async (
  skip = 0,
  take = 10,
  options?: GetAdminEvaluationsOptions
): Promise<AdminEvaluationListResult> => {
  try {
    const adminResult = await requireAdmin();
    if (!adminResult.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver evaluaciones." };
    }

    const where: Prisma.CvEvaluationWhereInput = {};

    if (options?.status) {
      where.status = options.status;
    }

    if (options?.query) {
      where.OR = [
        { cv: { title: { contains: options.query, mode: "insensitive" } } },
        { cv: { user: { email: { contains: options.query, mode: "insensitive" } } } },
        { cv: { user: { name: { contains: options.query, mode: "insensitive" } } } },
      ];
    }

    if (options?.cvType) {
      where.cv = { ...((where.cv as Prisma.CvWhereInput) || {}), cvType: options.cvType as never };
    }

    if (options?.opportunityType) {
      where.cv = { ...((where.cv as Prisma.CvWhereInput) || {}), opportunityType: options.opportunityType as never };
    }

    if (options?.scoreMin !== null && options?.scoreMin !== undefined) {
      where.overallScore = { ...((where.overallScore as Prisma.FloatNullableFilter) || {}), gte: options.scoreMin };
    }
    if (options?.scoreMax !== null && options?.scoreMax !== undefined) {
      where.overallScore = { ...((where.overallScore as Prisma.FloatNullableFilter) || {}), lte: options.scoreMax };
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

    const [evaluations, totalCount] = await Promise.all([
      prisma.cvEvaluation.findMany({
        where,
        skip,
        take,
        include: {
          scores: true,
          recommendations: true,
          cv: {
            select: {
              id: true,
              title: true,
              opportunityType: true,
              cvType: true,
              user: { select: { id: true, email: true, name: true } },
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.cvEvaluation.count({ where }),
    ]);

    return {
      success: true,
      data: {
        evaluations: evaluations as AdminEvaluationWithRelations[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_EVALUATIONS_ERROR]", error);
    return { success: false, error: "Error obteniendo evaluaciones" };
  }
};
