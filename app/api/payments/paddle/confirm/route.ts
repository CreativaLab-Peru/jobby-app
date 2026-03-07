import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import { inngest } from "@/inngest/functions/client";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";
import { authClient } from "@/lib/auth-client";
import { paddle } from "@/features/billing/domain/paddle-client";
import { rechargeCreditsByPlan } from "@/features/credits/actions/recharge-credits-by-plan";
import { EventName } from "@paddle/paddle-node-sdk";

const FIRST_PASSWORD = process.env.FIRST_PASSWORD;

export async function POST(req: Request) {
  const signature = req.headers.get("paddle-signature");
  const rawBody = await req.text();

  console.log("[PADDLE_WEBHOOK] Received webhook hit", { hasSignature: !!signature });

  if (!signature) {
    return new NextResponse("[MISSING_PADDLE_SIGNATURE]", { status: 400 });
  }

  // 1. Verificar firma del webhook
  let event: Awaited<ReturnType<typeof paddle.webhooks.unmarshal>>;
  try {
    event = await paddle.webhooks.unmarshal(
      rawBody,
      process.env.PADDLE_WEBHOOK_SECRET!,
      signature,
    );
  } catch (err) {
    console.error("[PADDLE_WEBHOOK] Invalid signature", err);
    return new NextResponse("[INVALID_PADDLE_SIGNATURE]", { status: 401 });
  }

  console.log("[PADDLE_WEBHOOK] Event type:", event?.eventType);

  // Solo procesamos transacciones completadas
  if (event?.eventType !== EventName.TransactionCompleted) {
    return new NextResponse(null, { status: 200 });
  }

  const transaction = event.data;
  const transactionId = transaction.id;

  // 2. Crear job en BD
  const job = await prisma.queueJob.upsert({
    where: { jobId: transactionId },
    create: {
      jobId: transactionId,
      type: "PADDLE_PAYMENT",
      status: JobStatus.PENDING,
      payload: { transactionId },
    },
    update: {
      status: JobStatus.PENDING,
      payload: { transactionId },
    },
  });

  await logsService.createLog({
    action: LogAction.PAYMENT,
    level: LogLevel.INFO,
    entity: "PADDLE_INTEGRATION",
    entityId: job.id,
    message: `Started saving info of Paddle transaction: ${transactionId}`,
    metadata: { transactionId },
  });

  // 3. Procesar
  try {
    await processPaddlePaymentJob(job.id, transactionId, transaction.customData as Record<string, string>);
  } catch (e) {
    console.error("[ERROR_PROCESS_PADDLE_PAYMENT_JOB]", e);
    return new NextResponse("[ERROR_PROCESS_PADDLE_PAYMENT_JOB]", { status: 500 });
  }

  return new NextResponse(null, { status: 200 });
}

async function processPaddlePaymentJob(
  jobId: string,
  transactionId: string,
  customData: Record<string, string>,
) {
  try {
    await prisma.queueJob.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS },
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "PADDLE_INTEGRATION_PROCESS",
      message: `Processing Paddle transaction: ${transactionId}`,
      metadata: { customData },
    });

    let userId: string = customData?.user_id;
    const planId: string = customData?.id;
    const email: string | undefined = customData?.email;

    if (!planId) {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: { status: JobStatus.FAILED, lastError: "Missing planId in customData", finishedAt: new Date() },
      });
      return;
    }

    // Idempotencia: evitar doble procesado
    const existing = await prisma.userPayment.findFirst({
      where: {
        metadata: {
          path: ["transactionId"],
          equals: transactionId,
        },
      },
    });
    if (existing) {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
      });
      return;
    }

    // Flujo para nuevo usuario  (solo tiene email)
    if (email && !userId) {
      const temporalUser = await prisma.temporalUser.findFirst({ where: { email } });

      if (temporalUser) {
        let existingUser = await prisma.user.findFirst({ where: { email } });

        if (!existingUser) {
          await authClient.signUp.email({ email, password: FIRST_PASSWORD, name: "tmp" });
          existingUser = await prisma.user.findFirst({ where: { email } });
        }

        await prisma.temporalUser.delete({ where: { id: temporalUser.id } });

        userId = existingUser ? existingUser.id : userId;

        const token = generateMagicLinkToken();
        const hashedToken = hashMagicLinkToken(token);

        await prisma.magicLinkToken.create({
          data: {
            userId,
            tokenHash: hashedToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24h
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

    // Crear userPayment
    const newUserPayment = await prisma.userPayment.create({
      data: {
        userId,
        planId,
        metadata: { transactionId },
      },
    });

    if (!newUserPayment) {
      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.ERROR,
        entity: "PADDLE_INTEGRATION_CREATE_USER_PAYMENT_ERROR",
        message: `Error creating user payment for transaction: ${transactionId}`,
        metadata: { transactionId, userId, planId },
      });
    }

    await rechargeCreditsByPlan(planId, userId);

    await prisma.queueJob.update({
      where: { id: jobId },
      data: { status: JobStatus.SUCCEEDED, finishedAt: new Date() },
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "PADDLE_INTEGRATION_COMPLETED",
      message: `Paddle payment completed: ${transactionId}`,
      metadata: { newUserPayment },
    });
  } catch (err) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "PADDLE_INTEGRATION_ERROR",
      message: `Error processing Paddle transaction: ${transactionId}`,
      metadata: { err },
    });

    await prisma.queueJob.update({
      where: { id: jobId },
      data: { attempts: { increment: 1 }, lastError: err.message },
    });

    throw err;
  }
}
