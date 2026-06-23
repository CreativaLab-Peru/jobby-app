"use server";

import { resend } from "@/lib/resend";
import { MentoriaRequestData } from "../types/mentoria";
import { MentoriaConfirmationEmail } from "../templates/mentoria-confirmation-email";

export async function submitMentoriaRequest(
  data: MentoriaRequestData
): Promise<{ success: boolean; error?: string }> {
  try {
    await resend.emails.send({
      from: "Levely <contact@joinlevely.com>",
      to: [data.email.trim().toLowerCase()],
      subject: "Confirmación de tu sesión de mentoría 1:1 — Levely",
      react: MentoriaConfirmationEmail({
        name: data.name,
        email: data.email,
      }),
    });

    return { success: true };
  } catch (error) {
    console.error("[mentoria] email send error:", error);
    return { success: false, error: "No se pudo enviar el correo" };
  }
}
