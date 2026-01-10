"use server"

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { Opportunity } from "@prisma/client";

export type SerializableOpportunity = Omit<Opportunity, 'match'> & { match: number };

export const getOpportunities = async (): Promise<SerializableOpportunity[]> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return [];

    const data = await prisma.opportunity.findMany({
      where: {
        cv: { userId: currentUser.id }
      },
      orderBy: [
        { match: "desc" },
        { createdAt: "desc" }
      ]
    });

    // Serialización segura para Next.js Client Components
    return JSON.parse(JSON.stringify(
      data.map(opt => ({
        ...opt,
        match: Number(opt.match)
      }))
    ));
  } catch (error) {
    console.error("[GET_OPPORTUNITIES_ERROR]", error);
    return [];
  }
};
