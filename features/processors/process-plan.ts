import {prisma} from "@/lib/prisma";
import {LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {inngest} from "@/inngest/functions/client";
import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";
import {authClient} from "@/lib/auth-client";
import {rechargeCreditsByPlan} from "@/features/credits/actions/recharge-credits-by-plan";
import type {PaymentResponse} from "mercadopago/dist/clients/payment/commonTypes";

const FIRST_PASSWORD = process.env.FIRST_PASSWORD!;

export async function processPlan(
  jobId: string,
  paymentId: string,
  payment: PaymentResponse
): Promise<void> {
  const {
    user_id: rawUserId,
    id: paymentPlanId,
    email,
  } = payment.metadata as {
    user_id?: string;
    id: string;
    email?: string;
  };

  let userId: string = rawUserId ?? "";

  // 1. Idempotency check
  const existing = await prisma.userPayment.findFirst({
    where: {
      metadata: {
        path: ["paymentId"],
        equals: paymentId,
      },
    },
  });

  if (existing) {
    return; // already processed, caller marks job SUCCEEDED
  }

  // 2. Auto-provision account for temporal (pre-checkout) users
  if (email) {
    const temporalUser = await prisma.temporalUser.findFirst({where: {email}});

    if (temporalUser) {
      let existingUser = await prisma.user.findFirst({where: {email}});

      if (!existingUser) {
        await authClient.signUp.email({
          email,
          password: FIRST_PASSWORD,
          name: temporalUser.name ?? "Cambiar nombre",
        });
        existingUser = await prisma.user.findFirst({where: {email}});
      }

      if (existingUser) {
        userId = existingUser.id;

        // 3. Issue magic-link so user can log in without a password
        const token = generateMagicLinkToken();
        const hashedToken = hashMagicLinkToken(token);

        await prisma.magicLinkToken.create({
          data: {
            userId,
            tokenHash: hashedToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 h
            purpose: "post_payment_access",
          },
        });

        await inngest.send({
          name: "send/magiclink",
          data: {
            email: existingUser.email,
            name: existingUser.name,
            userId: existingUser.id,
            magicLink: token,
          },
        });
      }
    }
  }

  // 4. Record the payment
  const newUserPayment = await prisma.userPayment.create({
    data: {
      userId,
      planId: paymentPlanId,
      metadata: {paymentId},
    },
  });

  if (!newUserPayment) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "MERCADO_PAGO_PLAN_CREATE_USER_PAYMENT_ERROR",
      message: `Error creating userPayment: ${paymentId}`,
      metadata: {paymentId, userId, planId: paymentPlanId},
    });
  }

  // 5. Recharge credits for the plan
  await rechargeCreditsByPlan(paymentPlanId, userId);

  await logsService.createLog({
    action: LogAction.PAYMENT,
    level: LogLevel.INFO,
    entity: "MERCADO_PAGO_PLAN_COMPLETED",
    message: `Plan payment completed: ${paymentId}`,
    metadata: {newUserPaymentId: newUserPayment?.id},
  });
}
