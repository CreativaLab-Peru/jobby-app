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
        slug: true,
        priceCentsPEN: true,
      },
    });

    const priceBySlug = new Map(
      plans.map((plan) => [plan.slug.toLowerCase(), Number(plan.priceCentsPEN) / 100])
    );

    return CREDIT_PACKS.map((pack) => ({
      ...pack,
      price: priceBySlug.get(pack.id.toLowerCase()) ?? pack.price,
    }));
  } catch (error) {
    console.error("[ERROR_GET_CREDIT_PACK_OFFERS]", error);
    return CREDIT_PACKS;
  }
};
