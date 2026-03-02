"use server";

import { z } from "zod";
import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { ComplaintEmail } from "@/features/complaints/templates/complaint-email";

const complaintSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  complaint: z.string().min(10, "El reclamo debe tener al menos 10 caracteres"),
});

const COMPLAINTS_EMAIL = "contacto@joinlevely.com";

export async function submitComplaintAction(formData: unknown) {
  const parsed = complaintSchema.safeParse(formData);

  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const { name, email, phone, complaint } = parsed.data;

  const submittedAt = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    const html = await render(
      ComplaintEmail({ name, email, phone, complaint, submittedAt })
    );

    const { error } = await resend.emails.send({
      from: "Levely AI <contacto@joinlevely.com>",
      to: [COMPLAINTS_EMAIL],
      replyTo: email,
      subject: `⚠️ Nuevo reclamo de ${name} — Levely`,
      html,
    });

    if (error) {
      console.error("[COMPLAINT_EMAIL_ERROR]", error);
      return { success: false, error: "No se pudo enviar el reclamo. Intenta nuevamente." };
    }

    return { success: true };
  } catch (err) {
    console.error("[COMPLAINT_ACTION_ERROR]", err);
    return { success: false, error: "Error interno del servidor." };
  }
}


