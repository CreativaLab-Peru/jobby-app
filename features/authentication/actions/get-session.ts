import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

// Middleware para asegurar la conexión de Prisma
const ensurePrismaConnection = async () => {
  try {
    await prisma.$connect();
  } catch (error) {
    console.error("Error connecting to Prisma:", error);
    throw new Error("Failed to connect to the database.");
  }
};

export const getSession = async () => {
  try {
    // Aseguramos que Prisma esté conectado antes de realizar cualquier operación
    await ensurePrismaConnection();

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        error: "Session not found",
      };
    }

    return {
      success: true,
      user: {
        id: session.user?.id || null,
        email: session.user?.email || null,
        name: session.user?.name || null,
        image: session.user?.image || null,
      },
    };
  } catch (error) {
    console.error("Error fetching session:", error);
    return {
      success: false,
      error: "Failed to fetch session",
    };
  }
};