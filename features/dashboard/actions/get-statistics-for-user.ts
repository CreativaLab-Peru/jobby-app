import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import {
  CvEvaluation,
  Opportunity,
  Recommendation,
  UserPayment,
  PaymentPlan
} from "@prisma/client";

// Definimos un tipo que transforme el Decimal de Prisma en un number para el cliente
export type DashboardStats = {
  latestEvaluation: (CvEvaluation & {
    recommendations: Recommendation[]
  }) | null;
  topOpportunities: (Omit<Opportunity, 'match'> & { match: number })[];
  subscription: (UserPayment & {
    plan: PaymentPlan
  }) | null;
  totalCvs: number;
  userSector: string | null;
};

export const getStatisticsForUser = async (): Promise<DashboardStats | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const latestEvaluation = await prisma.cvEvaluation.findFirst({
      where: { cv: { userId: currentUser.id } },
      orderBy: { createdAt: "desc" },
      include: {
        recommendations: {
          take: 3,
          orderBy: { createdAt: "desc" }
        }
      }
    });

    const topOpportunitiesRaw = await prisma.opportunity.findMany({
      where: { cv: { userId: currentUser.id } },
      orderBy: [
        { match: "desc" },
        { createdAt: "desc" }
      ],
      take: 4
    });

    // CORRECCIÓN: Mapeamos para convertir Decimal a Number
    const topOpportunities = topOpportunitiesRaw.map(opt => ({
      ...opt,
      match: Number(opt.match) // Convertimos el objeto Decimal a número plano
    }));

    const subscription = await prisma.userPayment.findFirst({
      where: { userId: currentUser.id, active: true },
      include: { plan: true },
      orderBy: { createdAt: "desc" }
    });

    const totalCvs = await prisma.cv.count({
      where: { userId: currentUser.id, deletedAt: null }
    });

    const lastCv = await prisma.cv.findFirst({
      where: { userId: currentUser.id },
      orderBy: { updatedAt: "desc" },
      select: { cvType: true }
    });

    // IMPORTANTE: Estructuramos el retorno explícitamente
    // para asegurar que todo sea serializable.
    return JSON.parse(JSON.stringify({
      latestEvaluation,
      topOpportunities,
      subscription,
      totalCvs,
      userSector: lastCv?.cvType || null,
    }));

  } catch (error) {
    console.error("[ERROR_GET_DASHBOARD_STATS]", error);
    return null;
  }
};
