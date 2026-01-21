import { prisma } from "@/lib/prisma";
import {MatchAnalysis} from "@/features/opportunities/get-opportunities-from-engine";

import { OpportunityType } from "@prisma/client";

export const saveOpportunities = async (cvId: string, opportunities: MatchAnalysis[]) => {
  try {
    // We need the CV type to enforce consistency if creating new opportunities
    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: { opportunityType: true }
    });

    if (!cv) {
      console.warn(`[SAVE_OPPORTUNITIES] CV ${cvId} not found`);
      return false;
    }

    for (const opp of opportunities) {
      // Map API fields to Prisma schema
      // API v3 structure: details header has url, deadline, etc.
      const matchScore = opp.match_score;
      const title = opp.title;
      // Use API details if available
      const linkUrl = opp.details?.url || "#";
      const deadline = opp.details?.deadline ? new Date(opp.details.deadline) : null;
      // Construct requirements from breakdown or default, since API might not send explicit requirements text
      const requirements = opp.details?.requirements || "Ver detalle para más información";
      
      // Use the CV's opportunity type as the source of truth for the opportunity type
      // ensuring we only save opportunities that match what the user asked for (Employment, Internship, etc.)
      const type = cv.opportunityType;

      await prisma.opportunity.upsert({
        where: {
          id: opp.opportunity_id,
        },
        create: {
          id: opp.opportunity_id, // Ensure we use the API's ID
          type: type, 
          title: title,
          deadline: deadline,
          requirements: requirements,
          linkUrl: linkUrl,
          match: matchScore,
          cv: { connect: { id: cvId } },
        },
        update: {
          match: matchScore,
          // We can optionally update other fields if we trust the API represents the latest state
          title: title,
          deadline: deadline,
          linkUrl: linkUrl,
          cv: { connect: { id: cvId } },
           // We do NOT update 'type' on existing records to avoid changing historical data if it was set differently
           // But for new records we use the CV's type.
        }
      });
    }
    return true;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e)
    return false;
  }
}
