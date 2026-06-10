"use server"

import { prisma } from "@/lib/prisma";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";

export const createDiagnosticSession = async (email: string, name: string) => {
  try {
    const token = generateMagicLinkToken(32);
    const hashedToken = hashMagicLinkToken(token);

    const session = await prisma.diagnosticSession.create({
      data: {
        token: hashedToken,
        email: email.toLowerCase(),
        name,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return {
      success: true,
      session,
      rawToken: token, // Return raw token to send via email (hashed is stored)
    };
  } catch (error) {
    console.error("[ERROR_CREATE_DIAGNOSTIC_SESSION]", error);
    return {
      success: false,
      error: "Ha ocurrido un error al crear la sesion",
    };
  }
};
