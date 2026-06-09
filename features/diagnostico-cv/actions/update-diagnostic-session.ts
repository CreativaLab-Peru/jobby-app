"use server"

import { prisma } from "@/lib/prisma";
import { DiagnosticStatus, ScholarshipType } from "@prisma/client";

export const updateDiagnosticSession = async (
  token: string,
  data: {
    status?: DiagnosticStatus;
    countries?: string[];
    scholarshipType?: ScholarshipType;
    area?: string;
    cvUrl?: string;
  }
) => {
  try {
    const session = await prisma.diagnosticSession.findUnique({
      where: { token },
    });

    if (!session) {
      return { success: false, error: "Sesion no encontrada" };
    }

    const updated = await prisma.diagnosticSession.update({
      where: { id: session.id },
      data: {
        ...(data.status && { status: data.status }),
        ...(data.countries && { countries: data.countries }),
        ...(data.scholarshipType && { scholarshipType: data.scholarshipType }),
        ...(data.area && { area: data.area }),
        ...(data.cvUrl && { cvUrl: data.cvUrl }),
      },
    });

    return { success: true, session: updated };
  } catch (error) {
    console.error("[ERROR_UPDATE_DIAGNOSTIC_SESSION]", error);
    return {
      success: false,
      error: "Ha ocurrido un error al actualizar la sesion",
    };
  }
};
