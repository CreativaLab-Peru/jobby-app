"use server"

import { getSession } from "@/features/authentication/actions/get-session";;
import { prisma } from "@/lib/prisma";

export const getUser = async () => {
  try {
    const session = await getSession()
    if (!session || !session.user) {
      return null;
    }
    const user = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
        email: true,
        name: true,
        image: true,
        acceptedPrivacyPolicy: true,
        acceptedSecurityPolicy: true,
        acceptedTermsAndConditions: true,
      },
    })

    if (!user) {
      console.error("User not found by email:", session.user.email);
      return null;
    }

    return {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name || "",
      image: session.user.image || "",
      acceptedPrivacyPolicy: user?.acceptedPrivacyPolicy || false,
      acceptedSecurityPolicy: user?.acceptedSecurityPolicy || false,
      acceptedTermsAndConditions: user?.acceptedTermsAndConditions || false,
    }
  } catch (error) {
    console.error("[ERROR_GET_USER]", error);
    return null;
  }
}
