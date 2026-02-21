"use server"

import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";

export interface paginationParams {
  skip?: number,
  take?: number,
  cvId?: string,
  query?: string
}

export const getOpportunities = async (params?: paginationParams) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const {skip = 0, take = 6, cvId, query} = params || {};

    const whereClause: any = {
      cv: {userId: currentUser.id}
    };

    if (cvId) {
      whereClause.cvId = cvId;
    }

    if (query) {
      whereClause.OR = [
        {title: {contains: query, mode: "insensitive"}},
        {company: {contains: query, mode: "insensitive"}},
        {description: {contains: query, mode: "insensitive"}},
      ];
    }

    const [data, count] = await Promise.all([
      prisma.opportunity.findMany({
        where: whereClause,
        orderBy: [
          {match: "desc"},
          {createdAt: "desc"}
        ],
        include: {cv: true},
        skip,
        take
      }),
      prisma.opportunity.count({
        where: whereClause
      })
    ]);

    const opportunitiesFormatted = JSON.parse(JSON.stringify(
      data.map(opt => ({
        ...opt,
        match: Number(opt.match),
        cv: {
          id: opt.cv.id,
          title: opt.cv.title
        }
      }))
    ));

    return {
      opportunities: opportunitiesFormatted,
      hasMore: skip + take < count,
      totalCount: count
    }
  } catch (error) {
    console.error("[GET_OPPORTUNITIES_ERROR]", error);
    return null;
  }
};
