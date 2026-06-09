"use server"

import { prisma } from "@/lib/prisma";

export const saveDiagnosticResult = async (
  sessionId: string,
  data: {
    resultJson: object;
    overallScore?: number;
    profileType?: string;
    profileDescription?: string;
    recommendations?: object[];
    opportunities?: object[];
  }
) => {
  try {
    const result = await prisma.diagnosticResult.create({
      data: {
        sessionId,
        email: "", // Will be filled from session
        resultJson: data.resultJson as any,
        overallScore: data.overallScore,
        profileType: data.profileType,
        profileDescription: data.profileDescription,
        recommendations: data.recommendations as any,
        opportunities: data.opportunities as any,
      },
    });

    // Update session status
    await prisma.diagnosticSession.update({
      where: { id: sessionId },
      data: { status: "COMPLETED" as const },
    });

    return { success: true, result };
  } catch (error) {
    console.error("[ERROR_SAVE_DIAGNOSTIC_RESULT]", error);
    return {
      success: false,
      error: "Ha ocurrido un error al guardar el resultado",
    };
  }
};
