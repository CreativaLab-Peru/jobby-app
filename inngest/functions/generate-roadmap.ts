import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus, LogAction, LogLevel, RouteStatus } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import { queryGemini } from "@/features/cv/queries/query-gemini";
import {
  getPromptToGenerateRoadmap,
  PromptToGenerateRoadmap
} from "@/features/roadmap/prompts/get-prompt-to-evaluate-cv";
import {
  buildCvPayloadForEvaluation,
  filterSectionsByOpportunity
} from "@/inngest/utils/cv-evaluation-helper";

type RoadmapStepAI = {
  order: number;
  title: string;
  description: string;
  actionItems: string[];
  estimatedDays: number;
  resources: { title: string; url?: string; type: string }[];
};

type RoadmapAIResponse = {
  title: string;
  summary: string;
  steps: RoadmapStepAI[];
};

export const generateRoadmap = inngest.createFunction(
  { id: "generate-roadmap", name: "Generate AI Roadmap", retries: 3 },
  { event: "generate.roadmap" },
  async ({ event, step }) => {
    const { opportunityId, cvId, userId, routeId } = event.data;

    // Create QueueJob
    const job = await prisma.queueJob.upsert({
      where: { jobId: event.id },
      update: { status: JobStatus.IN_PROGRESS, startedAt: new Date() },
      create: {
        jobId: event.id,
        type: "GENERATE_ROADMAP",
        payload: event.data,
        status: JobStatus.IN_PROGRESS,
        cvId,
        startedAt: new Date(),
      },
    });

    // Create or update roadmap record as IN_PROGRESS
    const roadmap = await prisma.roadmap.upsert({
      where: {
        opportunityId_cvId_userId_routeId: { opportunityId, cvId, userId, routeId },
      },
      update: { status: JobStatus.IN_PROGRESS, createdByJobId: job.id },
      create: {
        userId,
        cvId,
        routeId,
        opportunityId,
        status: JobStatus.IN_PROGRESS,
        createdByJobId: job.id,
      },
    });

    await logsService.createLog({
      userId,
      action: LogAction.JOB,
      level: LogLevel.INFO,
      entity: "ROADMAP",
      entityId: roadmap.id,
      message: "Started roadmap generation",
      metadata: { cvId, opportunityId },
    });

    try {
      // 1. Fetch CV + Opportunity data
      const { cv, filteredSections, opportunity, userPrefs } = await step.run("fetch-data", async () => {
        const [cvDoc, oppData, prefsData] = await Promise.all([
          prisma.cv.findUnique({ where: { id: cvId }, include: { sections: true } }),
          prisma.opportunity.findFirst({ where: { id: opportunityId, cvId } }),
          prisma.userPreference.findUnique({ where: { userId } }),
        ]);

        // Usamos la lógica centralizada de evaluación
        const fullPayload = buildCvPayloadForEvaluation({
          sections: cvDoc?.sections,
        });

        // Filtramos según el tipo de oportunidad (Beca, Startup, etc.)
        const filtered = filterSectionsByOpportunity(fullPayload, cvDoc?.opportunityType ?? null);

        return {
          cv: cvDoc,
          filteredSections: filtered,
          opportunity: oppData ? { ...oppData, match: Number(oppData.match) } : null,
          userPrefs: prefsData
        };
      });

      if (!cv || !opportunity) {
        await prisma.queueJob.update({
          where: { id: job.id },
          data: { status: JobStatus.FAILED, lastError: "CV or Opportunity not found", finishedAt: new Date() },
        });
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: { status: JobStatus.FAILED },
        });
        return { message: "CV or Opportunity not found" };
      }

      // 3. Call Gemini to generate roadmap
      const aiResult = await step.run("generate-with-ai", async () => {
        const prompt = getPromptToGenerateRoadmap({
          opportunity: {
            title: opportunity.title,
            type: opportunity.type,
            company: opportunity.company,
            requirements: opportunity.requirements,
            match: opportunity.match,
          },
          sections: filteredSections,
          userPrefs,
        });

        return await queryGemini<RoadmapAIResponse>({ prompt, type: "JSON" });
      });

      if (!aiResult.success || !aiResult.data?.steps?.length) {
        throw new Error(`AI generation failed: ${aiResult.message}`);
      }

      // 4. Save roadmap steps
      await step.run("save-roadmap", async () => {
        // Delete old steps if any (re-generation case)
        await prisma.roadmapStep.deleteMany({ where: { roadmapId: roadmap.id } });

        const stepsData = aiResult.data!.steps.map((s, i) => ({
          roadmapId: roadmap.id,
          order: s.order || i + 1,
          title: s.title,
          description: s.description,
          actionItems: s.actionItems || [],
          estimatedDays: s.estimatedDays || null,
          resources: s.resources || [],
          isFree: i === 0, // Only first step is free
        }));

        await prisma.roadmapStep.createMany({ data: stepsData });

        // Update roadmap with title/summary + mark as SUCCEEDED
        await prisma.roadmap.update({
          where: { id: roadmap.id },
          data: {
            title: aiResult.data!.title,
            summary: aiResult.data!.summary,
            status: JobStatus.SUCCEEDED,
          },
        });
      });

      // 5. Advance route status
      await step.run("update-route", async () => {
        const route = await prisma.route.findFirst({
          where: { cvId, userId },
        });
        if (
          route &&
          (route.status === RouteStatus.OPPORTUNITIES_DONE ||
            route.status === RouteStatus.ROADMAP_PENDING)
        ) {
          await prisma.route.update({
            where: { id: route.id },
            data: { status: RouteStatus.ROADMAP_DONE },
          });
        }
      });

      // 6. Mark job as SUCCEEDED
      await prisma.queueJob.update({
        where: { id: job.id },
        data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
      });

      // Ensure final roadmap status is SUCCEEDED in the last replayed invocation.
      // Inngest can replay function execution across step boundaries and the top-level
      // upsert sets IN_PROGRESS again, so we force the terminal status here.
      await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: { status: JobStatus.SUCCEEDED },
      });

      await logsService.createLog({
        userId,
        action: LogAction.JOB,
        level: LogLevel.INFO,
        entity: "ROADMAP",
        entityId: roadmap.id,
        message: "Roadmap generated successfully",
        metadata: { cvId, opportunityId, stepsCount: aiResult.data!.steps.length },
      });

      return { success: true, roadmapId: roadmap.id, stepsCount: aiResult.data!.steps.length };
    } catch (err: any) {
      console.error("❌ Roadmap generation failed:", err);

      await prisma.roadmap.update({
        where: { id: roadmap.id },
        data: { status: JobStatus.FAILED },
      });

      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.FAILED,
          lastError: err?.message ?? "Unknown error",
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        userId,
        action: LogAction.JOB,
        level: LogLevel.ERROR,
        entity: "ROADMAP",
        entityId: roadmap.id,
        message: "Roadmap generation failed",
        metadata: { error: err?.message, cvId, opportunityId },
      });

      throw err;
    }
  },
);

