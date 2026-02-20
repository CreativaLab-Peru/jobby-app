import { prisma } from "@/lib/prisma";
import {MatchAnalysis} from "@/features/opportunities/get-opportunities-from-engine";

export const saveOpportunities = async (cvId: string, opportunities: MatchAnalysis[]) => {
  try {
    console.log(`[SAVE_OPPORTUNITIES] Starting to save ${opportunities.length} opportunities for CV ${cvId}`);

    // We need the CV type to enforce consistency if creating new opportunities
    const cv = await prisma.cv.findUnique({
      where: { id: cvId },
      select: { opportunityType: true }
    });

    if (!cv) {
      console.warn(`[SAVE_OPPORTUNITIES] CV ${cvId} not found`);
      return false;
    }

    console.log(`[SAVE_OPPORTUNITIES] CV found, opportunityType: ${cv.opportunityType}`);

    // Delete all existing opportunities for this CV before saving new ones
    const deleted = await prisma.opportunity.deleteMany({ where: { cvId } });
    if (deleted.count > 0) {
      console.log(`[SAVE_OPPORTUNITIES] Deleted ${deleted.count} old opportunities for CV ${cvId}`);
    }

    let savedCount = 0;
    for (const opp of opportunities) {
      // Map API fields to Prisma schema (new nested format)
      // Prisma automatically handles conversion to Decimal type
      const matchScore = opp.match_score;
      const title = opp.details?.title || "Sin título";
      const linkUrl = opp.details?.url || "#";
      const deadline = opp.details?.deadline ? new Date(opp.details.deadline) : null;

      console.log(`[SAVE_OPPORTUNITIES] Processing opportunity: ${opp.opportunity_id}, matchScore: ${matchScore}, title: ${title}`);

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

      try {
        // Round matchScore to 4 decimal places to fit Decimal(8,4) schema constraint
        const matchDecimal = Math.round(matchScore * 10000) / 10000;

        await prisma.opportunity.create({
          data: {
            id: opp.opportunity_id,
            type: type,
            title: title,
            deadline: deadline,
            requirements: requirements,
            linkUrl: linkUrl,
            match: matchDecimal,
            company: company,
            location: location,
            modality: modality,
            salary: salary,
            description: description,
            benefits: benefits,
            cv: { connect: { id: cvId } },
          },
        });
        savedCount++;
        console.log(`[SAVE_OPPORTUNITIES] ✅ Opportunity ${opp.opportunity_id} saved successfully`);
      } catch (createError) {
        console.error(`[SAVE_OPPORTUNITIES] ❌ Failed to save opportunity ${opp.opportunity_id}:`, createError);
      }
    }

    console.log(`[SAVE_OPPORTUNITIES] Completed: ${savedCount}/${opportunities.length} opportunities saved`);
    return savedCount > 0;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e)
    return false;
  }
}
