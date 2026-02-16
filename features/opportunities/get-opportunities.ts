"use server"

import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";

export interface paginationParams {
  skip?: number,
  take?: number
}

export const getOpportunities = async (params?: paginationParams) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const {skip = 0, take = 6} = params || {};

    const [data, count] = await Promise.all([
      prisma.opportunity.findMany({
        where: {
          cv: {userId: currentUser.id}
        },
        orderBy: [
          {match: "desc"},
          {createdAt: "desc"}
        ],
        skip,
        take
      }),
      prisma.opportunity.count({
        where: {
          cv: {userId: currentUser.id}
        }
      })
    ]);

    const opportunitiesFormatted = JSON.parse(JSON.stringify(
      data.map(opt => ({
        ...opt,
        match: Number(opt.match)
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
