import { prisma } from "@/lib/prisma";
import {MatchAnalysis} from "@/features/opportunities/get-opportunities-from-engine";

export const saveOpportunities = async (cvId: string, opportunities: MatchAnalysis[]) => {
  try {
    for (const opp of opportunities) {
      await prisma.opportunity.upsert({
        where: {
          id: opp.opportunity_id,
        },
        create: {
          type: opp.type,
          title: opp.title,
          deadline: opp.deadline,
          requirements: opp.requirements,
          linkUrl: opp.linkUrl,
          match: opp.match_score,
          cv: { connect: { id: cvId } },
        },
        update: {
          cvId,
          type: opp.type,
          title: opp.title,
          deadline: opp.deadline,
          requirements: opp.requirements,
          linkUrl: opp.linkUrl,
          match: opp.match_score,
        }
      });
    }
    return true;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e)
    return false;
  }
}
