"use server"

import {prisma} from "@/lib/prisma";

export async function getUserByEmail(email: string) {
  try {
    const user = await prisma.user.findFirst({where: {email}})
    return { ...user };
  } catch (error) {
    console.error("[ERROR_GET_USER_BY_EMAIL]:", error);
    return null;
  }
}
