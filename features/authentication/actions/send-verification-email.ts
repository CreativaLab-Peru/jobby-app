"use server"

import { resend } from "@/lib/resend";
import {WelcomeEmail} from "@/features/authentication/templates/welcome-email";

export async function sendVerificationEmail(email: string, name: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Levely AI <onboarding@tu-dominio.com>', // Cambia por tu dominio verificado
      to: [email],
      subject: '🚀 Bienvenido a Levely - Verifica tu cuenta',
      react: WelcomeEmail({ name, otpCode: code }),
    });

    if (error) {
      return { success: false, error };
    }

    return { success: true, data };
  } catch (err) {
    console.error("[RESEND_ERROR]", err);
    return { success: false, error: err };
  }
}
