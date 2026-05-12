import {NextRequest, NextResponse} from "next/server";
import {getSessionCookie} from "better-auth/cookies";
import {prisma} from "@/lib/prisma";
import {auth} from "@/lib/auth";

const PUBLIC_PAGES = [
  '/',
]

export async function proxy(request: NextRequest) {
  const {pathname} = request.nextUrl;

  // ── Rutas siempre públicas ──────────────────────────────────────────────
  if (
    pathname.startsWith("/api/auth") ||
    pathname.startsWith("/_next")
  ) {
    return NextResponse.next();
  }

  // ── Detectar si es ruta de empresa: /c/[slug]/... ──────────────────────
  const companyRouteMatch = pathname.match(/^\/c\/([^/]+)(\/.*)?$/);
  const isCompanyRoute = !!companyRouteMatch;
  const companySlug = companyRouteMatch?.[1];
  const companySubPath = companyRouteMatch?.[2] ?? "/";

  // Rutas públicas de empresa (login/register no requieren sesión)
  if (isCompanyRoute && (
    companySubPath === "/login" ||
    companySubPath === "/register" ||
    companySubPath.startsWith("/onboarding")
  )) {
    console.log("[ENTRE AQUI 1]")
    return NextResponse.next();
  }

  // ── Verificar sesión ───────────────────────────────────────────────────
  const sessionCookie = getSessionCookie(request);
  if (!sessionCookie) {
    if (isCompanyRoute) {
      const loginUrl = new URL(`/c/${companySlug}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ── Flujo de empresa ───────────────────────────────────────────────────
  if (isCompanyRoute && companySlug) {
    const session = await auth.api.getSession({headers: request.headers});
    if (!session?.user) {
      const loginUrl = new URL(`/c/${companySlug}/login`, request.url);
      loginUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar que el usuario es miembro activo de esta empresa
    const member = await prisma.companyMember.findFirst({
      where: {
        userId: session.user.id,
        status: "ACTIVE",
        company: {slug: companySlug},
      },
      include: {company: {include: {preference: true}}},
    });

    if (!member) {
      // No es miembro: redirigir al login de la empresa
      const loginUrl = new URL(`/c/${companySlug}/login`, request.url);
      return NextResponse.redirect(loginUrl);
    }

    // Verificar onboarding de empresa
    if (!member.company.preference) {
      const onboardingUrl = new URL(`/c/${companySlug}/onboarding`, request.url);
      return NextResponse.redirect(onboardingUrl);
    }

    return NextResponse.next();
  }

  // ── Flujo de usuario normal ────────────────────────────────────────────
  const session = await auth.api.getSession({headers: request.headers});
  if (!session?.user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  const preference = await prisma.userPreference.findUnique({
    where: {userId: session.user.id},
  });

  if (!preference) {
    const onboardingUrl = new URL("/onboarding/talents", request.url);
    return NextResponse.redirect(onboardingUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/c/:path*",       // Todas las rutas de empresa
    "/cv/:path*",
    "/create",
    "/upload-cv",
    "/preview",
    "/analyzing",
    "/analysis",
    "/opportunities",
    "/settings",
    "/billing",
    "/dashboard",
  ],
};
