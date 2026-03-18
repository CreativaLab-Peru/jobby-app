"use server";

import { prisma } from "@/lib/prisma";
import { CREDIT_PACKS, CreditPackOffer } from "@/features/credits/consts";
import { Prisma } from "@prisma/client";

type NumericLike = number | string | { toNumber?: () => number };

type PlanOfferProjection = {
  name: string;
  priceCentsPEN: NumericLike;
  manualCvLimit: number;
  features: Prisma.JsonValue | null;
  creditPackages: Array<{ type: string; credits: number }>;
};

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
        name: true,
        priceCentsPEN: true,
        manualCvLimit: true,
        features: true,
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
  plan?: PlanOfferProjection
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
    name: plan.name || basePack.name,
    price: toNumber(plan.priceCentsPEN) / 100,
    limits: dynamicLimits,
    features: getPlanFeatureItems(plan.features).length
      ? getPlanFeatureItems(plan.features).map((text) => ({ text, included: true }))
      : basePack.features.map((feature) => {
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

const toNumber = (value: NumericLike): number => {
  if (typeof value === "number") return value;
  if (typeof value === "string") return Number(value);
  return value.toNumber?.() ?? Number(value);
};

const getPlanFeatureItems = (features: PlanOfferProjection["features"]): string[] => {
  if (!features || typeof features !== "object" || Array.isArray(features)) {
    return [];
  }

  const featureRecord = features as Record<string, Prisma.JsonValue>;
  const rawItems = Array.isArray(featureRecord.items)
    ? featureRecord.items
    : Array.isArray(featureRecord.caracteristics)
      ? featureRecord.caracteristics
      : [];

  return rawItems
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter(Boolean);
};
