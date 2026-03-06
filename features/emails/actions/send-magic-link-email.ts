"use server"

import { resend } from "@/lib/resend";
import { logsService } from "@/features/share/services/logs-service";
import { LogAction, LogLevel } from "@prisma/client";
import SuccessPaymentEmail from "@/features/emails/templates/success-payment-email";

/**
 * Envía el enlace de acceso rápido (Magic Link) usando Resend.
 * @param email - Correo del destinatario
 * @param url - URL mágica generada por Better Auth
 */
export async function sendMagicLinkEmail(email: string, url: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Levely <contact@joinlevely.com>', // Tu dominio verificado
      to: [email.trim().toLowerCase()],
      subject: 'Pago confirmado: Accede a tu cuenta con este enlace',
      // Usamos el template que creamos con tus tokens de color
      react: SuccessPaymentEmail({
        email: email, // Puedes personalizar esto si tienes el nombre del usuario
        magicLink: url
      }),
    });

    if (error) {
      // Registro en DB para auditoría
      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.ERROR,
        message: "Resend failed to deliver magic link",
        email,
        metadata: { error, url },
      });

      return { success: false, error: "No pudimos enviar el enlace de acceso." };
    }

    return { success: true, data };

  } catch (err) {
    console.error("[MAGIC_LINK_ERROR]", err);

    await logsService.createLog({
      action: LogAction.EMAIL,
      level: LogLevel.ERROR,
      message: "Critical exception in sendMagicLinkEmail",
      email,
      metadata: {
        error: err instanceof Error ? err.message : "Unknown error"
      },
    });

    return { success: false, error: "Error interno al procesar el acceso." };
  }
}
