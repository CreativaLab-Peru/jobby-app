import {inngest} from "./client";
import {prisma} from "@/lib/prisma";
import {JobStatus} from "@prisma/client";
import {queryGemini} from "@/features/cv/queries/query-gemini";

export const processTempCvEvaluation = inngest.createFunction(
  {id: "process-temp-cv-evaluation", name: "Análisis de CV Temporal"},
  {event: "cv/evaluate-temp"},
  async ({event, step}) => {
    const {tempCvId, rawText} = event.data;

    try {
      // 1. Marcamos inicio de procesamiento
      await step.run("update-status-ingest", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: {id: tempCvId},
          data: {status: JobStatus.IN_PROGRESS},
        });
      });

      // 2. Ejecución de Gemini con el Schema solicitado + Scoring
      const aiResult = await step.run("ai-extraction-and-scoring", async () => {
        const prompt = `
          You are an **AI Senior Recruiter and CV Auditor**.
          Extract information and provide a strategic evaluation.

          ---
          ### Input (raw CV text)
          ${rawText}

          ---
          ### Output JSON Schema
          Return ONLY a valid JSON object:
          {
            "opportunityType": "SCHOLARSHIP",
            "language": "EN | ES",
            "cvType": "TECHNOLOGY_ENGINEERING | DESIGN_CREATIVITY | MARKETING_STRATEGY | MANAGEMENT_BUSINESS | FINANCE_PROJECTS | SOCIAL_MEDIA | EDUCATION | SCIENCE",
            "overallScore": (number 0-100),
            "whichSectionsContain": [],  // Populate this array with one or more of the following tags: "EXPERIENCE|EDUCATION|SKILLS|PROJECTS|VOLUNTEERING|CERTIFICATIONS|LANGUAGES|CONTACT|COMPLEMENTS|ACHIEVEMENTS|INTERESTS" The tags MUST be in the EXACT order they appear in the CV (from top to bottom, left to right).
            "evaluation": {
              "summary": "Insight de perfil: Debe ser un análisis de alto impacto en español (ej: 'Tu perfil posee un X% de transferencia...'). Máximo 2 frases.",
              "strengths": ["string" (in spanish)],
              "weaknesses": ["Área de mejora crítica: Identifica el error principal (ej: fechas post-datadas) y su impacto en el score."],
              "improvementRoadmap": ["step 1", "step 2" (in spanish)]
            }
          }

          ---
          ### Specific Instructions for High-Value Content:
          1. **For 'summary'**: Do not just summarize. Act as a strategic consultant. Mention the "Top %" positioning of the candidate and their skill transferability to international ecosystems.
          2. **For 'weaknesses[0]'**: This is the 'Área de Mejora' highlight. If you detect post-dated years (e.g., 2025/2026) in experience or education that doesn't clearly state "Projected" or "Present", flag it as a "Red Flag" of integrity and explain that it reduces the score.
          3. **Integrity Check**: Penalize the 'overallScore' significantly if there are chronological inconsistencies.
        `;

        const result = await queryGemini({prompt, type: "JSON"});
        if (!result.success) throw new Error(result.message || "Gemini Error");

        return result.data;
      });

      // 3. Persistencia Final en la tabla Temp
      await step.run("save-final-evaluation", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: {id: tempCvId},
          data: {
            status: JobStatus.SUCCEEDED,
            overallScore: aiResult.overallScore || 0,
            extractorOutput: aiResult,
          },
        });
      });

    } catch (err: any) {
      // Todo: test
      await step.run("mark-as-failed", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: {id: tempCvId},
          data: {
            status: JobStatus.FAILED,
            extractorOutput: {error: err.message}
          },
        });
      });
      throw err;
    }
  }
);
