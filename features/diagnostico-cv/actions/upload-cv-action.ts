"use server";

import { createCvFromPdfAction } from "@/features/cv/actions/create-cv-from-pdf";

/**
 * Uploads the CV PDF and returns the resulting cvUrl.
 * Wraps createCvFromPdfAction so the client never calls it directly.
 */
export async function uploadCvAction(formData: FormData): Promise<string> {
  const result = await createCvFromPdfAction(formData);

  if (!result?.cvUrl) {
    throw new Error("CV upload failed: no URL returned");
  }

  return result.cvUrl;
}
