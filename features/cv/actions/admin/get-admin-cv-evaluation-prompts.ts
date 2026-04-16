"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Prisma, CvEvaluationPrompt } from "@prisma/client";

export type AdminCvEvaluationPromptItem = CvEvaluationPrompt;

export type AdminCvEvaluationPromptListResult =
  | {
      success: true;
      data: {
        prompts: AdminCvEvaluationPromptItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminCvEvaluationPromptsOptions {
  query?: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "beca";
  sortOrder?: "asc" | "desc";
}

export const getAdminCvEvaluationPrompts = async (
  skip = 0,
  take = 10,
  options?: GetAdminCvEvaluationPromptsOptions
): Promise<AdminCvEvaluationPromptListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.CvEvaluationPromptWhereInput = {};

    if (options?.query) {
      where.OR = [
        { beca: { contains: options.query, mode: "insensitive" } },
        { prompt: { contains: options.query, mode: "insensitive" } },
      ];
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

    const [prompts, totalCount] = await Promise.all([
      prisma.cvEvaluationPrompt.findMany({
        where,
        skip,
        take,
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.cvEvaluationPrompt.count({ where }),
    ]);

    return {
      success: true,
      data: {
        prompts: prompts as AdminCvEvaluationPromptItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_CV_EVALUATION_PROMPTS_ERROR]", error);
    return { success: false, error: "Error obteniendo prompts" };
  }
};

