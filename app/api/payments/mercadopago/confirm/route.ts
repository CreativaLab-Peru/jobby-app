import {prisma} from "@/lib/prisma";
import {Payment} from "mercadopago";
import {NextResponse} from "next/server";
import {JobStatus, LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {mercadopago} from "@/features/billing/domain/mercado-preference";
import {processDiagnostico} from "@/features/processors/process-diagnostico";
import {processPlan} from "@/features/processors/process-plan";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type PaymentType = "DIAGNOSTICO" | "PLAN"; // extend as needed

// ---------------------------------------------------------------------------
// Webhook entry-point
// ---------------------------------------------------------------------------

export async function POST(req: Request) {
  const body = await req.json();

  const paymentId: string | undefined = body?.data?.id;
  if (!paymentId) {
    return new NextResponse("[MISSING_ID_ERROR]", {status: 400});
  }

  // Upsert a queue job so the webhook is idempotent at the job level too
  const job = await prisma.queueJob.upsert({
    where: {jobId: paymentId},
    create: {
      jobId: paymentId,
      type: "MERCADOPAGO_PAYMENT",
      status: JobStatus.PENDING,
      payload: {paymentId},
    },
    update: {
      status: JobStatus.PENDING,
      payload: {paymentId},
    },
  });

  await logsService.createLog({
    action: LogAction.PAYMENT,
    level: LogLevel.INFO,
    entity: "MERCADO_PAGO_WEBHOOK",
    entityId: job.id,
    message: `Received webhook for payment: ${paymentId}`,
    metadata: {paymentId},
  });

  try {
    await processPaymentJob(job.id, paymentId);
  } catch (e) {
    console.error("[ERROR_PROCESS_PAYMENT_JOB]", e);
    return new NextResponse("[ERROR_PROCESS_PAYMENT_JOB]", {status: 500});
  }

  return new NextResponse(null, {status: 200});
}

// ---------------------------------------------------------------------------
// Job lifecycle wrapper — owns status transitions and error handling
// ---------------------------------------------------------------------------

async function processPaymentJob(jobId: string, paymentId: string): Promise<void> {
  await prisma.queueJob.update({
    where: {id: jobId},
    data: {status: JobStatus.IN_PROGRESS},
  });

  try {
    // 1. Fetch payment from MercadoPago
    const payment = await new Payment(mercadopago).get({id: paymentId});

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_GET_PAYMENT",
      message: `Fetched payment: ${paymentId}`,
      metadata: {payment},
    });

    // 2. Guard: only process approved payments
    if (!payment || payment.status !== "approved") {
      await prisma.queueJob.update({
        where: {id: jobId},
        data: {
          status: JobStatus.FAILED,
          lastError: "Payment not approved",
          finishedAt: new Date(),
        },
      });

      await logsService.createLog({
        action: LogAction.PAYMENT,
        level: LogLevel.ERROR,
        entity: "MERCADO_PAGO_PAYMENT_NOT_APPROVED",
        message: `Payment not approved: ${paymentId}`,
        metadata: {payment},
      });

      return;
    }

    // 3. Dispatch to the correct processor by type
    const type: PaymentType = payment.metadata?.type ?? "PLAN";

    switch (type) {
      case "DIAGNOSTICO":
        await processDiagnostico(jobId, paymentId, payment);
        break;

      default:
        await processPlan(jobId, paymentId, payment);
        break;
    }

    // 4. Mark job succeeded
    await prisma.queueJob.update({
      where: {id: jobId},
      data: {
        status: JobStatus.SUCCEEDED,
        finishedAt: new Date(),
      },
    });

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_PAYMENT_COMPLETED",
      message: `Payment job completed: ${paymentId}`,
      metadata: {type, paymentId},
    });
  } catch (err: any) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "MERCADO_PAGO_PAYMENT_ERROR",
      message: `Error processing payment: ${paymentId}`,
      metadata: {err: err.message},
    });

    await prisma.queueJob.update({
      where: {id: jobId},
      data: {
        attempts: {increment: 1},
        lastError: err.message,
      },
    });

    throw err;
  }
}
