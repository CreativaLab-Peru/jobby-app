"use server";

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { InterviewSession, Opportunity } from "@prisma/client";

export type InterviewWithRelations = InterviewSession & {
  opportunity: Opportunity & {
    match: number;
  };
  cv: {
    title: string | null;
  };
};

export interface PaginationParams {
  skip?: number;
  take?: number;
  opportunityId?: string | null;
}

export const getInterviews = async (params?: PaginationParams) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const { skip = 0, take = 6, opportunityId = null } = params || {};

    const whereClause: any = { userId: currentUser.id };
    if (opportunityId) whereClause.opportunityId = opportunityId;

    const [data, count] = await Promise.all([
      prisma.interviewSession.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          opportunity: true,
          cv: { select: { title: true } },
        },
        skip,
        take,
      }),
      prisma.interviewSession.count({ where: whereClause }),
    ]);

    // Serialización segura para Next.js Server Components
    const formattedData = JSON.parse(JSON.stringify(data)) as InterviewWithRelations[];

    return {
      interviews: formattedData,
      hasMore: skip + take < count,
      totalCount: count,
    };
  } catch (error) {
    console.error("[GET_INTERVIEWS_ERROR]", error);
    return null;
  }
};
