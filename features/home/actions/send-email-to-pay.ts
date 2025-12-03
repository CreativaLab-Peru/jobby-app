"use server"

import {prisma} from "@/lib/prisma";
import {TemporalUser} from "@prisma/client";
import {createPreferenceForNewUser} from "@/lib/mercadopago/create-preference-for-new-user";

export const sendEmailToPay = async (email: string) => {
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

    const response = await createPreferenceForNewUser(user.id);
    if (!response.success) {
      return {
        success: false,
        error: 'Error creating payment preference',
      }
    }

    return {
      success: true,
      redirect: response.redirect,
    }
  } catch (error) {
    console.error("[ERROR_SEND_EMAIL_TO_PAY]", error);
    return {
      success: false,
      error: 'Internal server error',
    }
  }
}
