"use server";

import { resend } from "@/lib/resend";
import { render } from "@react-email/render";
import { ComplaintEmail } from "@/features/complaints/templates/complaint-email";
import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import {
  complaintSchema,
  type ComplaintFormValues,
} from "@/features/complaints/schemas/complaint.schema";

const COMPLAINTS_EMAIL = "contacto@joinlevely.com";

export async function submitComplaintAction(formData: ComplaintFormValues) {
  // Validar datos antes de modificar
  const parsed = complaintSchema.safeParse(formData);
  if (!parsed.success) {
    return {
      success: false,
      error: parsed.error.issues[0]?.message ?? "Datos inválidos",
    };
  }

  const { name, email, phone, complaint } = parsed.data;

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
    where: { userId, createdAt: { gte: startOfDay } },
    select: { id: true },
  });

  if (existingComplaint) {
    return {
      success: false,
      error:
        "Ya enviaste un reclamo hoy. Si tienes más consultas, contáctanos a contacto@joinlevely.com",
    };
  }

  const submittedAt = new Date().toLocaleString("es-PE", {
    timeZone: "America/Lima",
    dateStyle: "full",
    timeStyle: "short",
  });

  try {
    // Guardar en BD
    await prisma.complaint.create({
      data: { userId, name, email, phone: phone ?? null, complaint },
    });

    // Enviar email de notificación
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
