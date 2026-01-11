import { getSession } from "@/features/authentication/actions/get-session";
import { prisma } from "@/lib/prisma";

export type CreditsOfPlan = {
  totalCredits: number,
  usedCredits: number
}

export const getAvailableTokens = async (): Promise<CreditsOfPlan | undefined> => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return;
    }

    const userId = session.user.id;

    const userPayments = await prisma.userPayment.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      include: { plan: true },
    });

    // --- usados ---
    const totalManualUsed = userPayments.reduce(
      (acc, item) => acc + (item.manualCvsUsed || 0),
      0
    );

    const totalUploadUsed = userPayments.reduce(
      (acc, item) => acc + (item.uploadCvsUsed || 0),
      0
    );

    // --- disponibles ---
    const totalAvailableManual = userPayments.reduce(
      (acc, item) => acc + (item.plan.manualCvLimit || 0),
      0
    );

    const totalAvailableUpload = userPayments.reduce(
      (acc, item) => acc + (item.plan.uploadCvLimit || 0),
      0
    );

    // --- conversión a créditos ---
    const totalCredits =
      totalAvailableManual + totalAvailableUpload * 2;

    const usedCredits =
      totalManualUsed + totalUploadUsed * 2;

    return {
      totalCredits,
      usedCredits,
    };

  } catch (error) {
    console.error("[ERROR_GET_AVAILABLE_CREDITS]", error);
    return;
  }
};
