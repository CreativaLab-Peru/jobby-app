"use server"

import {prisma} from "@/lib/prisma";
import {TemporalUser} from "@prisma/client";

export const createTmpUser = async (email: string) => {
  try {
    let user: TemporalUser | null;
    user = await prisma.temporalUser.findFirst({
      where: {
        email,
      }
    })
    if (!user) {
      user = await prisma.temporalUser.create({
        data: {
          email,
        }
      })
    }

    return {
      success: true,
      user,
    }
  } catch (error) {
    console.error("[ERROR_SEND_EMAIL_TO_PAY]", error);
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}
