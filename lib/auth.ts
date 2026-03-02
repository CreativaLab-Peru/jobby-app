import {betterAuth} from "better-auth";
import {prismaAdapter} from "better-auth/adapters/prisma";
import {PrismaClient} from "@prisma/client";
import {nextCookies} from "better-auth/next-js";
import {render} from "@react-email/render";
import {LevelyEmail} from "@/features/authentication/templates/verification-email-v2";
import {resend} from "@/lib/resend";

const prisma = new PrismaClient();

export const auth = betterAuth({
  database: prismaAdapter(prisma, {provider: "postgresql"}),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },

  // Email verification configuration
  emailVerification: {
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({user, url}) => {
      const html = await render(
        LevelyEmail({name: user.name, url: url, isPasswordReset: false})
      );

      await resend.emails.send({
        from: "Levely <215422@unsaac.edu.pe>",
        to: user.email,
        subject: "Verifica tu cuenta en Levely",
        html: html,
      });
    },
  },

  // Password reset configuration
  passwordReset: {
    sendResetPasswordEmail: async ({user, url}) => {
      const html = await render(
        LevelyEmail({name: user.name, url: url, isPasswordReset: true})
      );

      await resend.emails.send({
        from: "Levely <215422@unsaac.edu.pe>",
        to: user.email,
        subject: "Restablece tu contraseña de Levely",
        html: html,
      });
    },
  },

  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 días
    updateAge: 60 * 60 * 24, // Actualizar sesión cada día
    cookieCache: {
      enabled: true,
      maxAge: 5 * 60 // 5 minutos de cache para mejorar rendimiento
    }
  },

  secret: process.env.BETTER_AUTH_SECRET!,

  // Configuración de proveedores sociales (OAuth)
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      disableImplicitSignUp: true,
    },
  },

  plugins: [
    nextCookies(),
  ],

  trustedOrigins: [
    process.env.BETTER_AUTH_URL!
  ]
});
