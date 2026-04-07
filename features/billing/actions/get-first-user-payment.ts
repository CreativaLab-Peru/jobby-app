import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";
import {
  UserPayment,
  PaymentPlan
} from "@prisma/client";

export type UserSubscriptionPayment = {
  subscription: (UserPayment & {
    plan: PaymentPlan
  }) | null;
};

export const getFirstUserPayment = async (): Promise<UserSubscriptionPayment | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const subscription = await prisma.userPayment.findFirst({
      where: {userId: currentUser.id, active: true},
      include: {plan: true},
      orderBy: {createdAt: "desc"}
    });

    return JSON.parse(JSON.stringify({
      subscription,
    }));

  } catch (error) {
    console.error("[ERROR_GET_DASHBOARD_STATS]", error);
    return null;
  }
};
