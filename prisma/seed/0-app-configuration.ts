import { PrismaClient } from "@prisma/client";

export async function appConfiguration(prisma: PrismaClient) {
  try {
    await prisma.appConfig.upsert({
      where: { key: "INTERVIEW_DURATION" },
      update: {
        value: "180",
      },
      create: {
        key: "INTERVIEW_DURATION",
        value: "180", // 3 minutes in seconds for fallback
      },
    });
  } catch (e) {
    console.error("[ERROR_APP_CONFIGURATION]", e);
  }
}
