"use server";

import { prisma } from "@/lib/prisma";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";

export async function createDiagnosticSessionAction(email: string, name: string) {

  // Create or find temporal user
  let temporalUser = await prisma.temporalUser.findUnique({
    where: {email: email.toLowerCase()},
  });

  if (!temporalUser) {
    temporalUser = await prisma.temporalUser.create({
      data: {
        email: email.toLowerCase(),
        name,
      },
    });
  }

  const token = generateMagicLinkToken(32);
  const hashedToken = hashMagicLinkToken(token);

  const session = await prisma.diagnosticSession.create({
    data: {
      token: hashedToken,
      email,
      name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  return { sessionId: session.id, token };
}
