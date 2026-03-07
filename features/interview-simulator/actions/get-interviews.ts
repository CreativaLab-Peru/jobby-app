"use server"

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";

export interface PaginationParams {
  skip?: number;
  take?: number;
  opportunityId?: string;
}

export const getInterviews = async (params?: PaginationParams) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const { skip = 0, take = 6, opportunityId } = params || {};

    const whereClause: any = { userId: currentUser.id };
    if (opportunityId) whereClause.opportunityId = opportunityId;

    const [data, count] = await Promise.all([
      prisma.interviewSession.findMany({
        where: whereClause,
        orderBy: { createdAt: "desc" },
        include: {
          opportunity: true,
          cv: { select: { title: true } }
        },
        skip,
        take
      }),
      prisma.interviewSession.count({ where: whereClause })
    ]);

    return {
      interviews: JSON.parse(JSON.stringify(data)),
      hasMore: skip + take < count,
      totalCount: count
    };
  } catch (error) {
    console.error("[GET_INTERVIEWS_ERROR]", error);
    return null;
  }
};
