import { prisma } from "@/lib/prisma";
import { Payment } from "mercadopago";
import { NextResponse } from "next/server";
import { JobStatus, LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";
import { inngest } from "@/inngest/functions/client";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";
import { mercadopago } from "@/features/billing/domain/mercado-preference";

export async function POST(req: Request) {
  const body = await req.json();

  const paymentId = body?.data?.id;
  if (!paymentId) {
    return new NextResponse("[MISSING_ID_ERROR]", { status: 400 });
  }

  // 1. Create a job in DB
  const job = await prisma.queueJob.upsert({
    where: { jobId: paymentId },
    create: {
      jobId: paymentId,
      type: "MERCADOPAGO_DIAGNOSTICO",
      status: JobStatus.PENDING,
      payload: { paymentId },
    },
    update: {
      status: JobStatus.PENDING,
      payload: { paymentId },
    },
  });

  await logsService.createLog({
    action: LogAction.PAYMENT,
    level: LogLevel.INFO,
    entity: "MERCADO_PAGO_DIAGNOSTICO",
    entityId: job.id,
    message: `Started processing diagnostico payment: ${paymentId}`,
    metadata: { paymentId },
  });

  // 2. Process immediately
  try {
    await processDiagnosticoPayment(job.id, paymentId);
  } catch (e) {
    console.error("[ERROR_PROCESS_DIAGNOSTICO_PAYMENT_JOB]", e);
    return new NextResponse("[ERROR_PROCESS_DIAGNOSTICO_PAYMENT_JOB]", { status: 500 });
  }

  // 3. Respond quickly to webhook
  return new NextResponse(null, { status: 200 });
}

async function processDiagnosticoPayment(jobId: string, paymentId: string) {
  try {
    // 1. Update job started
    await prisma.queueJob.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS },
    });

    // 2. Get payment from MercadoPago
    const payment = await new Payment(mercadopago).get({ id: paymentId });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_DIAGNOSTICO_GET_PAYMENT",
      message: `Getting payment info: ${paymentId}`,
      metadata: { payment },
    });

    if (!payment || payment.status !== "approved") {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.FAILED,
          lastError: "Payment not approved",
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.ERROR,
        entity: "MERCADO_PAGO_DIAGNOSTICO_GET_PAYMENT_ERROR",
        message: `Payment not approved: ${paymentId}`,
        metadata: { payment },
      });

      return;
    }

    //3. Extract metadata
    const { type, email, name } = payment.metadata;

    if (type !== "DIAGNOSTICO") {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.FAILED,
          lastError: "Not a diagnostico payment",
          finishedAt: new Date(),
        },
      });
      return;
    }

    // 4. Check if already processed
    const existing = await prisma.diagnosticSession.findFirst({
      where: {
        email: email as string,
        status: { not: "PENDING" },
      },
    });

    if (existing) {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });
      return;
    }

    // 5. Create diagnostic session with magic link token
    const token = generateMagicLinkToken(32);
    const hashedToken = hashMagicLinkToken(token);

    const session = await prisma.diagnosticSession.create({
      data: {
        token: hashedToken,
        email: email as string,
        name: name as string,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // 6. Send email with access link via Inngest
    await inngest.send({
      name: "diagnostico/access-email",
      data: {
        sessionId: session.id,
        email: email as string,
        name: name as string,
        magicLink: token,
      },
    });

    await logsService.createLog({
      action: LogAction.EMAIL,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_DIAGNOSTICO_SESSION_CREATED",
      message: `Diagnostic session created for: ${email}`,
      metadata: { sessionId: session.id, paymentId },
    });

    // 7. Mark job as completed
    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.SUCCEEDED,
        finishedAt: new Date(),
      },
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_DIAGNOSTICO_COMPLETED",
      message: `Diagnostico payment completed: ${paymentId}`,
      metadata: { sessionId: session.id },
    });
  } catch (err: any) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "MERCADO_PAGO_DIAGNOSTICO_ERROR",
      message: `Error processing diagnostico payment: ${paymentId}`,
      metadata: { err: err.message },
    });

    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        attempts: { increment: 1 },
        lastError: err.message,
      },
    });

    throw err;
  }
}
