import { prisma } from "@/lib/prisma";
import { MatchAnalysis } from "@/features/opportunities/get-opportunities-from-engine";
import { Cv } from "@prisma/client";

function parseDeadline(value?: string | Date): Date | null {
  if (!value) return null;
  const parsed = value instanceof Date ? value : new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export const saveOpportunities = async (cv: Cv, opportunities: MatchAnalysis[]) => {
  try {
    if (opportunities.length === 0) return true;
    // 1. Transformamos los datos en un array de objetos planos
    const dataToInsert = opportunities.map((opp, index) => {
      const details = opp.details;
      const minSalary = Number(details?.salary?.min || 0).toString();
      const maxSalary = Number(details?.salary?.max || 0).toString();
      return {
        id: opp.opportunity_id || `${cv.id}-${index}-${Date.now()}`,
        type: cv.opportunityType,
        title: details?.title || "Sin título",
        linkUrl: details?.url || "#",
        deadline: parseDeadline(details?.deadline),
        // Redondeo de precisión para Decimal(8,4)
        match: Math.round(opp.match_score * 10000) / 10000,
        company: details?.organization?.organization_name || null,
        location: details?.ubication || null,
        modality: details?.modality || null,

        // Deprecated
        // salary: salary,

        description: details?.description || null,
        benefits: details?.benefits || null,
        cvId: cv.id,

        // Deprecated
        // requirements: requirements,
        requiredRequirements: details?.requiredSkills || [],
        optionalRequirements: details?.optionalSkills || [],

        companyLogoUrl: details.organization.organization_logo || null,
        minSalary,
        maxSalary,

      };
    }).filter((item) => Boolean(item.id && item.title && item.linkUrl));

    if (dataToInsert.length === 0) {
      console.warn("[SAVE_OPPORTUNITIES] El engine respondió, pero no hubo registros válidos para persistir.");
      return false;
    }

    // 2. Inserción masiva
    console.log(`[SAVE_OPPORTUNITIES] Intentando guardar ${dataToInsert.length} registros...`);

    await prisma.opportunity.createMany({
      data: dataToInsert,
      skipDuplicates: true, // Evita errores si una oportunidad ya fue guardada
    });

    return true;
  } catch (e) {
    console.error("[ERROR_SAVE_OPPORTUNITIES]:", e);
    return false;
  }
};
