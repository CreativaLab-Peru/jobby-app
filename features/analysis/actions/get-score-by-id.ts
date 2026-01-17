import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import {
  Opportunity,
  CvEvaluation,
  type Recommendation as PrismaRecommendation
} from ".prisma/client";
import type {EvaluationScore} from "@prisma/client";

export type GetScoreAndOpportunityById = {
  evaluation: CvEvaluation & { scores: EvaluationScore[], recommendations: PrismaRecommendation[] }
  opportunities: Opportunity[]
}

export const getEvaluationById = async (analyzeId: string): Promise<GetScoreAndOpportunityById | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;
    const cvEvaluation = await prisma.cvEvaluation.findFirst({
      where: { id: analyzeId },
      include: {
        scores: true,
        recommendations: true,
        cv: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    if (!cvEvaluation) return null;

    const cvId = cvEvaluation.cv.id || null;
    if (!cvId) {
      return null;
    }

    const opportunities = await prisma.opportunity.findMany({
      where: {
        cvId,
      }
    })

    const serializedOpportunities = opportunities.map(opp => ({
      ...opp,
      match: opp.match.toNumber(),
      createdAt: opp.createdAt,
      updatedAt: opp.updatedAt,
      deadline: opp.deadline,
    }));

    // We cast to any here to match the component expectation which uses the Prisma type
    // In a real scenario we should update the component prop types to expect number instead of Decimal
    const scoreAndOpportunities: GetScoreAndOpportunityById = {
      evaluation: cvEvaluation,
      opportunities: serializedOpportunities as unknown as Opportunity[],
    }

    return scoreAndOpportunities;
  } catch (error) {
    console.error("[ERROR_GET_SCORE_ANALYSIS]", error);
    return null;
  }
};
