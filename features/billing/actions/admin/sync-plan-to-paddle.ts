import { prisma } from "@/lib/prisma";
import { paddle } from "@/features/billing/domain/paddle-client";

interface SyncPlanToPaddleInput {
  planId: string;
  slug: string;
  name: string;
  description?: string | null;
  priceCentsUSD: number;
  paddleProductId?: string | null;
}

interface SyncPlanToPaddleResult {
  paddleProductId: string;
  paddlePriceIdUSD: string;
}

export const syncPlanToPaddle = async (
  input: SyncPlanToPaddleInput
): Promise<SyncPlanToPaddleResult | null> => {
  const amount = Math.round(Number(input.priceCentsUSD) || 0);
  if (amount <= 0) {
    return null;
  }

  let paddleProductId = input.paddleProductId ?? null;

  if (!paddleProductId) {
    const product = await paddle.products.create({
      name: input.name,
      description: input.description?.trim() || null,
      taxCategory: "standard",
      customData: {
        planId: input.planId,
        slug: input.slug,
      },
    });

    paddleProductId = product.id;
  }

  let price;
  try {
    price = await paddle.prices.create({
      productId: paddleProductId,
      description: input.description?.trim() || `Precio de ${input.name}`,
      unitPrice: {
        amount: String(amount),
        currencyCode: "USD",
      },
      taxMode: "account_setting",
    });
  } catch (error) {
    const paddleError = error as { code?: string };

    if (paddleError?.code !== "entity_archived") {
      throw error;
    }

    const newProduct = await paddle.products.create({
      name: input.name,
      description: input.description?.trim() || null,
      taxCategory: "standard",
      customData: {
        planId: input.planId,
        slug: input.slug,
      },
    });

    paddleProductId = newProduct.id;

    price = await paddle.prices.create({
      productId: paddleProductId,
      description: input.description?.trim() || `Precio de ${input.name}`,
      unitPrice: {
        amount: String(amount),
        currencyCode: "USD",
      },
      taxMode: "account_setting",
    });
  }

  await prisma.paymentPlan.update({
    where: { id: input.planId },
    data: {
      paddleProductId,
      paddlePriceIdUSD: price.id,
    },
  });

  return {
    paddleProductId,
    paddlePriceIdUSD: price.id,
  };
};