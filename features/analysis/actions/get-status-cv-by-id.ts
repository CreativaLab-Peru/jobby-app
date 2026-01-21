import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { JobStatus } from "@prisma/client";

export type CvStatus =
  | { status: "CV_IN_PROGRESS" }
  | { status: "CV_FAILED" }
  | { status: "CV_SUCCEEDED" }
  | { status: "CV_EVALUATION_PENDING_EVALUATION" }
  | { status: "CV_EVALUATION_IN_PROGRESS" }
  | { status: "CV_EVALUATION_FAILED" }
  | { status: "CV_EVALUATION_SUCCEEDED", evaluateId: string }
  | { status: "CV_EVALUATION_FINISHED", evaluateId: string }
  | { status: "CV_READY_FOR_ANALYSIS" };

export const getStatusCvById = async (cvId: string): Promise<CvStatus | null> => {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return null;

    const cv = await prisma.cv.findFirst({
      where: { id: cvId },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!cv) return null;

    // Check for queue job (only exists for uploaded CVs)
    const queueJob = await prisma.queueJob.findFirst({
      where: { cvId: cv.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Get latest evaluation
    const evaluateJob = await prisma.cvEvaluation.findFirst({
      where: { cvId: cv.id },
      orderBy: {
        createdAt: "desc",
      },
    });

    // For uploaded CVs (have queueJob)
    if (queueJob) {
      const statusQueueJob = queueJob.status;
      
      if (statusQueueJob === JobStatus.IN_PROGRESS) {
        return { status: "CV_IN_PROGRESS" };
      }

      if (statusQueueJob === JobStatus.FAILED) {
        return { status: "CV_FAILED" };
      }

      if (statusQueueJob === JobStatus.SUCCEEDED && !evaluateJob) {
        return { status: "CV_SUCCEEDED" };
      }
    }

    // For manual CVs or after upload processing is done
    // Check evaluation status
    if (!evaluateJob) {
      // Manual CV ready for analysis (no evaluation yet)
      return { status: "CV_READY_FOR_ANALYSIS" };
    }

    const statusEvaluateJob = evaluateJob.status;
    
    if (statusEvaluateJob === JobStatus.PENDING) {
      return { status: "CV_EVALUATION_PENDING_EVALUATION" };
    }
    
    if (statusEvaluateJob === JobStatus.IN_PROGRESS) {
      return { status: "CV_EVALUATION_IN_PROGRESS" };
    }

    if (statusEvaluateJob === JobStatus.FAILED) {
      return { status: "CV_EVALUATION_FAILED" };
    }

    if (statusEvaluateJob === JobStatus.SUCCEEDED) {
      return { status: "CV_EVALUATION_SUCCEEDED", evaluateId: evaluateJob.id };
    }

    return {
      status: "CV_EVALUATION_FINISHED",
      evaluateId: evaluateJob.id
    }

  } catch (error) {
    console.error("[ERROR_GET_STATUS_CV]", error);
    return null;
  }
};
