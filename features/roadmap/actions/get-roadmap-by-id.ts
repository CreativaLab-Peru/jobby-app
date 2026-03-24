"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export type RoadmapDetail = {
  id: string;
  title: string | null;
  summary: string | null;
  status: string;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    company: string | null;
    type: string;
    cvId: string;
    location: string | null;
    linkUrl: string;
  };
  steps: {
    id: string;
    order: number;
    title: string;
    description: string;
    actionItems: { done: boolean, action: string }[];
    estimatedDays: number | null;
    resources: { title: string; url?: string; type: string }[];
    isFree: boolean;
  }[];
};

export async function getRoadmapById(roadmapId: string): Promise<RoadmapDetail | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const roadmap = await prisma.roadmap.findFirst({
      where: { id: roadmapId, userId: user.id },
      include: {
        opportunity: {
          select: {
            id: true,
            title: true,
            company: true,
            type: true,
            cvId: true,
            location: true,
            linkUrl: true,
          },
        },
        steps: {
          orderBy: { order: "asc" },
          take: 10,
        },
      },
    });

    if (!roadmap) return null;

    return {
      id: roadmap.id,
      title: roadmap.title,
      summary: roadmap.summary,
      status: roadmap.status,
      createdAt: roadmap.createdAt.toISOString(),
      opportunity: {
        id: roadmap.opportunity.id,
        title: roadmap.opportunity.title,
        company: roadmap.opportunity.company,
        type: roadmap.opportunity.type,
        cvId: roadmap.opportunity.cvId,
        location: roadmap.opportunity.location,
        linkUrl: roadmap.opportunity.linkUrl,
      },
      steps: roadmap.steps.map((s) => ({
        id: s.id,
        order: s.order,
        title: s.title,
        description: s.description,
        actionItems: (s.actionItems as {done: boolean, action: string}[]) || [],
        estimatedDays: s.estimatedDays,
        resources: (s.resources as { title: string; url?: string; type: string }[]) || [],
        isFree: s.isFree,
      })),
    };
  } catch (error) {
    console.error("[GET_ROADMAP_BY_ID_ERROR]", error);
    return null;
  }
}

