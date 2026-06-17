import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus, ScholarshipType } from "@prisma/client";
import { queryGemini } from "@/features/cv/queries/query-gemini";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";

export const evaluateDiagnosticCv = inngest.createFunction(
  { id: "evaluate-diagnostic-cv", name: "Evaluate Diagnostic CV" },
  { event: "diagnostico/cv-ready" },
  async ({ event, step }) => {
    const { sessionId, cvUrl, countries, scholarshipType, area } = event.data as {
      sessionId: string;
      cvUrl: string;
      countries: string[];        // country codes: ["GB", "US"]
      scholarshipType: string;    // "MASTER" | "PHD" | "FELLOWSHIP"
      area: string;
    };

    // ── Step 1: Initialize job ───────────────────────────────────────────────
    const job = await step.run("initialize-job", async () => {
      return prisma.queueJob.upsert({
        where: { jobId: event.id },
        update: { status: JobStatus.IN_PROGRESS, startedAt: new Date() },
        create: {
          jobId: event.id,
          type: "EVALUATE_DIAGNOSTIC_CV",
          payload: event.data,
          status: JobStatus.IN_PROGRESS,
          startedAt: new Date(),
        },
      });
    });

    // ── Step 2: Mark session as PROCESSING ──────────────────────────────────
    await step.run("update-session-status", async () => {
      await prisma.diagnosticSession.update({
        where: { id: sessionId },
        data: { status: "PROCESSING" },
      });
    });

    // ── Step 3: Extract CV text using the shared PDF utility ─────────────────
    // Uses the same getTextFromPdfApi already used in saveAndGetUrlOfCvAction.
    const cvText = await step.run("extract-cv-text", async () => {
      const text = await getTextFromPdfApi(cvUrl);
      if (!text || text.trim().length === 0) {
        throw new Error("No se pudo extraer texto del CV");
      }
      return text;
    });

    // ── Step 4: AI Evaluation ────────────────────────────────────────────────
    const aiResult = await step.run("ai-evaluation", async () => {
      const prompt = buildDiagnosticPrompt({ cvText, countries, scholarshipType, area });
      const response = await queryGemini({ prompt, type: "JSON" }) as {
        success: boolean;
        data: DiagnosticAiOutput;
        message?: string;
      };

      if (!response.success) {
        throw new Error(response.message || "AI evaluation failed");
      }
      return response.data;
    });

    // ── Step 5: Match opportunities ──────────────────────────────────────────
    // Filter by the selected country codes AND the chosen scholarship type.
    // Countries are passed as codes ("GB", "US") and matched via country.code.
    const matchedOpportunities = await step.run("match-opportunities", async () => {
      const opportunities = await prisma.scholarshipOpportunity.findMany({
        where: {
          isActive: true,
          type: scholarshipType as ScholarshipType,
          country: {
            code: { in: countries },
          },
        },
        include: { country: true },
        orderBy: { name: "asc" },
      });

      return opportunities.map((opp) => ({
        id: opp.id,
        name: opp.name,
        country: opp.country.name,
        flag: opp.country.flag,
        type: opp.type,
        url: opp.url,
        matchPercentage: calculateMatchPercentage(aiResult.overallScore, opp.requirements, area),
      }));
    });

    // ── Step 6: Persist result ───────────────────────────────────────────────
    await step.run("save-result", async () => {
      const session = await prisma.diagnosticSession.findUniqueOrThrow({
        where: { id: sessionId },
        select: { email: true, name: true },
      });

      await prisma.diagnosticResult.create({
        data: {
          sessionId,
          email: session.email,
          name: session.name,
          resultJson: aiResult,
          overallScore: aiResult.overallScore,
          profileType: aiResult.profileType,
          profileDescription: aiResult.profileDescription,
          recommendations: aiResult.recommendations,
          opportunities: matchedOpportunities,
        },
      });
    });

    // ── Step 7: Mark session COMPLETED ──────────────────────────────────────
    await step.run("finalize-session", async () => {
      await prisma.diagnosticSession.update({
        where: { id: sessionId },
        data: { status: "COMPLETED" },
      });
      await prisma.queueJob.update({
        where: { id: job.id },
        data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
      });
    });

    // ── Step 8: Trigger results email ────────────────────────────────────────
    await step.run("send-results-email", async () => {
      await inngest.send({
        name: "diagnostico/results-email",
        data: { sessionId },
      });
    });
  }
);

// ── Types ────────────────────────────────────────────────────────────────────

interface DiagnosticAiOutput {
  overallScore: number;
  profileType: string;
  profileDescription: string;
  recommendations: Array<{
    area: string;
    suggestion: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
  }>;
  strengths: string[];
  areasForImprovement: string[];
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function buildDiagnosticPrompt(data: {
  cvText: string;
  countries: string[];
  scholarshipType: string;
  area: string;
}): string {
  return `Eres un experto en becas internacionales para estudiantes latinoamericanos. \
Analiza el siguiente CV y proporciona un diagnóstico detallado.

CV:
${data.cvText}

Países objetivo: ${data.countries.join(", ")}
Tipo de beca: ${data.scholarshipType}
Área de experiencia: ${data.area}

Responde ÚNICAMENTE con un objeto JSON válido, sin explicaciones ni bloques de código, con este formato exacto:
{
  "overallScore": <número entero 0-100>,
  "profileType": "<perfil en español, ej: El Líder de Impacto>",
  "profileDescription": "<descripción del perfil en 2-3 oraciones>",
  "recommendations": [
    { "area": "<área>", "suggestion": "<sugerencia concreta>", "priority": "<HIGH|MEDIUM|LOW>" }
  ],
  "strengths": ["<fortaleza 1>", "<fortaleza 2>"],
  "areasForImprovement": ["<área de mejora 1>", "<área de mejora 2>"]
}`;
}

/**
 * Calculates a match percentage for an opportunity.
 *
 * Base: the AI overall score (reflects how strong the profile is).
 * Bonus: +3 points per requirement keyword that overlaps with the user's area.
 * Variance: +/- a random percentage to make scores feel dynamic.
 * Capped at 98 so no opportunity ever shows a perfect 100 unrealistically.
 */
function calculateMatchPercentage(
  overallScore: number,
  requirements: string[],
  userArea: string
): number {
  const areaLower = userArea.toLowerCase();
  const keywordBonus = requirements.filter((req) =>
    req.toLowerCase().includes(areaLower)
  ).length * 3; // 3 points per matching requirement keyword

  // 1. Definir la variación máxima permitida (ej. +/- 5 puntos)
  const maxVariance = 5;

  // 2. Generar un número aleatorio entre -maxVariance y +maxVariance
  // Math.random() genera entre 0 y 0.99
  // Multiplicamos por (5 * 2 + 1) = 11, lo que da entre 0 y 10.99
  // Math.floor lo baja a un entero entre 0 y 10
  // Restamos maxVariance (5), resultando en un rango de -5 a +5
  const randomVariance = Math.floor(Math.random() * (maxVariance * 2 + 1)) - maxVariance;

  // 3. Sumar el score, el bono y la variación aleatoria
  const rawScore = overallScore + keywordBonus + randomVariance;

  // 4. Limitar el resultado final entre 10 y 98
  return Math.min(98, Math.max(10, Math.round(rawScore)));
}
