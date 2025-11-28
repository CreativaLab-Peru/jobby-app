// /api/webhooks/mercadopago/confirm-payment
import {prisma} from "@/lib/prisma"
import {mercadopago} from "@/lib/mercado-preference"
import {Payment} from "mercadopago"
import {NextResponse} from "next/server"
import {JobStatus, LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {inngest} from "@/inngest/functions/client";
import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";

export async function POST(req: Request) {
  const body = await req.json();

  const paymentId = body?.data?.id;
  if (!paymentId) {
    return new NextResponse("[MISSING_ID_ERROR]", {status: 400});
  }

  // 1. Crear un job en DB
  const job = await prisma.queueJob.create({
    data: {
      jobId: paymentId,
      type: "MERCADOPAGO_PAYMENT",
      status: JobStatus.PENDING,
      payload: {paymentId},
    },
  });

  await logsService.createLog({
    action: LogAction.PAYMENT,
    level: LogLevel.INFO,
    entity: "MERCADO_PAGO_INTEGRATION",
    entityId: job.id,
    message: `Started saving info of payment: ${paymentId}`,
    metadata: {paymentId},
  });

  // 2. Procesarlo inmediatamente
  try {
    await processPaymentJob(job.id, paymentId)
  } catch (e) {
    console.error("[ERROR_PROCESS_PAYMENT_JOB]", e)
    return new NextResponse("[ERROR_PROCESS_PAYMENT_JOB]", {status: 500});
  }


  // 3. Responder rápido al webhook
  return new NextResponse(null, {status: 200});
}

async function processPaymentJob(jobId: string, paymentId: string) {
  try {
    // 1. Update job started
    await prisma.queueJob.update({
      where: {id: jobId},
      data: {status: JobStatus.IN_PROGRESS}
    });

    // 2. Obtener pago de MercadoPago
    const payment = await new Payment(mercadopago).get({id: paymentId});

    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.INFO,
      entity: "MERCADO_PAGO_INTEGRATION_GET_PAYMENT",
      message: `Started saving info of payment: ${paymentId}`,
      metadata: {payment},
    });

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
        level: LogLevel.INFO,
        entity: "MERCADO_PAGO_INTEGRATION_GET_PAYMENT",
        message: `Started saving info of payment: ${paymentId}`,
        metadata: {payment},
      });

      return;
    }

    let {id: planId, user_id: userId, email} = payment.metadata;

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
        where: {id: jobId},
        data: {
          status: JobStatus.SUCCEEDED,
          finishedAt: new Date(),
        },
      });
      return;
    }

    if (email) {
      const temporalUser = await prisma.temporalUser.findFirst({
        where: {email},
      });
      if (temporalUser) {
        let existingUser = await prisma.user.findFirst({
          where: {email},
        });
        if (!existingUser) {
          existingUser = await prisma.user.create({
            data: {
              email: temporalUser.email,
              name: "",
              emailVerified: true,
              happensAfterPayment: true,
              createdAt: new Date(),
              updatedAt: new Date(),

            },
          });
        }
        await prisma.temporalUser.delete({
          where: {id: temporalUser.id},
        });
        userId = existingUser ? existingUser.id : userId;
        const token = generateMagicLinkToken();
        const hashedToken = hashMagicLinkToken(token);

        await prisma.magicLinkToken.create({
          data: {
            userId,
            tokenHash: hashedToken,
            expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 15 min
            purpose: "post_payment_access",
          }
        });

        await inngest.send({
          name: "send/magiclink",
          data: {
            email: existingUser.email,
            name: existingUser.name,
            userId: existingUser.id,
            magicLink: hashedToken,
          }
        });
      }
    }

    // 6. Crear userPayment
    const newUserPayment = await prisma.userPayment.create({
      data: {
        userId: userId,
        planId: planId,
        metadata: {paymentId},
      },
    });

    // 7. Marcar job como completado
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
      entity: "MERCADO_PAGO_INTEGRATION_CREATE_USER_PAYMENT",
      message: `Started saving info of payment: ${paymentId}`,
      metadata: {newUserPayment},
    });

  } catch (err: any) {
    await logsService.createLog({
      action: LogAction.PAYMENT,
      level: LogLevel.ERROR,
      entity: "MERCADO_PAGO_INTEGRATION_CREATE_USER_PAYMENT",
      message: `Error saving info of payment: ${paymentId}`,
      metadata: {err},
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
