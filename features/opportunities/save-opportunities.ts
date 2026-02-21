import { prisma } from "@/lib/prisma";
import { MatchAnalysis } from "@/features/opportunities/get-opportunities-from-engine";
import { Cv } from "@prisma/client";

export const saveOpportunities = async (cv: Cv, opportunities: MatchAnalysis[]) => {
  try {
    if (opportunities.length === 0) return true;

    // 1. Transformamos los datos en un array de objetos planos
    const dataToInsert = opportunities.map((opp) => {
      const details = opp.details;

      // Lógica de requisitos (la mantenemos limpia)
      const reqParts = [];
      if (details?.requiredSkills?.length) {
        reqParts.push(`Habilidades requeridas: ${details.requiredSkills.join(", ")}`);
      }
      if (details?.optionalSkills?.length) {
        reqParts.push(`Habilidades opcionales: ${details.optionalSkills.join(", ")}`);
      }
      const requirements = reqParts.join("\n") || "Ver detalle para más información";

      // Formateo de salario
      let salary = null;
      if (details?.salary) {
        const { min, max, currency } = details.salary;
        const code = currency || "USD";
        salary = min && max ? `${code} ${min} - ${max}` : min ? `${code} ${min}+` : null;
      }

      // Retornamos el objeto con la estructura de la base de datos
      return {
        id: opp.opportunity_id,
        type: cv.opportunityType,
        title: details?.title || "Sin título",
        linkUrl: details?.url || "#",
        deadline: details?.deadline ? new Date(details.deadline) : null,
        // Redondeo de precisión para Decimal(8,4)
        match: Math.round(opp.match_score * 10000) / 10000,
        company: details?.organization?.organization_name || null,
        location: details?.ubication || null,
        modality: details?.modality || null,
        salary: salary,
        description: details?.description || null,
        benefits: details?.benefits || null,
        cvId: cv.id,
        requirements: requirements,
      };
    });

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
