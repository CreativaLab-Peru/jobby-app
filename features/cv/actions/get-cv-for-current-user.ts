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

    const response: CvForCurrentUserResponse = {
      manuals: {
        cvs: [...manuals, ...uploads],
        activeSubscription: false,
      },
      uploads: {
        cvs: uploads,
        activeSubscription: false,
      },
    };

    return response;

  } catch (error) {
    console.error("[GET_CV_FOR_CURRENT_USER_ERROR]", error);
    return;
  }
};
