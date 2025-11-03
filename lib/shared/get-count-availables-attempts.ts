import { getSession } from "@/lib/shared/session";
import { prisma } from "@/lib/prisma";

export type LimitOfPlan = {
  cvCreations: {
    used: number,
    total: number,
  },
  scoreAnalysis: {
    used: number,
    total: number
  }
}

export const getLimitPlanOfCurrentUser = async (): Promise<LimitOfPlan> => {
  try {
    const session = await getSession();
    if (!session?.user?.email) {
      return;
    }

    const userId = session.user.id;
    const userPayments = await prisma.userPayment.findMany({
      where: {
        userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        plan: true,
      }
    });

    const totalManualCvsUsed = userPayments.reduce(
      (acc, item) => acc + (item.manualCvsUsed || 0),
      0
    );
    const totalUploadCvUsed = userPayments.reduce(
      (acc, item) => acc + (item.uploadCvsUsed || 0),
      0
    );

    const totalAvailableManualCv = userPayments.reduce(
      (acc, item) => acc + (item.plan.manualCvLimit || 0),
      0
    )
    const totalAvailableUploadCv = userPayments.reduce(
      (acc, item) => acc + (item.plan.uploadCvLimit || 0),
      0
    )
    return {
      cvCreations: {
        used: totalManualCvsUsed,
        total: totalAvailableManualCv,
      },
      scoreAnalysis: {
        used: totalUploadCvUsed,
        total: totalAvailableUploadCv
      }
    }
  } catch (error) {
    console.error("[ERROR_GET_AVAILABLE_ATTEMPTS]", error);
    return;
  }
}