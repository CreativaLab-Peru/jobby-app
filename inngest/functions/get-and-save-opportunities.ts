import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { CreditBalanceType, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import { consumeCredits } from "@/features/credits/actions/consume-credits";
import {transformCvToAnalysis} from "@/inngest/utils/cv-transformer";
import {
  getOpportunitiesFromEngine,
  MatchAnalysis
} from "@/features/opportunities/get-opportunities-from-engine";
import {saveOpportunities} from "@/features/opportunities/save-opportunities";

export const getAndSaveOpportunities = inngest.createFunction(
  { id: "get-and-save-opportunities", name: "Get and Save Opportunities", retries: 3 },
  { event: "get.and.save.opportunities" },
  async ({ event, step }) => {
    const { cvId, userId } = event.data;

    // 1. Obtener todos los datos necesarios (CV + Preferencias)
    const { cv, userPrefs } = await step.run("fetch-required-data", async () => {
      const [cvData, prefsData] = await Promise.all([
        prisma.cv.findUnique({
          where: { id: cvId },
          include: { sections: true, opportunities: true }
        }),
        // Asumiendo que tu tabla de preferencias se llama userPreference
        prisma.userPreference.findUnique({ where: { userId } })
      ]);
      return { cv: cvData, userPrefs: prefsData };
    });

    if (!cv) return { message: "CV not found" };

    // 2. Transformar datos usando el Utility
    const cvAnalysis = await step.run("transform-data", () => {
      return transformCvToAnalysis(cv as any, userPrefs);
    });

    // 3. Llamada al Engine
    const opportunities = await step.run("get-matches", async () => {
      return await getOpportunitiesFromEngine(userId, cvId, {
        cv_data: cvAnalysis as any,
        preferences: {
          top_k: 5,
          // modality: userPrefs?.workModality?.[0] as any // TODO: new to be more dynamic with preferences
        }
      });
    });

    if (!opportunities?.matches?.length || opportunities.matches.length === 0) {
      await logsService.createLog({ userId, action: LogAction.OPPORTUNITY, level: LogLevel.WARNING, entity: "CV_OPPORTUNITY", entityId: cvId, message: "No matches found" });
      return { message: "No matches found" };
    }

    // 4. Guardado y Consumo (Paso Atómico)
    const result = await step.run("save-and-consume", async () => {
      // Limpiar anteriores para evitar duplicados
      await prisma.opportunity.deleteMany({ where: { cvId } });

      const saved = await saveOpportunities(cv as any, opportunities.matches as MatchAnalysis[]);
      if (saved) {
        await consumeCredits({
          userId,
          type: CreditBalanceType.SEARCH_OPPORTUNITIES,
          amount: 1,
          description: `Búsqueda para CV ${cvId}`,
        });
        return true;
      }
      return false;
    });

    return { success: result, count: opportunities.matches.length };
  }
);
