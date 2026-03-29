-- CreateTable
CREATE TABLE "CvSectionConfiguration" (
    "id" TEXT NOT NULL,
    "cvType" "CvType" NOT NULL,
    "opportunityType" "OpportunityType" NOT NULL,
    "sections" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CvSectionConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CvSectionConfiguration_cvType_opportunityType_key" ON "CvSectionConfiguration"("cvType", "opportunityType");
