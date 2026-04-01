import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { JobStatus } from "@prisma/client";
import { queryGemini } from "@/features/cv/queries/query-gemini";

export const processTempCvEvaluation = inngest.createFunction(
  { id: "process-temp-cv-evaluation", name: "Análisis de CV Temporal" },
  { event: "cv/evaluate-temp" },
  async ({ event, step }) => {
    const { tempCvId, rawText } = event.data;

    try {
      // 1. Marcamos inicio de procesamiento
      await step.run("update-status-ingest", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: { id: tempCvId },
          data: { status: JobStatus.IN_PROGRESS },
        });
      });

      // 2. Ejecución de Gemini con el Schema solicitado + Scoring
      const aiResult = await step.run("ai-extraction-and-scoring", async () => {
        const prompt = `
          You are an **AI Senior Recruiter and CV Auditor**.
          Extract the information from the CV text and provide a professional evaluation.

          ---
          ### Input (raw CV text)
          ${rawText}

          ---
          ### Output JSON Schema
          Return ONLY a valid JSON object with this exact structure:
          {
            "opportunityType": "INTERNSHIP | SCHOLARSHIP | EXCHANGE_PROGRAM | EMPLOYMENT | STARTUP",
            "language": "EN | ES",
            "cvType": "TECHNOLOGY_ENGINEERING | DESIGN_CREATIVITY | MARKETING_STRATEGY | MANAGEMENT_BUSINESS | FINANCE_PROJECTS | SOCIAL_MEDIA | EDUCATION | SCIENCE",
            "overallScore": (number 0-100),
            "sections": [
              {
                "sectionType": "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | LANGUAGES | CONTACT",
                "title": "string",
                "contentJson": {} // Object or Array of objects depending on the sectionType
              }
            ],
            "evaluation": {
              "summary": "Professional overview of the profile in spanish",
              "strengths": ["string" (in spanish)],
              "weaknesses": ["string" (in spanish)],
              "improvementRoadmap": ["step 1", "step 2" (in spanish)]
            }
          }

         ---
### Detailed extraction rules
1. **Section Selection**: We need all found out.
2. **sectionType** must match exactly: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, VOLUNTEERING, CERTIFICATIONS, LANGUAGES, CONTACT, COMPLEMENTS, ACHIEVEMENTS, INTERESTS.
3. **contentJson** structures:
   - EXPERIENCE → [{ position, company, location, duration, responsibilities(string) }]
   - EDUCATION → [{ level, title, institution, location, year, honors? }]
   - SKILLS → { soft: string[], languages: string[], technical: string[] }
   - PROJECTS → [{ title?, duration, description, technologies? }]
   - CERTIFICATIONS → [{ name, issuer?, year? }]
   - LANGUAGES → [{ language, proficiency }]
   - CONTACT → { fullName?, email?, phone?, linkedin?, address?, summary? }
   - SUMMARY → { text }
   - VOLUNTEERING → [{ organization?, position?, duration?, responsibilities? }]
4. Dates: Use ISO format "YYYY-MM" (e.g., "2023-05"). Use "Present" if applicable.
5. Formatting: Escape special characters. Replace newlines with spaces.
6. Validation: Ensure every opening brace has a closing one and strings are properly quoted.
---
### Example output
{"opportunityType":"EMPLOYMENT","language":"ES","cvType":"TECHNOLOGY_ENGINEERING","sections":[{"sectionType":"SUMMARY","title":"Resumen Profesional","contentJson":{"text":"Ingeniero de Software con experiencia en React."}}]}
        `;

        const result = await queryGemini({ prompt, type: "JSON" });
        if (!result.success) throw new Error(result.message || "Gemini Error");

        return result.data;
      });

      // 3. Persistencia Final en la tabla Temp
      await step.run("save-final-evaluation", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: { id: tempCvId },
          data: {
            status: JobStatus.SUCCEEDED,
            overallScore: aiResult.overallScore || 0,
            // Guardamos el objeto completo (Opportunity, Sections, Evaluation) en el JSONB
            extractorOutput: aiResult,
          },
        });
      });

    } catch (err: any) {
      await step.run("mark-as-failed", async () => {
        await prisma.tempCvWithEvaluation.update({
          where: { id: tempCvId },
          data: {
            status: JobStatus.FAILED,
            extractorOutput: { error: err.message }
          },
        });
      });
      throw err;
    }
  }
);
