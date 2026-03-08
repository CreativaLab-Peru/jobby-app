"use server"

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export async function linkVapiCallId(sessionId: string, vapiCallId: string) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error("Could not find current user");
      return;
    }
    await prisma.interviewSession.update({
      where: { id: sessionId },
      data: {
        vapiCallId: vapiCallId,
        status: "IN_PROGRESS"
      }
    });
    revalidatePath("/interviews"); // Para que aparezca en el historial
  } catch (error) {
    console.error("[LINK_VAPI_CALL_ID_ERROR]", error);
  }
}
