"use server"

import { prisma } from "@/lib/prisma"
import { getCurrentUser } from "@/features/share/actions/get-current-user"

export async function getCvPhotos() {
  const user = await getCurrentUser()
  if (!user) return { error: "No autenticado" }

  const photos = await prisma.cvPhoto.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { id: true, url: true, createdAt: true },
  })

  return { photos }
}
