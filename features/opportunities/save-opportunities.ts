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
      // Map API fields to Prisma schema (new nested format)
      const matchScore = opp.match_score;
      const title = opp.details?.title || "Sin título";
      const linkUrl = opp.details?.url || "#";
      const deadline = opp.details?.deadline ? new Date(opp.details.deadline) : null;
      
      // Build requirements from skill arrays
      let requirements = "";
      if (opp.details?.requiredSkills && opp.details.requiredSkills.length > 0) {
        requirements += "Habilidades requeridas: " + opp.details.requiredSkills.join(", ");
      }
      if (opp.details?.optionalSkills && opp.details.optionalSkills.length > 0) {
        if (requirements) requirements += "\n";
        requirements += "Habilidades opcionales: " + opp.details.optionalSkills.join(", ");
      }
      if (!requirements) {
        requirements = "Ver detalle para más información";
      }
      
      const company = opp.details?.organization?.organization_name || null;
      const modality = opp.details?.modality || null;
      const location = opp.details?.ubication || null;
      const description = opp.details?.description || null;
      const benefits = opp.details?.benefits || null;
      
      // Format salary if available
      let salary = null;
      if (opp.details?.salary) {
        const { min, max, currency } = opp.details.salary;
        const currencyCode = currency || "USD";
        if (min && max) {
          salary = `${currencyCode} ${min} - ${max}`;
        } else if (min) {
          salary = `${currencyCode} ${min}+`;
        }
      }
      
      // Use the CV's opportunity type as the source of truth
      const type = cv.opportunityType;

      await prisma.opportunity.upsert({
        where: {
          id: opp.opportunity_id,
        },
        create: {
          id: opp.opportunity_id,
          type: type, 
          title: title,
          deadline: deadline,
          requirements: requirements,
          linkUrl: linkUrl,
          match: matchScore,
          company: company,
          location: location,
          modality: modality,
          salary: salary,
          description: description,
          benefits: benefits,
          cv: { connect: { id: cvId } },
        },
        update: {
          match: matchScore,
          title: title,
          deadline: deadline,
          linkUrl: linkUrl,
          company: company,
          location: location,
          modality: modality,
          salary: salary,
          description: description,
          benefits: benefits,
        }
      });
    }
    return true;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e)
    return false;
  }
}
