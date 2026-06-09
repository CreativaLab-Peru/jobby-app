import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { logsService } from "@/features/share/services/logs-service";
import { LogAction, LogLevel } from "@prisma/client";
import { DiagnosticAccessEmail } from "@/features/diagnostico-cv/templates/diagnostic-access-email";

export const sendDiagnosticAccessEmail = inngest.createFunction(
  { id: "send-diagnostic-access-email", name: "Send Diagnostic Access Email" },
  { event: "diagnostico/access-email" },
  async ({ event, step }) => {
    const { sessionId, email, name, magicLink } = event.data;

    await step.run("send-email", async () => {
      const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.joinlevely.com";
      const accessLink = `${baseUrl}/diagnostico-cv/${magicLink}`;

      const { data, error } = await resend.emails.send({
        from: "Levely <contact@joinlevely.com>",
        to: [email.trim().toLowerCase()],
        subject: "Diagnostico Levely - Acceso para subir tu CV",
        react: DiagnosticAccessEmail({
          email,
          name,
          magicLink: accessLink,
        }),
      });

      if (error) {
        await logsService.createLog({
          action: LogAction.EMAIL,
          level: LogLevel.ERROR,
          entity: "DIAGNOSTICO_ACCESS_EMAIL_FAILED",
          entityId: sessionId,
          message: `Failed to send diagnostic access email: ${email}`,
          metadata: { error },
        });
        throw error;
      }

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.INFO,
        entity: "DIAGNOSTICO_ACCESS_EMAIL_SENT",
        entityId: sessionId,
        message: `Diagnostic access email sent: ${email}`,
        metadata: { emailId: data?.id },
      });

      return { success: true, emailId: data?.id };
    });
  }
);
