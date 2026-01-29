import { PaymentType, PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {

  try {
    await prisma.paymentPlan.upsert({
      where: { slug: "free" },
      update: {},
      create: {
        id: "d79cafea-beef-4037-a874-bf0e8e04d4e9",
        slug: "free",
        name: "FREE",
        description: "Plan gratuito",
        paymentType: PaymentType.FREE,
        priceCents: 0.0,
        currency: "PEN",
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
      where: { slug: "direct" },
      update: {},
      create: {
        id: "bc90d6e5-145b-404c-b9c8-ef670efbce4d",
        slug: "pro",
        name: "Premium Pro",
        description: "Acceso al plan pro",
        paymentType: PaymentType.ONE_TIME,
        priceCents: 9.90,
        currency: "PEN",
        features: {
          caracteristics: [
            "Creacion de hasta 5 cv's",
            "Analisis de CV hasta 5 cv's",
            "Recomendaciones por seccion"
          ],
        },
        manualCvLimit: 5,
        uploadCvLimit: 5,
      },
    });
  } catch (e) {
    console.error("[ERROR_SEED]", e)
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
