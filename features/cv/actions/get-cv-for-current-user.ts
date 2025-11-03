import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { Cv, CvEvaluation, CvPreview, CvSection, QueueJob, EvaluationScore, Recommendation } from "@prisma/client";

export type CvWithRelations = Cv & {
  evaluations: (CvEvaluation & {
    scores: EvaluationScore[];
    recommendations: Recommendation[];
  })[];
  sections: CvSection[];
  previews: CvPreview[];
  queueJobs: QueueJob[];
};

export type CvForCurrentUserResponse = {
  manuals: {
    cvs: CvWithRelations[];
    activeSubscription: boolean;
  };
  uploads: {
    cvs: CvWithRelations[];
    activeSubscription: boolean;
  };
};

export const getCvForCurrentUser = async () => {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return;
    }

    const [cvs, userPayments] = await Promise.all([
      prisma.cv.findMany({
        where: {
          userId: user.id,
          deletedAt: null,
        },
        include: {
          evaluations: {
            include: {
              scores: true,
              recommendations: true,
            },
            orderBy: {
              createdAt: "desc",
            },
            take: 1
          },
          sections: {
            orderBy: {
              order: "asc",
            }
          },
          previews: {
            orderBy: {
              createdAt: "desc"
            },
            take: 1
          },
          queueJobs: {
            orderBy: {
              createdAt: "desc"
            },
            take: 1
          }
        },
        orderBy: {
          createdAt: "desc",
        }
      }),
      prisma.userPayment.findMany({
        where: {
          userId: user.id,
        },
        include: {
          plan: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    ]);

    const manuals = cvs.filter(cv => cv.createdByJobId === null);
    const uploads = cvs.filter(cv => cv.createdByJobId !== null);

    const totalManualCvsUsed = userPayments.reduce(
      (acc, item) => acc + (item.manualCvsUsed || 0),
      0
    );
    const totalUploadCvUsed = userPayments.reduce(
      (acc, item) => acc + (item.uploadCvsUsed || 0),
      0
    );

    const totalAvailableManualCv = userPayments.reduce(
      (acc, item) => acc + (item.plan.manualCvLimit || 0),
      0
    )
    const totalAvailableUploadCv = userPayments.reduce(
      (acc, item) => acc + (item.plan.uploadCvLimit || 0),
      0
    )

    console.log("totalManualCvsUsed", totalManualCvsUsed, totalAvailableManualCv)
    console.log("totalUploadCvUsed", totalUploadCvUsed, totalAvailableUploadCv)

    const response: CvForCurrentUserResponse = {
      manuals: {
        cvs: manuals,
        activeSubscription: totalManualCvsUsed === totalAvailableManualCv ? false : true,
      },
      uploads: {
        cvs: uploads,
        activeSubscription: totalUploadCvUsed === totalAvailableUploadCv ? false : true,
      },
    };


    return response;

  } catch (error) {
    console.error("[GET_CV_FOR_CURRENT_USER_ERROR]", error);
    return;
  }
};