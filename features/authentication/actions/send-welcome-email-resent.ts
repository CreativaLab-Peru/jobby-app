"use server";

import { resend } from "@/lib/resend";
import WelcomeMasterEmail from "@/features/authentication/templates/welcome-master";

export async function sendWelcomeEmailResent(email: string, name: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Levely AI <contact@joinlevely.com>',
      to: [email],
      subject: '🚀 Bienvenido a Levely - Tu carrera empieza aquí',
      react: WelcomeMasterEmail({ userName: name }),
    });

    if (error) {
      console.error("Error enviando bienvenida:", error);
      return { success: false };
    }

    return { success: true };
  } catch (err) {
    return { success: false };
  }
}
