"use server";

import { prisma } from "@/lib/prisma";
import { CREDIT_PACKS, CreditPackOffer } from "@/features/credits/consts";

export const getCreditPackOffers = async (): Promise<CreditPackOffer[]> => {
  try {
    const slugs = CREDIT_PACKS.map((pack) => pack.id.toLowerCase());

    const plans = await prisma.paymentPlan.findMany({
      where: {
        slug: {
          in: slugs,
        },
      },
      select: {
        id: true,
        slug: true,
        priceCentsPEN: true,
        manualCvLimit: true,
        creditPackages: {
          where: {
            active: true,
          },
          select: {
            type: true,
            credits: true,
          },
        },
      },
    });

    const planBySlug = new Map(
      plans.map((plan) => [plan.slug.toLowerCase(), plan])
    );

    return CREDIT_PACKS.map((pack) => ({
      ...pack,
      ...(buildOfferFromPlan(pack, planBySlug.get(pack.id.toLowerCase()))),
    }));
  } catch (error) {
    console.error("[ERROR_GET_CREDIT_PACK_OFFERS]", error);
    return CREDIT_PACKS;
  }
};

const buildOfferFromPlan = (
  basePack: CreditPackOffer,
  plan?: {
    priceCentsPEN: unknown;
    manualCvLimit: number;
    creditPackages: Array<{ type: string; credits: number }>;
  }
) => {
  if (!plan) return {};

  const manageCvsLimit =
    getCreditsByType(plan.creditPackages, "MANAGE_CVS") ?? plan.manualCvLimit ?? basePack.limits.manageCvsLimit;
  const aiActionsLimit =
    getCreditsByType(plan.creditPackages, "AI_ACTIONS") ?? basePack.limits.aiActionsLimit;
  const opportunitiesActionsLimit =
    getCreditsByType(plan.creditPackages, "SEARCH_OPPORTUNITIES") ?? basePack.limits.opportunitiesActionsLimit;

  const dynamicLimits = {
    manageCvsLimit,
    aiActionsLimit,
    opportunitiesActionsLimit,
  };

  return {
    price: Number(plan.priceCentsPEN) / 100,
    limits: dynamicLimits,
    features: basePack.features.map((feature) => {
      if (/hasta\s+\d+\s+cvs\s+guardados/i.test(feature.text)) {
        return { ...feature, text: `Hasta ${dynamicLimits.manageCvsLimit} CVs guardados` };
      }

      if (/(máximo|hasta)\s+\d+\s+oportunidades/i.test(feature.text)) {
        return { ...feature, text: `Hasta ${dynamicLimits.opportunitiesActionsLimit} oportunidades` };
      }

      return feature;
    }),
  };
};

const getCreditsByType = (
  packages: Array<{ type: string; credits: number }>,
  type: string
) => {
  return packages.find((creditPackage) => creditPackage.type === type)?.credits;
};
