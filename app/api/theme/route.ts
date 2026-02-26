import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    if (!session?.user) {
      return NextResponse.json({ theme: "light" });
    }

    const preference = await prisma.userPreference.findUnique({
      where: { userId: session.user.id },
      select: { theme: true },
    });

    const theme = (preference?.theme ?? "light") as "light" | "dark";

    const cookieStore = await cookies();
    cookieStore.set("theme", theme, { path: "/", sameSite: "lax" });

    return NextResponse.json({ theme });
  } catch {
    return NextResponse.json({ theme: "light" });
  }
}

