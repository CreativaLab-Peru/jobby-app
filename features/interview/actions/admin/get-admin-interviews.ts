"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { InterviewSession, User, Cv, Opportunity } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminInterviewItem = InterviewSession & {
  user: Pick<User, "id" | "email" | "name" | "image">;
  cv: Pick<Cv, "id" | "title" | "opportunityType" | "cvType">;
  opportunity: Pick<Opportunity, "id" | "cvId" | "title" | "company" | "type">;
};

export type AdminInterviewListResult =
  | {
      success: true;
      data: {
        interviews: AdminInterviewItem[];
        hasMore: boolean;
        totalCount: number;
        stats: {
          total: number;
          completed: number;
          pending: number;
          failed: number;
          avgScore: number | null;
        };
      };
    }
  | { success: false; error: string };

export interface GetAdminInterviewsOptions {
  query?: string;
  status?: string | null;
  scoreMin?: number | null;
  scoreMax?: number | null;
  hasTranscript?: "yes" | "no" | null;
  hasFeedback?: "yes" | "no" | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "overallScore" | "status";
  sortOrder?: "asc" | "desc";
}

export const getAdminInterviews = async (
  skip = 0,
  take = 10,
  options?: GetAdminInterviewsOptions
): Promise<AdminInterviewListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.InterviewSessionWhereInput = {};

    // Status filter
    if (options?.status) {
      where.status = options.status;
    }

    // Score range
    if (options?.scoreMin !== undefined && options?.scoreMin !== null) {
      where.overallScore = { ...(where.overallScore as Prisma.IntNullableFilter || {}), gte: options.scoreMin };
    }
    if (options?.scoreMax !== undefined && options?.scoreMax !== null) {
      where.overallScore = { ...(where.overallScore as Prisma.IntNullableFilter || {}), lte: options.scoreMax };
    }

    // Has transcript
    if (options?.hasTranscript === "yes") {
      where.transcript = { not: Prisma.JsonNull };
    } else if (options?.hasTranscript === "no") {
      where.transcript = { equals: Prisma.JsonNull };
    }

    // Has feedback
    if (options?.hasFeedback === "yes") {
      where.feedback = { not: null };
    } else if (options?.hasFeedback === "no") {
      where.feedback = null;
    }

    // Search by user name/email, opportunity title, CV title
    if (options?.query) {
      where.OR = [
        { user: { name: { contains: options.query, mode: "insensitive" } } },
        { user: { email: { contains: options.query, mode: "insensitive" } } },
        { opportunity: { title: { contains: options.query, mode: "insensitive" } } },
        { cv: { title: { contains: options.query, mode: "insensitive" } } },
        { vapiCallId: { contains: options.query, mode: "insensitive" } },
      ];
    }

    // Date range
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

    const [interviews, totalCount, completed, pending, failed, scoreAgg] = await Promise.all([
      prisma.interviewSession.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, email: true, name: true, image: true } },
          cv: { select: { id: true, title: true, opportunityType: true, cvType: true } },
          opportunity: { select: { id: true, cvId: true, title: true, company: true, type: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.interviewSession.count({ where }),
      prisma.interviewSession.count({ where: { status: "COMPLETED" } }),
      prisma.interviewSession.count({ where: { status: "PENDING" } }),
      prisma.interviewSession.count({ where: { status: "FAILED" } }),
      prisma.interviewSession.aggregate({ _avg: { overallScore: true }, where: { status: "COMPLETED", overallScore: { not: null } } }),
    ]);

    const total = completed + pending + failed;

    return {
      success: true,
      data: {
        interviews: interviews as AdminInterviewItem[],
        hasMore: skip + take < totalCount,
        totalCount,
        stats: {
          total,
          completed,
          pending,
          failed,
          avgScore: scoreAgg._avg.overallScore ?? null,
        },
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_INTERVIEWS_ERROR]", error);
    return { success: false, error: "Error obteniendo entrevistas" };
  }
};

