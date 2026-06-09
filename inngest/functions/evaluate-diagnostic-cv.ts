import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { queryGemini } from "@/features/cv/queries/query-gemini";

export const evaluateDiagnosticCv = inngest.createFunction(
  { id: "evaluate-diagnostic-cv", name: "Evaluate Diagnostic CV" },
  { event: "diagnostico/cv-ready" },
  async ({ event, step }) => {
    const { sessionId, cvUrl, countries, scholarshipType, area } = event.data;

    // Step 1: Initialize job
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

    // Step 2: Update session status to PROCESSING
    await step.run("update-session-status", async () => {
      await prisma.diagnosticSession.update({
        where: { id: sessionId },
        data: { status: "PROCESSING" as const },
      });
    });

    // Step 3: Download and extract CV text
    const cvText = await step.run("extract-cv-text", async () => {
      try {
        const response = await fetch(cvUrl);
        const arrayBuffer = await response.arrayBuffer();

        // Use a PDF text extraction approach
        // For now, return a placeholder - in production, use a proper PDF parser
        const text = await extractTextFromPDF(arrayBuffer);
        return text;
      } catch (error) {
        console.error("[ERROR_EXTRACT_CV_TEXT]", error);
        throw new Error("Failed to extract text from CV");
      }
    });

    // Step 4: AI Evaluation
    const aiResult = await step.run("ai-evaluation", async () => {
      const prompt = buildDiagnosticPrompt({
        cvText,
        countries,
        scholarshipType,
        area,
      });

      const response = await queryGemini({ prompt, type: "JSON" });
      return response as { success: boolean; data: any; message?: string };
    });

    if (!aiResult.success) {
      throw new Error(aiResult.message || "AI evaluation failed");
    }

    // Step 5: Match opportunities
    const matchedOpportunities = await step.run("match-opportunities", async () => {
      const opportunities = await prisma.scholarshipOpportunity.findMany({
        where: {
          country: { code: { in: countries } },
          type: scholarshipType,
          isActive: true,
        },
        include: { country: true },
      });

      // Calculate match percentages based on AI result
      return opportunities.map((opp) => ({
        id: opp.id,
        name: opp.name,
        country: opp.country.name,
        flag: opp.country.flag,
        type: opp.type,
        url: opp.url,
        matchPercentage: calculateMatchPercentage(aiResult.data, opp),
      }));
    });

    // Step 6: Save result
    await step.run("save-result", async () => {
      const session = await prisma.diagnosticSession.findUnique({
        where: { id: sessionId },
      });

      await prisma.diagnosticResult.create({
        data: {
          sessionId,
          email: session?.email || "",
          name: session?.name || null,
          resultJson: aiResult.data as any,
          overallScore: aiResult.data.overallScore,
          profileType: aiResult.data.profileType,
          profileDescription: aiResult.data.profileDescription,
          recommendations: aiResult.data.recommendations as any,
          opportunities: matchedOpportunities as any,
        },
      });
    });

    // Step 7: Update session status
    await step.run("finalize-session", async () => {
      await prisma.diagnosticSession.update({
        where: { id: sessionId },
        data: { status: "COMPLETED" as const },
      });

      await prisma.queueJob.update({
        where: { id: job.id },
        data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
      });
    });

    // Step 8: Send results email
    await step.run("send-results-email", async () => {
      await inngest.send({
        name: "diagnostico/results-email",
        data: { sessionId },
      });
    });
  }
);

// Helper functions
async function extractTextFromPDF(arrayBuffer: ArrayBuffer): Promise<string> {
  // In production, use a proper PDF parser like pdf-parse or pdf.js
  // For now, return a placeholder
  const bytes = new Uint8Array(arrayBuffer);
  const text = bytes.reduce((str, byte) => str + String.fromCharCode(byte), "");
  return text.replace(/[^\x20-\x7E\n]/g, "").substring(0, 50000);
}

function buildDiagnosticPrompt(data: {
  cvText: string;
  countries: string[];
  scholarshipType: string;
  area: string;
}): string {
  return `Eres un experto en becas internacionales. Analiza el siguiente CV y proporciona un diagnostico detallado.

CV:
${data.cvText}

Paises objetivo: ${data.countries.join(", ")}
Tipo de beca: ${data.scholarshipType}
Area de experiencia: ${data.area}

Responde en JSON con el siguiente formato:
{
  "overallScore": numero0-100,
  "profileType": "string (ej: El Lider de Impacto, El Investigador Global, etc)",
  "profileDescription": "string con descripcion del perfil",
  "recommendations": [
    {
      "area": "string",
      "suggestion": "string",
      "priority": "HIGH|MEDIUM|LOW"
    }
  ],
  "strengths": ["string"],
  "areasForImprovement": ["string"]
}`;
}

function calculateMatchPercentage(aiResult: any, opportunity: any): number {
  // Simple matching algorithm based on profile
  let baseScore = aiResult.overallScore || 50;

  // Adjust based on scholarship type match
  if (opportunity.type === aiResult.scholarshipType) {
    baseScore += 10;
  }

  // Adjust based on area match
  if (aiResult.area && opportunity.requirements.some((req: string) =>
    req.toLowerCase().includes(aiResult.area.toLowerCase())
  )) {
    baseScore += 15;
  }

  return Math.min(100, Math.max(0, baseScore));
}
