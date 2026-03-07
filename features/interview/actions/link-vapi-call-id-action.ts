"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function linkVapiCallId(sessionId: string, vapiCallId: string) {
  await prisma.interviewSession.update({
    where: { id: sessionId },
    data: {
      vapiCallId: vapiCallId,
      status: "IN_PROGRESS"
    }
  });
  revalidatePath("/interviews"); // Para que aparezca en el historial
}
