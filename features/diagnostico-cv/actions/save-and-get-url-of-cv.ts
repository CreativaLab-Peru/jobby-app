"use server";

import { v4 as uuidv4 } from "uuid";
import { savePdf } from "@/features/upload-cv/actions/save-pdf";
import { detectCv } from "@/features/cv/actions/verify-cv";
import { getTextFromPdfApi } from "@/utils/get-text-from-pdf-api";

export async function saveAndGetUrlOfCvAction(formData: FormData) {
  try {
    const file = formData.get("pdf") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `CV-${uuidv4()}-${file.name}`;
    const { error: uploadError, url } = await savePdf(file, { buffer, fileName });

    if (uploadError) return { error: uploadError, success: false };

    const textFromPdf = await getTextFromPdfApi(url);
    const detection = detectCv(textFromPdf);
    if (!detection.isCv) {
      return { error: "El archivo no parece ser un CV válido.", success: false };
    }

    return { success: true, cvUrl: url };
  } catch (err) {
    console.error("[ERROR_CREATE_CV_FROM_PDF]", err);
    return { error: "No se pudo agregar tu CV", success: false };
  }
}
