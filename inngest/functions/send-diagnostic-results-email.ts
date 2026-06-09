import { inngest } from "./client";
import { prisma } from "@/lib/prisma";
import { resend } from "@/lib/resend";
import { logsService } from "@/features/share/services/logs-service";
import { LogAction, LogLevel } from "@prisma/client";
import { DiagnosticResultsEmail } from "@/features/diagnostico-cv/templates/diagnostic-results-email";

export const sendDiagnosticResultsEmail = inngest.createFunction(
  { id: "send-diagnostic-results-email", name: "Send Diagnostic Results Email" },
  { event: "diagnostico/results-email" },
  async ({ event, step }) => {
    const { sessionId } = event.data;

    await step.run("fetch-result", async () => {
      const result = await prisma.diagnosticResult.findUnique({
        where: { sessionId },
        include: { session: true },
      });

      if (!result) {
        throw new Error(`Diagnostic result not found for session: ${sessionId}`);
      }

      return result;
    });

    await step.run("send-email", async () => {
      const result = await prisma.diagnosticResult.findUnique({
        where: { sessionId },
        include: { session: true },
      });

      if (!result) {
        throw new Error(`Diagnostic result not found for session: ${sessionId}`);
      }

      const baseUrl = process.env.NEXT_PUBLIC_URL || "https://www.joinlevely.com";
      const accessLink = `${baseUrl}/diagnostico-cv/results/${sessionId}`;

      const { data, error } = await resend.emails.send({
        from: "Levely <contact@joinlevely.com>",
        to: [result.email.trim().toLowerCase()],
        subject: `Tu diagnostico de beca esta listo - Score: ${result.overallScore || 0}/100`,
        react: DiagnosticResultsEmail({
          email: result.email,
          name: result.name || undefined,
          overallScore: result.overallScore || undefined,
          profileType: result.profileType || undefined,
          recommendations: result.recommendations as any || undefined,
          opportunities: result.opportunities as any || undefined,
          accessLink,
        }),
      });

      if (error) {
        await logsService.createLog({
          action: LogAction.EMAIL,
          level: LogLevel.ERROR,
          entity: "DIAGNOSTICO_RESULTS_EMAIL_FAILED",
          entityId: sessionId,
          message: `Failed to send diagnostic results email: ${result.email}`,
          metadata: { error },
        });
        throw error;
      }

      // Mark email as sent
      await prisma.diagnosticResult.update({
        where: { sessionId },
        data: { emailSent: true },
      });

      await logsService.createLog({
        action: LogAction.EMAIL,
        level: LogLevel.INFO,
        entity: "DIAGNOSTICO_RESULTS_EMAIL_SENT",
        entityId: sessionId,
        message: `Diagnostic results email sent: ${result.email}`,
        metadata: { emailId: data?.id },
      });

      return { success: true, emailId: data?.id };
    });
  }
);
