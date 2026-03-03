"use server";

import { z } from "zod";
import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { ComplaintEmail } from "@/features/complaints/templates/complaint-email";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

const complaintSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Correo electrónico inválido"),
  phone: z.string().optional(),
  complaint: z.string().min(10, "El reclamo debe tener al menos 10 caracteres"),
});

const COMPLAINTS_EMAIL = "contacto@joinlevely.com";

export async function submitComplaintAction(formData: unknown) {
  // Verificar sesión
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) {
    return { success: false, error: "Debes iniciar sesión para enviar un reclamo." };
  }

  const userId = session.user.id;

  // Verificar límite de 1 reclamo por día
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const existingComplaint = await prisma.complaint.findFirst({
    where: {
      userId,
      createdAt: { gte: startOfDay },
    },
    select: { id: true },
  });

  if (existingComplaint) {
    return {
      success: false,
      error: "Ya enviaste un reclamo hoy. Si tienes más reclamos o consultas, no dudes en contactarte con nosotros a contacto@joinlevely.com con el asunto: [RECLAMO], [CONSULTA].",
    };
  }

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
    // Guardar en BD
    await prisma.complaint.create({
      data: {
        userId,
        name,
        email,
        phone: phone ?? null,
        complaint,
      },
    });

    // Enviar email
    const html = await render(
      ComplaintEmail({ name, email, phone, complaint, submittedAt })
    );

    const { error } = await resend.emails.send({
      from: "Levely AI <contacto@joinlevely.com>",
      to: [COMPLAINTS_EMAIL],
      replyTo: email,
      subject: `[RECLAMO] Nuevo reclamo de ${name} — Levely`,
      html,
    });

    if (error) {
      console.error("[COMPLAINT_EMAIL_ERROR]", error);
      // El reclamo ya fue guardado en BD, informamos del fallo de email
      return {
        success: true,
        warning: "Reclamo registrado, pero no se pudo enviar el correo de notificación.",
      };
    }

    return { success: true };
  } catch (err) {
    console.error("[COMPLAINT_ACTION_ERROR]", err);
    return { success: false, error: "Error interno del servidor." };
  }
}
