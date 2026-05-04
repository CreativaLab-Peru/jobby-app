"use server"

import { getFirstUserPayment } from "./get-first-user-payment";

export const getUserCurrentPlan = async (): Promise<string> => {
  try {
    const userSubscription = await getFirstUserPayment();
    
    // Si hay suscripción activa, retornamos el slug del plan en mayúsculas
    if (userSubscription?.subscription?.plan?.slug) {
      return userSubscription.subscription.plan.slug.toUpperCase();
    }
    
    // Por defecto es FREE si no hay suscripción activa
    return "FREE";
  } catch (error) {
    console.error("[GET_USER_CURRENT_PLAN_ERROR]", error);
    return "FREE";
  }
};
