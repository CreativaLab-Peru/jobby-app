"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";

export async function getUserCompanyAction() {
  try {
    const user = await getCurrentUser();
    if (!user) return null;

    const membership = await prisma.companyMember.findFirst({
      where: { userId: user.id },
      include: {
        company: {
          include: {
            preference: true,
            members: {
              include: {
                user: {
                  select: {
                    name: true,
                    email: true,
                    image: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    return membership?.company || null;
  } catch (error) {
    console.error("[GET_USER_COMPANY_ERROR]", error);
    return null;
  }
}
