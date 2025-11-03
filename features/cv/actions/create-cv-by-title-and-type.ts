"use server";

import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { prisma } from "@/lib/prisma";
import { CvType, Language, OpportunityType, CvSectionType } from "@prisma/client";
import { JsonObject } from "@prisma/client/runtime/library";

/**
 * Create a CV and its default sections in one atomic operation.
 */
export const createCVByTitleAndType = async (
  title: string,
  cvType: CvType,
  opportunityType: OpportunityType
) => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return { success: false, message: "User not found." };
    }

    const lastsPaymentPlans = await prisma.userPayment.findMany({
      where: {
        userId: currentUser.id
      },
      include: {
        plan: true
      }
    })

    if (lastsPaymentPlans === null) {
      return { success: false, message: "The current user has no attempts" }
    }

    const lastAvailablePaymentToCreate = lastsPaymentPlans.find(plan => plan.manualCvsUsed < plan.plan.manualCvLimit)
    if (!lastAvailablePaymentToCreate) {
      return { success: false, message: "The current user has no attempts" }
    }

    const oneMoreInManualCvLimit = lastAvailablePaymentToCreate.manualCvsUsed + 1

    const updatePaymentPlanOfUser = await prisma.userPayment.update({
      where: {
        id: lastAvailablePaymentToCreate.id,
      },
      data: {
        manualCvsUsed: oneMoreInManualCvLimit
      }
    })

    if (!updatePaymentPlanOfUser) {
      return { success: false, message: "Error trying to update plan of current user" }
    }

    // Validate opportunityType is correct
    if (!Object.values(OpportunityType).includes(opportunityType)) {
      return { success: false, message: "Invalid opportunity type." };
    }

    // Default sections with minimal structured contentJson
    const defaultSections = [
      {
        sectionType: CvSectionType.SUMMARY,
        title: "Summary",
        order: 0,
        contentJson: { text: "" } as JsonObject,
      },
      {
        sectionType: CvSectionType.CONTACT,
        title: "Contact",
        order: 1,
        contentJson: {
          fullName: "",
          email: "",
          phone: "",
          linkedin: "",
          address: "",
        },
      },
      {
        sectionType: CvSectionType.EXPERIENCE,
        title: "Work Experience",
        order: 2,
        contentJson: [], // array of experience items
      },
      {
        sectionType: CvSectionType.EDUCATION,
        title: "Education",
        order: 3,
        contentJson: [], // array of education items
      },
      {
        sectionType: CvSectionType.SKILLS,
        title: "Skills",
        order: 4,
        contentJson: [
          // you may store { name, category } objects or simple strings
        ],
      },
      {
        sectionType: CvSectionType.PROJECTS,
        title: "Projects",
        order: 5,
        contentJson: [],
      },
      {
        sectionType: CvSectionType.CERTIFICATIONS,
        title: "Certifications",
        order: 6,
        contentJson: [],
      },
      {
        sectionType: CvSectionType.LANGUAGES,
        title: "Languages",
        order: 7,
        contentJson: [],
      },
    ];

    // Create the CV and the default sections in one operation so it's atomic.
    const newCv = await prisma.cv.create({
      data: {
        title,
        cvType,
        opportunityType,
        language: Language.EN,
        userId: currentUser.id,
        sections: {
          create: defaultSections.map((s) => ({
            sectionType: s.sectionType,
            title: s.title,
            contentJson: s.contentJson,
            order: s.order,
          })),
        },
      },
      include: {
        sections: true, // return the created sections
      },
    });


    if (!newCv) {
      return { success: false, message: "Error creating CV." };
    }

    return {
      success: true,
      data: newCv,
    };
  } catch (error) {
    console.error("[ERROR_CREATE_CV_BY_TITLE_AND_TYPE]", error);
    return { success: false, message: "Error creating the CV." };
  }
};
