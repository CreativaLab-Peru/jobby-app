import {PrismaClient} from "@prisma/client";

const prisma = new PrismaClient();

const credit_package = [
  {
    "id": "c3fe5b00-0b6b-45fb-9b50-8f2defed9d25",
    "name": "STARTER OPPORTUNITY",
    "code": "STARTER",
    "credits": 1,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "SEARCH_OPPORTUNITIES",
    "createdAt": "2026-01-29 04:58:06.411"
  },
  {
    "id": "6bcb9c51-e815-4dd3-99bc-2447eb48596f",
    "name": "PRO OPPORTUNITY",
    "code": "PRO",
    "credits": 5,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "SEARCH_OPPORTUNITIES",
    "createdAt": "2026-01-29 04:58:58.189"
  },
  {
    "id": "787217ad-f86d-4311-8e97-2da456bd63bf",
    "name": "PRO MANAGE CVS",
    "code": "PRO",
    "credits": 5,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "MANAGE_CVS",
    "createdAt": "2026-01-29 04:53:22.245"
  },
  {
    "id": "dbacad71-de6e-4500-bba2-424bcda5c444",
    "name": "STARTER MANAGE CVS",
    "code": "STARTER",
    "credits": 3,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "MANAGE_CVS",
    "createdAt": "2026-01-29 04:51:26.939"
  },
  {
    "id": "db7d3829-928a-43b8-85ba-6732b63c71e1",
    "name": "FREE MANAGE CVS",
    "code": "FREE",
    "credits": 1,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "MANAGE_CVS",
    "createdAt": "2026-01-28 23:46:09.000"
  },
  {
    "id": "64d40213-d0e0-44c6-8bd9-951b3a507048",
    "name": "STARTER AI ACTIONS",
    "code": "STARTER",
    "credits": 1,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "AI_ACTIONS",
    "createdAt": "2026-01-29 04:48:00.179"
  },
  {
    "id": "49861ff7-d152-4845-8f99-6a0942441dd1",
    "name": "PRO AI ACTIONS",
    "code": "PRO",
    "credits": 5,
    "priceCents": 0,
    "currency": "SOL",
    "active": true,
    "type": "AI_ACTIONS",
    "createdAt": "2026-01-29 04:49:07.156"
  }
]

async function main() {
  try {
    for (const pkg of credit_package) {
      await prisma.creditPackage.upsert({
        where: { id: pkg.id },
        update: {},
        create: {
          id: pkg.id,
          code: pkg.code,
          name: pkg.name,
          credits: pkg.credits,
          priceCents: pkg.priceCents,
          currency: pkg.currency,
          active: pkg.active,
          type: pkg.type,
        },
      });
    }
  } catch (e) {
    console.error("[ERROR_SEED]", e)
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
