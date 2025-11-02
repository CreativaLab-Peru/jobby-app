import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const subscriptionFree = await prisma.subscriptionPlan.upsert({
    where: { slug: "free" },
    update: {},
    create: {
      id: "d79cafea-beef-4037-a874-bf0e8e04d4e9",
      slug: "pro",
      name: "Premium Pro",
      description: "Access to all premium features",
      priceCents: 9.90,
      currency: "PEN",
      features: {
        caracteristics: [
          "Limited to 3 manual CV analyses",
          "Limited to 2 CV uploads",
          "Basic support",
        ],
      },
      manualCvLimit: 3,
      uploadCvLimit: 2,
    },
  });

  console.log("✅ Upserted subscription plan:", subscriptionFree);
}

main()
  .catch((e) => {
    console.error("❌ Error during seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
