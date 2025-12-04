'use server'

import { prisma } from "@/lib/prisma";
import {hashMagicLinkToken} from "@/utils/magic-links";
import {OnboardingData} from "@/features/onboarding/components/onboarding-flow";

export async function finishOnboarding(data: OnboardingData): Promise<{success: boolean; error?: string, data?: {email: string; password: string} | null}> {
  try {
    const {token, acceptedTerms} = data;
    if (!token) {
      return {success: false, error: "token required"};
    }

    const hashed = hashMagicLinkToken(token);
    const record = await prisma.magicLinkToken.findFirst({
      where: {
        tokenHash: hashed,
      },
      include: {
        user: true
      }
    });
    console.log("[record]:", record);

    if (!record) {
      return {success: false, error: "invalid or expired token"};
    }
     await prisma.user.update({
      where: {id: record.userId},
      data: {
        acceptedTermsAndConditions: acceptedTerms,
        emailVerified: true,
      },
    });
    await prisma.magicLinkToken.update({
      where: {id: record.id},
      data: {
        usedAt: new Date(),
      },
    });
    return {success: true };
  } catch (e) {
    console.error("[ERROR_FINISHING_ONBOARDING]:", e);
    return {success: false, error: "internal server error"};
  }
}
