"use server"

import { getSession } from "@/features/authentication/actions/get-session";;
import { prisma } from "@/lib/prisma";
import {inngest} from "@/inngest/functions/client";
import {generateNumericCode} from "@/utils/digicts";

export const isValidUser = async () => {
  try {
    const session = await getSession();
    if (!session.success) {
      return {
        error: "No authenticated user found.",
        success: false,
        redirectTo: "/logout",
      }
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        acceptedPrivacyPolicy: true,
        acceptedSecurityPolicy: true,
        acceptedTermsAndConditions: true,
        emailVerified: true,
      },
    })

    if (!user) {
      console.error("User not found by email:", session.user.email);
      return {
        error: "User not found.",
        success: false,
        redirectTo: "/logout",
      }
    }

    if (!user.emailVerified) {
      const codeSixDigits = generateNumericCode();

      await prisma.verificationCode.create({
        data: {
          userId: user.id,
          code: codeSixDigits,
          expiresAt: new Date(Date.now() + 3600000), // Expira en 1 hora
        },
      });

      await inngest.send({
        name: "send.verification.code",
        data: {
          email: user.email, // Asegúrate que 'data.email' venga en el body
          name: user.name,
          codeSixDigits,
        }
      });
      return {
        error: "Email not verified.",
        success: false,
        redirectTo: "/account/verify?email=" + encodeURIComponent(user.email),
      }
    }

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("[ERROR_GET_USER]", error);
    return {
      error: "Internal server error.",
      success: false,
      redirectTo: "/logout",
    }
  }
}
