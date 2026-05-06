import { PaymentType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    await prisma.appConfig.upsert({
      where: { key: "INTERVIEW_DURATION" },
      update: {
        value: "180",
      },
      create: {
        key: "INTERVIEW_DURATION",
        value: "180", // 3 minutes in seconds for fallback
      },
    });

    // Seed payment plans
    await prisma.paymentPlan.upsert({
      where: { slug: "free" },
      update: {
        name: "FREE",
        description: "Plan gratuito",
        paymentType: PaymentType.FREE,
        priceCentsPEN: 0.0,
        priceCentsUSD: 0.0,
        manualCvLimit: 2,
        uploadCvLimit: 0,
      },
      create: {
        id: "d79cafea-beef-4037-a874-bf0e8e04d4e9",
        slug: "free",
        name: "FREE",
        description: "Plan gratuito",
        paymentType: PaymentType.FREE,
        priceCentsPEN: 0.0,
        priceCentsUSD: 0.0,
        features: {
          caracteristics: [
            "Limited to 3 manual CV analyses",
            "Limited to 2 CV uploads",
            "Basic support",
          ],
        },
        manualCvLimit: 2,
        uploadCvLimit: 0,
      },
    });

    await prisma.paymentPlan.upsert({
      where: { slug: "starter" },
      update: {
        name: "Starter",
        description: "Acceso al plan starter",
        paymentType: PaymentType.ONE_TIME,
        priceCentsPEN: 1990,
        priceCentsUSD: 600,
        manualCvLimit: 5,
        uploadCvLimit: 5,
      },
      create: {
        id: "80e43cda-65d2-4a6c-b627-b5c397915b1b",
        slug: "starter",
        name: "Starter",
        description: "Acceso al plan starter",
        paymentType: PaymentType.ONE_TIME,
        priceCentsPEN: 1990,
        priceCentsUSD: 600,
        features: {
          caracteristics: [
            "Creacion de hasta 5 cv's",
            "Analisis de CV hasta 5 cv's",
            "Recomendaciones por seccion",
          ],
        },
        manualCvLimit: 5,
        uploadCvLimit: 5,
      },
    });

    await prisma.paymentPlan.upsert({
      where: { slug: "pro" },
      update: {
        name: "Pro",
        description: "Acceso al plan pro",
        paymentType: PaymentType.ONE_TIME,
        priceCentsPEN: 2990,
        priceCentsUSD: 900,
        manualCvLimit: 5,
        uploadCvLimit: 5,
      },
      create: {
        id: "bc90d6e5-145b-404c-b9c8-ef670efbce4d",
        slug: "pro",
        name: "Pro",
        description: "Acceso al plan pro",
        paymentType: PaymentType.ONE_TIME,
        priceCentsPEN: 2990,
        priceCentsUSD: 900,
        features: {
          caracteristics: [
            "Creacion de hasta 5 cv's",
            "Analisis de CV hasta 5 cv's",
            "Recomendaciones por seccion",
          ],
        },
        manualCvLimit: 5,
        uploadCvLimit: 5,
      },
    });
  } catch (e) {
    console.error("[ERROR_SEED]", e);
  }
}

main()
  .catch((e) => {
    console.error("❌ [Error during seed]:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
