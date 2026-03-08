"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Cv, Opportunity, User, OpportunityType } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminOpportunityItem = Opportunity & {
  cv: Pick<Cv, "id" | "title" | "cvType" | "opportunityType"> & {
    user: Pick<User, "id" | "email" | "name"> | null;
  };
  _count: {
    interviewSessions: number;
  };
};

export type AdminOpportunityListResult =
  | {
      success: true;
      data: {
        opportunities: AdminOpportunityItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminOpportunitiesOptions {
  query?: string;
  type?: OpportunityType | null;
  company?: string | null;
  hasDeadline?: "yes" | "no" | null;
  sortBy?: "createdAt" | "match" | "deadline";
  sortOrder?: "asc" | "desc";
}

export const getAdminOpportunities = async (
  skip = 0,
  take = 10,
  options?: GetAdminOpportunitiesOptions
): Promise<AdminOpportunityListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado. Solo los administradores pueden ver oportunidades." };
    }

    const where: Prisma.OpportunityWhereInput = {};

    if (options?.type) {
      where.type = options.type;
    }

    if (options?.query) {
      where.OR = [
        { title: { contains: options.query, mode: "insensitive" } },
        { company: { contains: options.query, mode: "insensitive" } },
        { description: { contains: options.query, mode: "insensitive" } },
        { cv: { user: { name: { contains: options.query, mode: "insensitive" } } } },
        { cv: { user: { email: { contains: options.query, mode: "insensitive" } } } },
      ];
    }

    if (options?.company) {
      where.company = { contains: options.company, mode: "insensitive" };
    }

    if (options?.hasDeadline === "yes") {
      where.deadline = { not: null };
    } else if (options?.hasDeadline === "no") {
      where.deadline = null;
    }

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [opportunities, totalCount] = await Promise.all([
      prisma.opportunity.findMany({
        where,
        skip,
        take,
        include: {
          cv: {
            select: {
              id: true,
              title: true,
              cvType: true,
              opportunityType: true,
              user: { select: { id: true, email: true, name: true } },
            },
          },
          _count: {
            select: { interviewSessions: true },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.opportunity.count({ where }),
    ]);

    const opportunitiesParsed = JSON.stringify(opportunities);
    const opportunitiesClean = JSON.parse(opportunitiesParsed) as AdminOpportunityItem[];

    return {
      success: true,
      data: {
        opportunities: opportunitiesClean as AdminOpportunityItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_OPPORTUNITIES_ERROR]", error);
    return { success: false, error: "Error obteniendo oportunidades" };
  }
};
