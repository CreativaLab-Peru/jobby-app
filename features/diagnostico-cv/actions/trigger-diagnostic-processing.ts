"use server";

import { inngest } from "@/inngest/functions/client";

interface TriggerDiagnosticProcessingParams {
  sessionId: string;
  cvUrl: string;
  countries: string[];
  scholarshipType: string;
  area: string;
}

export async function triggerDiagnosticProcessing(
  params: TriggerDiagnosticProcessingParams
) {
  await inngest.send({
    name: "diagnostico/cv-ready",
    data: {
      sessionId: params.sessionId,
      cvUrl: params.cvUrl,
      countries: params.countries,
      scholarshipType: params.scholarshipType,
      area: params.area,
    },
  });
}
