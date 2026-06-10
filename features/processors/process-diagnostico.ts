import {prisma} from "@/lib/prisma";
import {LogAction, LogLevel} from "@prisma/client";
import {logsService} from "@/features/share/services/logs-service";
import {inngest} from "@/inngest/functions/client";
import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";
import type {PaymentResponse} from "mercadopago/dist/clients/payment/commonTypes";

export async function processDiagnostico(
  jobId: string,
  paymentId: string,
  payment: PaymentResponse
): Promise<void> {
  const {email, name} = payment.metadata as { email: string; name: string };

  // 1. Idempotency check — skip if a non-pending session already exists
  const existing = await prisma.diagnosticSession.findFirst({
    where: {
      email,
      status: {not: "PENDING"},
    },
  });

  if (existing) {
    return; // already processed, caller marks job SUCCEEDED
  }

  // 2. Create diagnostic session with hashed magic-link token
  const token = generateMagicLinkToken(32);
  const hashedToken = hashMagicLinkToken(token);

  const session = await prisma.diagnosticSession.create({
    data: {
      token: hashedToken,
      email,
      name,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  });

  // 3. Fire access email via Inngest
  await inngest.send({
    name: "diagnostico/access-email",
    data: {
      sessionId: session.id,
      email,
      name,
      magicLink: token,
    },
  });

  await logsService.createLog({
    action: LogAction.EMAIL,
    level: LogLevel.INFO,
    entity: "MERCADO_PAGO_DIAGNOSTICO_SESSION_CREATED",
    message: `Diagnostic session created for: ${email}`,
    metadata: {sessionId: session.id, paymentId},
  });
}
