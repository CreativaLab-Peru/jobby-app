import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { Payment } from "mercadopago";
import { mercadopago } from "@/lib/mercado-preference";

import { logsService } from "@/features/share/services/logs-service";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";
import { randomUUID } from "node:crypto";

export const processMercadoPagoPayment = inngest.createFunction(
  { id: "process-mercadopago-payment" },
  { event: "payment/mercadopago.approved" },

  async ({ event, step }) => {
    const job = await step.run("create-job", async () => {
      return prisma.queueJob.create({
        data: {
          jobId: event.id,
          type: "MERCADOPAGO_PAYMENT",
          status: JobStatus.IN_PROGRESS,
          payload: event.data,
        },
      });
    });

    const paymentId = event.data.paymentId;

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: `Processing MercadoPago payment ${paymentId}`,
    });

    // ✅ STEP 1: Obtener pago desde MercadoPago
    const payment = await step.run("get-payment", async () => {
      return new Payment(mercadopago).get({ id: paymentId });
    });

    if (!payment || payment.status !== "approved") {
      await logsService.createLog({
        entity: "QUEUE_JOB",
        entityId: job.id,
        action: LogAction.PAYMENT,
        level: LogLevel.WARNING,
        message: "Payment not approved or not found",
        metadata: payment,
      });

      return;
    }

    const { id: planId, user_id: userId, email } = payment.metadata;
    // ✅ STEP 2: Validar usuario
    let user: any = null;
    if (userId) {
      user = await step.run("get-user", async () => {
        const existingUser = await prisma.user.findUnique({ where: { id: userId } });
        return existingUser ? existingUser : null
      });
    } else if (email) {
      user = await step.run("get-tmp-user", async () => {
        const existingTmpUser = await prisma.temporalUser.findUnique({ where: { email } });
        if (existingTmpUser) {
          const newUserId = randomUUID();
          user = await prisma.user.create({
            data: {
              id: newUserId,
              email,
              name: "tmp",
              emailVerified: false,
              createdAt: new Date(),
              updatedAt: new Date(),

            }
          })
        }
        return user ? user : null;
      });
    }

    if (!user) {
      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "User not found",
      });

      throw new Error("User not found");
    }

    // ✅ STEP 3: Obtener plan
    const plan = await step.run("get-plan", async () => {
      return prisma.paymentPlan.findUnique({ where: { id: planId } });
    });

    if (!plan) {
      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.ERROR,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: "Payment plan not found",
      });

      throw new Error("Plan not found");
    }

    const alreadyProcessed = await step.run("check-idempotency", async () => {
      return prisma.userPayment.findFirst({
        where: {
          metadata: {
            path: ["paymentId"],
            equals: paymentId,
          },
        },
      });
    });

    if (alreadyProcessed) {
      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.WARNING,
        entity: "QUEUE_JOB",
        entityId: job.id,
        message: `Payment ${paymentId} already processed. Skipping.`,
      });

      return; // ⛔ SE DETIENE TODO EL FLUJO
    }

    // ✅ STEP 4: Crear pago de usuario
    const userPayment = await step.run("create-user-payment", async () => {
      return prisma.userPayment.create({
        data: {
          userId: user.id,
          planId: plan.id,
          metadata: { paymentId },
        },
      });
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "User payment created",
      metadata: userPayment,
    });

    // ✅ STEP 5: Crear token magic link
    const magicData = await step.run("generate-magic-link", async () => {
      const raw = generateMagicLinkToken();
      const hash = hashMagicLinkToken(raw);

      const record = await prisma.magicLinkToken.create({
        data: {
          userId: user.id,
          tokenHash: hash,
          expiresAt: new Date(Date.now() + 1000 * 60 * 10),
        },
      });

      const url = `${process.env.NEXT_PUBLIC_APP_URL}/api/auth/magic?token=${raw}`;

      return { recordId: record.id, magicUrl: url };
    });

    // ✅ STEP 6: Enviar magic link por email
    await step.run("send-magiclink-event", async () => {
      await inngest.send({
        name: "send/magiclink",
        data: {
          email: user.email,
          name: user.name,
          magicLink: magicData.magicUrl,
          userId,
        },
      });
    });

    // ✅ FINALIZAR JOB
    await step.run("complete-job", async () => {
      await prisma.queueJob.update({
        where: { id: job.id },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "QUEUE_JOB",
      entityId: job.id,
      message: "MercadoPago payment processed successfully",
    });
  }
);
