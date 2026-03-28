"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {getActiveRoute} from "@/features/routes/actions/get-active-route";
import {RouteStatus} from "@prisma/client";

export async function saveBookMentorAction(formData: {
  phone: string;
  fullName: string;
}) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return { success: false, message: "Usuario no autenticado" };
  }

  const activeRoute = await getActiveRoute();
  if (!activeRoute) {
    return { success: false, message: "No hay ruta activa" };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.user.update({
        where: { id: currentUser.id },
        data: {
          phoneNumber: formData.phone,
          name: formData.fullName,
        },
      });
      await tx.route.update({
        where: { id: activeRoute.id},
        data: {
          status: RouteStatus.PROGRAM_DONE
        }
      })
    })

    revalidatePath("/booking"); // O la ruta donde esté el componente
    return { success: true };
  } catch (error) {
    console.error("Booking Error:", error);
    return { success: false, message: "Error al guardar los datos" };
  }
}
