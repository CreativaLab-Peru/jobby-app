"use server"
import { prisma } from "@/lib/prisma";
import { PAYMEMT_PLAN_ID_BY_DEFAULT } from "./consts";

export const newUserConfiguration = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      }
    })
    if (!user) {
      console.error("[NOT_FOUND_USER]:", userId);
      return false;
    }

    const planFree = await prisma.paymentPlan.findFirst({
      where: {
        id: PAYMEMT_PLAN_ID_BY_DEFAULT,
      }
    })
    if (!planFree) {
      console.error("[PLAN_NOT_FOUND]", PAYMEMT_PLAN_ID_BY_DEFAULT);
      return false;
    }

    const userPlan = await prisma.userPayment.create({
      data: {
        planId: PAYMEMT_PLAN_ID_BY_DEFAULT,
        userId: user.id,
      }
    })
    if (!userPlan) {
      console.error("[CREATING_NEW_USER_PLAN_ERROR]:", userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[ERROR_NEW_USER_CONFIGURATION]", error);
    return false;
  }
}