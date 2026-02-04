"use server"

import {prisma} from "@/lib/prisma";

export async function checkExistingUser(email: string) {
  try {
    const user = await prisma.user.findFirst({where: {email}})
    return { exists: !!user };
  } catch (error) {
    console.error("Error checking existing user:", error);
    return { exists: false, error: "Error checking existing user" };
  }
}
