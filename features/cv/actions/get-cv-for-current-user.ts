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

    const [cvs, userSubscription] = await Promise.all([
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
      prisma.userPayment.findFirst({
        where: {
          userId: user.id,
          expiresAt: { gt: new Date() },
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

    const activeManualSubscription = userSubscription
      ? userSubscription.manualCvsUsed < userSubscription.plan?.manualCvLimit
      : false;

    const activeUploadSubscription = userSubscription
      ? userSubscription.uploadCvsUsed < userSubscription.plan?.uploadCvLimit
      : false;

    const response: CvForCurrentUserResponse = {
      manuals: {
        cvs: manuals,
        activeSubscription: activeManualSubscription,
      },
      uploads: {
        cvs: uploads,
        activeSubscription: activeUploadSubscription,
      },
    };


    return response;

  } catch (error) {
    console.error("[GET_CV_FOR_CURRENT_USER_ERROR]", error);
    return;
  }
};