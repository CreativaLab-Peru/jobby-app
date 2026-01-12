"use server"
import {prisma} from "@/lib/prisma";

export const acceptTerms = async (userId: string) => {
  try{
    const user = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        acceptedTermsAndConditions: true,
        acceptedTermsAt: new Date(),
        acceptedPrivacyPolicy: true,
        acceptedPrivacyPolicyAt: new Date()
      }
    })
    if (!user) {
      console.error("User not found by userId:", userId);
      return false;
    }
    return true;
  } catch (error){
    console.error("[ERROR_ACCEPT_TERMS]", error);
    return false;
  }
}