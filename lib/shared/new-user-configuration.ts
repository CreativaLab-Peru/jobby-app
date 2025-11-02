"use server"
import { prisma } from "@/lib/prisma";

export const newUserConfiguration = async (userId: string) => {
  try {
    const user = await prisma.user.findFirst({
      where: {
        id: userId,
      }
    })
    if (!user) {
      console.error("User not found by userId:", userId);
      return false;
    }

    const SUBSCRIPTION_FREE_ID = "d79cafea-beef-4037-a874-bf0e8e04d4e9";
    const subscriptionPlanFree = await prisma.paymentPlan.findFirst({
      where: {
        id: SUBSCRIPTION_FREE_ID,
      }
    })
    if (!subscriptionPlanFree) {
      console.error("Subscription plan not found by id:", SUBSCRIPTION_FREE_ID);
      return false;
    }

    const subscription = await prisma.userPayment.create({
      data: {
        planId: SUBSCRIPTION_FREE_ID,
        userId: user.id,
      }
    })
    if (!subscription) {
      console.error("Error creating subscription for userId:", userId);
      return false;
    }

    return true;
  } catch (error) {
    console.error("[ERROR_NEW_USER]", error);
    return false;
  }
}