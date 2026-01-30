"use server"

import { resend } from "@/lib/resend";
import {VerificationEmail} from "@/features/authentication/templates/verification-email";

export async function sendVerificationEmail(email: string, name: string, code: string) {
  try {
    const { data, error } = await resend.emails.send({
      from: 'Levely <contact@joinlevely.com>', // Cambia por tu dominio verificado
      to: [email],
      subject: '🚀 Bienvenido a Levely - Verifica tu cuenta',
      react: VerificationEmail({ name, otpCode: code }),
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
