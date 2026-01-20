import {NextRequest, NextResponse} from "next/server";
import {getSessionCookie} from "better-auth/cookies";

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

  return NextResponse.next();
}

export const config = {
  // Agregamos /onboarding y usamos un patrón más escalable
  matcher: [
    // "/onboarding", // <--- Faltaba esta
    "/cv/:path*",  // Usar :path* protege la ruta y todas sus sub-rutas
    "/create",
    "/upload-cv",
    "/preview",
    "/analyzing",
    "/analysis",
    "/opportunities",
    "/settings",
    "/billing",
    "/app/:path*" // Recomendación: agrupar rutas protegidas bajo /app
  ],
};
