/*
  Warnings:

  - You are about to drop the `CvSectionConfiguration` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "CvSectionConfiguration";

-- CreateTable
CREATE TABLE "cv_section_configuration" (
    "id" TEXT NOT NULL,
    "cvType" "CvType" NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_section_configuration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "cv_section_configuration_cvType_opportunityType_key" ON "cv_section_configuration"("cvType", "opportunityType");
