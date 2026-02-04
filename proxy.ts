import {NextRequest, NextResponse} from "next/server";
import {getSessionCookie} from "better-auth/cookies";
import { auth } from "@/lib/auth";
import { PrismaClient } from "@prisma/client";

export async function proxy(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const {pathname} = request.nextUrl;

  // 1. Si NO hay sesión y el usuario intenta entrar a una ruta protegida
  if (!sessionCookie) {
    // Redirigir al login en lugar de 404 para mejorar la UX
    const loginUrl = new URL("/login", request.url);
    // Opcional: guardar la URL de origen para volver después del login
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Si hay sesión, verificar si necesita completar onboarding
  try {
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (session?.user) {
      const prisma = new PrismaClient();
      
      try {
        // Verificar si tiene preferencias configuradas
        const userPreference = await prisma.userPreference.findUnique({
          where: { userId: session.user.id },
        });

        // Si no tiene preferencias, redirigir a onboarding
        // Excepto si ya está en la ruta de onboarding
        if (!userPreference && !pathname.startsWith("/onboarding")) {
          const onboardingUrl = new URL("/onboarding/talents", request.url);
          await prisma.$disconnect();
          return NextResponse.redirect(onboardingUrl);
        }

        await prisma.$disconnect();
      } catch (error) {
        console.error("Error checking user preference:", error);
        await prisma.$disconnect();
      }
    }
  } catch (error) {
    console.error("Error getting session:", error);
  }

  return NextResponse.next();
}

export const config = {
  // Agregamos /onboarding y usamos un patrón más escalable
  matcher: [
    "/cv/:path*",  // Usar :path* protege la ruta y todas sus sub-rutas
    "/create",
    "/upload-cv",
    "/preview",
    "/analyzing",
    "/analysis",
    "/opportunities",
    "/settings",
    "/billing",
    "/dashboard",
    "/app/:path*" // Recomendación: agrupar rutas protegidas bajo /app
  ],
};
