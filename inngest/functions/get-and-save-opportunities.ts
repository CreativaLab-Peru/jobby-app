import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { CreditBalanceType, JobStatus, LogAction, LogLevel, RouteStatus } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import { consumeCredits } from "@/features/credits/actions/consume-credits";
import { transformCvToAnalysis } from "@/inngest/utils/cv-transformer";
import {
  getOpportunitiesFromEngine,
  MatchAnalysis
} from "@/features/opportunities/get-opportunities-from-engine";
import { saveOpportunities } from "@/features/opportunities/save-opportunities";

export const getAndSaveOpportunities = inngest.createFunction(
  { id: "get-and-save-opportunities", name: "Get and Save Opportunities", retries: 3 },
  { event: "get.and.save.opportunities" },
  async ({ event, step }) => {
    const { cvId, userId } = event.data;

    // ✅ Create and mark job as IN_PROGRESS
    const job = await prisma.queueJob.upsert({
      where: { jobId: event.id },
      update: {
        status: JobStatus.IN_PROGRESS,
        startedAt: new Date(),
      },
      create: {
        jobId: event.id,
        type: "GET_OPPORTUNITIES",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        cvId,
        startedAt: new Date(),
      },
    });

    // ✅ Log: job started
    await logsService.createLog({
      userId,
      action: LogAction.OPPORTUNITY,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "Started get-and-save-opportunities job",
      metadata: { cvId },
    });

    try {
      // 1. Obtener todos los datos necesarios (CV + Preferencias)
      const { cv, userPrefs } = await step.run("fetch-required-data", async () => {
        const [cvData, prefsData] = await Promise.all([
          prisma.cv.findUnique({
            where: { id: cvId },
            include: { sections: true, opportunities: true }
          }),
          prisma.userPreference.findUnique({ where: { userId } })
        ]);
        return { cv: cvData, userPrefs: prefsData };
      });

      if (!cv) {
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.FAILED, lastError: "CV not found", finishedAt: new Date() },
        });
        return { message: "CV not found" };
      }

      // 2. Transformar datos usando el Utility
      const cvAnalysis = await step.run("transform-data", () => {
        return transformCvToAnalysis(cv as any, userPrefs);
      });

      const cvAnalysisDebug = {
        skillsCount: cvAnalysis.skills?.length ?? 0,
        summaryLength: cvAnalysis.summary?.length ?? 0,
        experienceLength: cvAnalysis.experience_text?.length ?? 0,
        languagesCount: cvAnalysis.languages?.length ?? 0,
        level: cvAnalysis.level ?? null,
        location: cvAnalysis.location ?? null,
        countries: cvAnalysis.countries ?? [],
        type: cvAnalysis.type ?? null,
        textLength: cvAnalysis.text?.length ?? 0,
      };

      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Prepared cv_data for match engine",
        metadata: { cvId, cvAnalysisDebug },
      });
      console.info("[OPPORTUNITIES_MATCH][CV_DATA]", { cvId, userId, cvAnalysisDebug });

      // 3. Llamada al Engine
      const opportunities = await step.run("get-matches", async () => {
        return await getOpportunitiesFromEngine(userId, cvId, {
          cv_data: cvAnalysis as any,
          preferences: {
            top_k: 5,
          }
        });
      });

      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Received response from match engine",
        metadata: {
          cvId,
          matchesCount: opportunities?.matches?.length ?? 0,
          firstMatchId: opportunities?.matches?.[0]?.opportunity_id ?? null,
        },
      });
      console.info("[OPPORTUNITIES_MATCH][ENGINE_RESPONSE]", {
        cvId,
        userId,
        matchesCount: opportunities?.matches?.length ?? 0,
        firstMatchId: opportunities?.matches?.[0]?.opportunity_id ?? null,
      });

      if (!opportunities?.matches?.length || opportunities.matches.length === 0) {
        console.warn("[OPPORTUNITIES_MATCH][NO_MATCHES]", { cvId, userId });
        await logsService.createLog({ userId, action: LogAction.OPPORTUNITY, level: LogLevel.WARNING, entity: "CV_OPPORTUNITY", entityId: cvId, message: "No matches found" });

        // ✅ Mark job as SUCCEEDED (no matches is not a failure)
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
        });

        return { message: "No matches found" };
      }

      // 4. Guardado y Consumo (Paso Atómico)
      const result = await step.run("save-and-consume", async () => {
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

      if (!result) {
        console.error("[OPPORTUNITIES_MATCH][SAVE_FAILED]", {
          cvId,
          userId,
          matchesCount: opportunities.matches.length,
        });
        await prisma.queueJob.update({
          where: { id: job.id },
          data: {
            status: JobStatus.FAILED,
            lastError: "Engine returned matches but they could not be persisted",
            finishedAt: new Date(),
          },
        });

        await logsService.createLog({
          userId,
          action: LogAction.OPPORTUNITY,
          level: LogLevel.ERROR,
          entity: "QUEUE_JOB",
          entityId: job.id,
          message: "Opportunities match found but save step failed",
          metadata: { cvId, count: opportunities.matches.length },
        });

        return { success: false, count: 0, message: "Failed to persist opportunities" };
      }

      // ✅ Mark job as SUCCEEDED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
      });

      // ✅ Advance route status to OPPORTUNITIES_DONE
      const route = await prisma.route.findFirst({
        where: { cvId, userId },
      });
      if (route && (
        route.status === RouteStatus.ANALYSIS_DONE ||
        route.status === RouteStatus.OPPORTUNITIES_PENDING
      )) {
        await prisma.route.update({
          where: { id: route.id },
          data: { status: RouteStatus.OPPORTUNITIES_DONE },
        });
      }

      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.INFO,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Opportunities job completed successfully",
        metadata: { cvId, count: opportunities.matches.length, saved: result },
      });
      console.info("[OPPORTUNITIES_MATCH][DONE]", {
        cvId,
        userId,
        matchesCount: opportunities.matches.length,
        saved: result,
      });

      return { success: result, count: opportunities.matches.length };

    } catch (err: any) {
      console.error("❌ Opportunities processing failed:", err);

      // ✅ Mark job as FAILED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: err?.message ?? "Unknown error",
          finishedAt: new Date(),
        },
      });

      // ✅ Log error
      await logsService.createLog({
        userId,
        action: LogAction.OPPORTUNITY,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Opportunities job failed",
        metadata: {
          error: err?.message,
          stack: err?.stack,
          cvId,
        },
      });

      throw err;
    }
  }
);
