"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { QueueJob, Cv, JobStatus } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminJobItem = QueueJob & {
  cv: Pick<Cv, "id" | "title" | "opportunityType" | "cvType"> | null;
};

export type AdminJobListResult =
  | {
      success: true;
      data: {
        jobs: AdminJobItem[];
        hasMore: boolean;
        totalCount: number;
        stats: {
          pending: number;
          inProgress: number;
          succeeded: number;
          failed: number;
          cancelled: number;
        };
      };
    }
  | { success: false; error: string };

export interface GetAdminJobsOptions {
  query?: string;
  status?: JobStatus | null;
  type?: string | null;
  hasError?: "yes" | "no" | null;
  hasCv?: "yes" | "no" | null;
  attemptsMin?: number | null;
  attemptsMax?: number | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "updatedAt" | "attempts" | "status" | "type";
  sortOrder?: "asc" | "desc";
}

export const getAdminJobs = async (
  skip = 0,
  take = 10,
  options?: GetAdminJobsOptions
): Promise<AdminJobListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.QueueJobWhereInput = {};

    // Status filter
    if (options?.status) {
      where.status = options.status;
    }

    // Type filter
    if (options?.type) {
      where.type = options.type;
    }

    // Has error filter
    if (options?.hasError === "yes") {
      where.lastError = { not: null };
    } else if (options?.hasError === "no") {
      where.lastError = null;
    }

    // Has CV filter
    if (options?.hasCv === "yes") {
      where.cvId = { not: null };
    } else if (options?.hasCv === "no") {
      where.cvId = null;
    }

    // Attempts range
    if (options?.attemptsMin !== undefined && options?.attemptsMin !== null) {
      where.attempts = { ...(where.attempts as Prisma.IntFilter || {}), gte: options.attemptsMin };
    }
    if (options?.attemptsMax !== undefined && options?.attemptsMax !== null) {
      where.attempts = { ...(where.attempts as Prisma.IntFilter || {}), lte: options.attemptsMax };
    }

    // Search by jobId, type, or lastError
    if (options?.query) {
      where.OR = [
        { jobId: { contains: options.query, mode: "insensitive" } },
        { type: { contains: options.query, mode: "insensitive" } },
        { lastError: { contains: options.query, mode: "insensitive" } },
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

    // Fetch jobs, count, and stats in parallel
    const [jobs, totalCount, pending, inProgress, succeeded, failed, cancelled] = await Promise.all([
      prisma.queueJob.findMany({
        where,
        skip,
        take,
        include: {
          cv: { select: { id: true, title: true, opportunityType: true, cvType: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.queueJob.count({ where }),
      prisma.queueJob.count({ where: { status: "PENDING" } }),
      prisma.queueJob.count({ where: { status: "IN_PROGRESS" } }),
      prisma.queueJob.count({ where: { status: "SUCCEEDED" } }),
      prisma.queueJob.count({ where: { status: "FAILED" } }),
      prisma.queueJob.count({ where: { status: "CANCELLED" } }),
    ]);

    return {
      success: true,
      data: {
        jobs: jobs as AdminJobItem[],
        hasMore: skip + take < totalCount,
        totalCount,
        stats: { pending, inProgress, succeeded, failed, cancelled },
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_JOBS_ERROR]", error);
    return { success: false, error: "Error obteniendo jobs" };
  }
};

