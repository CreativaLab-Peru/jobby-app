"use server"

import { prisma } from "@/lib/prisma";
import { hashMagicLinkToken } from "@/utils/magic-links";

export const getDiagnosticSession = async (token: string) => {
  try {
    const hashedToken = hashMagicLinkToken(token);

    const session = await prisma.diagnosticSession.findUnique({
      where: { token: hashedToken },
      include: { result: true },
    });

    if (!session) {
      return { success: false, error: "Sesion no encontrada" };
    }

    if (new Date() > session.expiresAt) {
      return { success: false, error: "El enlace ha expirado" };
    }

    return { success: true, session };
  } catch (error) {
    console.error("[ERROR_GET_DIAGNOSTIC_SESSION]", error);
    return {
      success: false,
      error: "Ha ocurrido un error al obtener la sesion",
    };
  }
};
