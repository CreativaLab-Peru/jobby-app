import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { LogAction, LogLevel } from "@prisma/client";
import { generateMagicLinkToken, hashMagicLinkToken } from "@/utils/magic-links";
import { logsService } from "@/features/share/services/logs-service";

export async function POST(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");
    const redirect = searchParams.get("redirect") || "/app";

    if (!token) {
      return NextResponse.json({ error: "token required" }, { status: 400 });
    }

    const hashed = hashMagicLinkToken(token);

    const record = await prisma.magicLinkToken.findFirst({
      where: {
        tokenHash: hashed,
        usedAt: null,
        expiresAt: { gt: new Date() },
      },
    });

    if (!record) {
      await logsService.createLog({
        action: LogAction.AUTH,
        level: LogLevel.WARNING,
        message: "Invalid or expired magic link",
        metadata: {
          ip: request.headers.get("x-forwarded-for") ?? "unknown",
        },
      });

      return NextResponse.json(
        { error: "invalid or expired token" },
        { status: 401 }
      );
    }

    await prisma.magicLinkToken.update({
      where: { id: record.id },
      data: {
        usedAt: new Date(),
        usedByIp: request.headers.get("x-forwarded-for") ?? "unknown",
        usedByUa: request.headers.get("user-agent") ?? "unknown",
      },
    });

    // ✅ Create session
    const sessionToken = generateMagicLinkToken(48);

    await prisma.session.create({
      data: {
        id: sessionToken,
        token: sessionToken,
        userId: record.userId,
        createdAt: new Date(),
        updatedAt: new Date(),
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7 days
      },
    });

    // ✅ Log success
    await logsService.createLog({
      userId: record.userId,
      action: LogAction.AUTH,
      level: LogLevel.INFO,
      message: "Magic link used, session created",
      entity: "MAGIC_LINK_TOKEN",
      entityId: record.id,
    });

    // ✅ Create redirect response
    const response = NextResponse.redirect(redirect, { status: 302 });

    // ✅ Set session cookie
    response.cookies.set("session", sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error("[MAGIC_LINK_ERROR]", error);

    await logsService.createLog({
      action: LogAction.AUTH,
      level: LogLevel.ERROR,
      message: "Magic link processing failed",
      metadata: { error: `${error}` },
    });

    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
