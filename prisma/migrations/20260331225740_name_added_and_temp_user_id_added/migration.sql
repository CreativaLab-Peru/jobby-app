/*
  Warnings:

  - You are about to drop the `TempCvWithEvaluation` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "TempCvWithEvaluation";

-- CreateTable
CREATE TABLE "temp_cv_with_evaluation" (
    "id" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "tempUserId" TEXT,
    "overallScore" DOUBLE PRECISION,
    "extractorOutput" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "temp_cv_with_evaluation_pkey" PRIMARY KEY ("id")
);
