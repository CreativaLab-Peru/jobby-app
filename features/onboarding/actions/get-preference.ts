"use server"

import {prisma} from "@/lib/prisma";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export const getPreference = async () => {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return;
  }
  const preference = await prisma.userPreference.findUnique({
    where: {userId: currentUser.id}
  })
  if (!preference) {
    return;
  }
  return preference;
}
