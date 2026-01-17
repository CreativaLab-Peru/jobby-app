import { prisma } from "@/lib/prisma";
import {MatchAnalysis} from "@/features/opportunities/get-opportunities-from-engine";

export const saveOpportunities = async (cvId: string, opportunities: MatchAnalysis[]) => {
  try {
    for (const opp of opportunities) {
      // First check if the opportunity exists in our database
      const existingOpp = await prisma.opportunity.findUnique({
        where: { id: opp.opportunity_id }
      });

      if (existingOpp) {
        // If it exists, we update the relationship and the match score
        // We do NOT overwrite other fields like type, requirements, etc. from defaults
        await prisma.opportunity.update({
          where: { id: opp.opportunity_id },
          data: {
            match: opp.match_score,
            cv: { connect: { id: cvId } }
          }
        });
      } else {
        console.warn(`[SAVE_OPPORTUNITIES] Opportunity ${opp.opportunity_id} not found in database, skipping`);
      }
    }
    return true;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e)
    return false;
  }
}
