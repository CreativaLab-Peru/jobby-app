"use server";

import { prisma } from "@/lib/prisma";
import { savePdf } from "@/features/upload-cv/actions/save-pdf";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";
import { detectCv } from "@/features/cv/actions/verify-cv"; // Tu función detectCv
import { inngest } from "@/inngest/functions/client";
import { v4 as uuidv4 } from "uuid";
import { JobStatus } from "@prisma/client";

export async function evaluateCvAction(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { error: "No se proporcionó ningún archivo." };

    // 1. Persistencia física del PDF (Siguiendo tu patrón)
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `TEMP-EVAL-${uuidv4()}-${file.name}`;
    const { error: uploadError, url } = await savePdf(file, { buffer, fileName });

    if (uploadError) return { error: uploadError };

    // 2. Extracción de texto básica para validación inmediata
    const textFromPdf = await getTextFromPdfApi(url);
    if (!textFromPdf) return { error: "No se pudo leer el contenido del PDF." };

    // 3. Validación Heurística (Tu algoritmo detectCv)
    const evaluation = detectCv(textFromPdf);

    if (!evaluation.isCv) {
      return {
        error: "El archivo no parece ser un CV válido.",
        score: evaluation.score
      };
    }

    // 4. Crear registro en TempCvWithEvaluation
    // Guardamos el score heurístico como 'overallScore' inicial
    const tempCv = await prisma.tempCvWithEvaluation.create({
      data: {
        status: JobStatus.PENDING,
        overallScore: evaluation.score * 100, // Convertimos 0.85 a 85
        fileUrl: url,
        extractorOutput: {
          fileName: file.name,
          fileUrl: url,
          initialHeuristicScore: evaluation.score,
          rawTextPreview: textFromPdf.substring(0, 2000), // Para que la IA no re-extraiga si no es necesario
        },
      },
    });

    // 5. Disparar proceso de IA para análisis profundo
    await inngest.send({
      name: "cv/evaluate-temp",
      data: {
        tempCvId: tempCv.id,
        fileUrl: url,
        rawText: textFromPdf
      },
    });

    return { success: true, id: tempCv.id, initialScore: evaluation.score * 100 };

  } catch (err) {
    console.error("[ERROR_EVALUATE_CV_ACTION]", err);
    return { error: "Error interno al procesar el análisis." };
  }
}
