import { PrismaClient, CreditBalanceType, TransactionType } from "@prisma/client";
import { pathToFileURL } from "url";

const prisma = new PrismaClient();

export const BATCH_SIZE = 100;
export const description = "Créditos básicos iniciales al registrarse"; 
export const onboardingSource = "onboarding_free_grant";
export const types = [
  CreditBalanceType.MANAGE_CVS,
  CreditBalanceType.AI_ACTIONS,
  CreditBalanceType.SEARCH_OPPORTUNITIES,
];

export async function awardForUser(prismaClient, userId) {
  return prismaClient.$transaction(async (tx) => {
    const previousOnboarding = await tx.creditTransaction.findFirst({
      where: {
        balance: { userId },
        OR: [
          { metadata: { path: ["source"], equals: onboardingSource } },
          { description: { contains: description } },
        ],
      },
    });

    if (previousOnboarding) {
      await tx.user.update({
        where: { id: userId },
        data: { onboardingCreditsGranted: true },
      });
      return false;
    }

    const updated = await tx.user.updateMany({
      where: { id: userId, onboardingCreditsGranted: false },
      data: { onboardingCreditsGranted: true },
    });

    if (updated.count === 0) return false;

    for (const type of types) {
      const balance = await tx.userCreditBalance.upsert({
        where: { userId_type: { userId, type } },
        update: { amount: { increment: 1 } },
        create: { userId, amount: 1, type },
      });

      await tx.creditTransaction.create({
        data: {
          balanceId: balance.id,
          amount: 1,
          type: TransactionType.BONUS,
          description,
          metadata: { source: onboardingSource, version: 1 },
        },
      });
    }

    return true;
  });
}

export async function runBackfill(prismaClient) {
  const failedUsers = new Set();

  const total = await prismaClient.user.count({
    where: { onboardingCreditsGranted: false },
  });
  console.log(`Usuarios a procesar: ${total}`);

  let processed = 0;
  let awarded = 0;
  let skipped = 0;
  let errors = 0;

  while (true) {
    const users = await prismaClient.user.findMany({
      where: {
        onboardingCreditsGranted: false,
        id: { notIn: [...failedUsers] },
      },
      take: BATCH_SIZE,
      select: { id: true },
      orderBy: { createdAt: "asc" },
    });

    if (users.length === 0) break;

    for (const u of users) {
      try {
        const res = await awardForUser(prismaClient, u.id);
        processed += 1;
        if (res) awarded += 1;
        else skipped += 1;
      } catch (e) {
        console.error("Error procesando usuario", u.id, e?.message || e);
        failedUsers.add(u.id);
        processed += 1;
        errors += 1;
      }
    }

    console.log(
      `Procesados: ${processed} — Otorgados: ${awarded} — Saltados: ${skipped} — Errores: ${errors}`,
    );
  }

  console.log("\n--- Resultado final ---");
  console.log(`Procesados: ${processed}`);
  console.log(`Otorgados: ${awarded}`);
  console.log(`Saltados: ${skipped}`);
  console.log(`Errores: ${errors}`);

  return { processed, awarded, skipped, errors };
}

export async function runBackfillCli() {
  try {
    await runBackfill(prisma);
  } catch (e) {
    console.error("Error general:", e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  await runBackfillCli();
}
