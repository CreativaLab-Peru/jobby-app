"use server"

import {getCompanyConfByNameAction} from "@/features/company/actions/get-company-conf-by-name";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {prisma} from "@/lib/prisma";

export const isValidCompanyBelong = async (slug: string) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return {
        success: false,
      }
    }
    const company = await getCompanyConfByNameAction(slug);
    if (!company) {
      return {
        success: false,
      }
    }

    const memberCompany = await prisma.companyMember.findFirst({
      where: {userId: currentUser.id, companyId: company.id}
    });
    if (!memberCompany) {
      return {
        success: false,
      }
    }

    return {
      success: true,
    }
  } catch (error) {
    console.error("[IS_VALID_COMPANY_BELONG]", error);
    return {
      error: "Internal server error.",
      success: false,
      redirectTo: "/logout",
    }
  }
}
