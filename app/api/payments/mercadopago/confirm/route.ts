// /api/webhooks/mercadopago/confirm-payment
import { prisma } from "@/lib/prisma"
import { mercadopago } from "@/lib/mercado-preference"
import { Payment } from "mercadopago"
import { NextResponse } from "next/server"
import { JobStatus } from "@prisma/client";

export async function POST(req: Request) {
  const body = await req.json();

  const paymentId = body?.data?.id;
  if (!paymentId) {
    return new NextResponse("[MISSING_ID_ERROR]", { status: 400 });
  }

  // 1. Crear un job en DB
  const job = await prisma.queueJob.create({
    data: {
      jobId: paymentId,
      type: "MERCADOPAGO_PAYMENT",
      status: JobStatus.PENDING,
      payload: { paymentId },
    },
  });

  // 2. Procesarlo inmediatamente
  try {
    await processPaymentJob(job.id, paymentId)
  } catch (e) {
    console.error("[ERROR_PROCESS_PAYMENT_JOB]", e)
    return new NextResponse("[ERROR_PROCESS_PAYMENT_JOB]", { status: 500 });
  }


  // 3. Responder rápido al webhook
  return new NextResponse(null, { status: 200 });
}

async function processPaymentJob(jobId: string, paymentId: string) {
  try {
    // 1. Update job started
    await prisma.queueJob.update({
      where: { id: jobId },
      data: { status: JobStatus.IN_PROGRESS }
    });

    // 2. Obtener pago de MercadoPago
    const payment = await new Payment(mercadopago).get({ id: paymentId });

    if (!payment || payment.status !== "approved") {
      await prisma.queueJob.update({
        where: { id: jobId },
        data: {
          status: JobStatus.FAILED,
          lastError: "Payment not approved",
          finishedAt: new Date(),
        },
      });
      return;
    }

    const { id: planId, user_id: userId, email } = payment.metadata;

    // 3. Obtener usuario (igual que antes)
    // tu lógica aquí…

    // 4. Obtener plan (igual que antes)
    // tu lógica aquí…

    // 5. Idempotencia
    const existing = await prisma.userPayment.findFirst({
      where: {
        metadata: {
          path: ["paymentId"],
          equals: paymentId,
        },
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

    // 6. Crear userPayment
    await prisma.userPayment.create({
      data: {
        userId: userId,
        planId: planId,
        metadata: { paymentId },
      },
    });

    // 7. Marcar job como completado
    await prisma.queueJob.update({
      where: { id: jobId },
      data: {
        status: JobStatus.SUCCEEDED,
        finishedAt: new Date(),
      },
    });
  } catch (err: any) {
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