"use server";

import { prisma } from "@/lib/prisma";

export async function getCompanyConfByNameAction(companyName: string) {
  try {
    const company = await prisma.company.findFirst({
      where: {slug: companyName},
      select: {
        id: true,
        name: true,
        slug: true,
        primaryColor: true,
        secondaryColor: true,
        logoUrl: true,
      }
    })
    if (!company) {
      return null;
    }

    return company;
  } catch (error) {
    console.error("[GET_USER_COMPANY_ERROR]", error);
    return null;
  }
}
