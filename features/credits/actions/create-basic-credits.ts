import { rechargeCredits, RechargeCreditsBody } from "@/features/credits/actions/recharge-credits";
import { CreditBalanceType, Prisma, TransactionType } from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ONBOARDING_CREDITS_DESCRIPTION = "Créditos básicos iniciales al registrarse";
const ONBOARDING_CREDITS_SOURCE = "onboarding_free_grant";

type CreateBasicCreditsResult =
  | { status: "granted" }
  | { status: "already_granted" }
  | { status: "error"; error: unknown };

export const createBasicCredits = async (userId: string): Promise<CreateBasicCreditsResult> => {
  if (!userId) throw new Error("User ID is required");

  const metadata: Prisma.InputJsonValue = {
    source: ONBOARDING_CREDITS_SOURCE,
    version: 1,
  };

  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1) Detectar otorgamiento histórico por metadata estable.
      // Fallback por description para registros antiguos sin metadata.
      const previousOnboarding = await tx.creditTransaction.findFirst({
        where: {
          balance: { is: { userId } },
          OR: [
            { metadata: { path: ["source"], equals: ONBOARDING_CREDITS_SOURCE } },
            { description: { contains: ONBOARDING_CREDITS_DESCRIPTION } },
          ],
        },
      });

      if (previousOnboarding) {
        // Marcar al usuario como ya premiado para evitar futuros intentos
        await tx.user.update({ where: { id: userId }, data: { onboardingCreditsGranted: true } });
        return { status: "already_granted" as const };
      }

      // Garantiza que solo se ejecute una vez por usuario
      const updated = await tx.user.updateMany({
        where: {
          id: userId,
          onboardingCreditsGranted: false,
        },
        data: {
          onboardingCreditsGranted: true,
        },
      });

  // Si no se actualizó ningún registro → ya recibió créditos
      if (updated.count === 0) {
        return { status: "already_granted" as const };
      }

      // Tipos de créditos a otorgar
      const creditTypes = [
        CreditBalanceType.MANAGE_CVS,
        CreditBalanceType.AI_ACTIONS,
        CreditBalanceType.SEARCH_OPPORTUNITIES,
      ];

      // Ejecutar recargas dentro de la misma transacción (secuencialmente para claridad)
      for (const type of creditTypes) {
        const body: RechargeCreditsBody = {
          userId,
          amount: 1,
          description: ONBOARDING_CREDITS_DESCRIPTION,
          type,
          metadata,
          transactionType: TransactionType.BONUS,
        };
        await rechargeCredits(body, tx);
      }

      return { status: "granted" as const };
    });

    return result;
  } catch (error) {
    console.error("[ERROR_CREATE_BASIC_CREDITS]", error);

    return {
      status: "error" as const,
      error,
    };
  }
};