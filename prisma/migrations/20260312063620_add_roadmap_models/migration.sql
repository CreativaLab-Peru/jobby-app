-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RouteStatus" ADD VALUE 'ROADMAP_PENDING';
ALTER TYPE "RouteStatus" ADD VALUE 'ROADMAP_DONE';

-- CreateTable
CREATE TABLE "roadmap" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "title" TEXT,
    "summary" TEXT,
    "createdByJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "roadmap_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "roadmap_step" (
    "id" TEXT NOT NULL,
    "roadmapId" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actionItems" JSONB NOT NULL,
    "estimatedDays" INTEGER,
    "resources" JSONB,
    "isFree" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "roadmap_step_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "roadmap_userId_idx" ON "roadmap"("userId");

-- CreateIndex
CREATE INDEX "roadmap_cvId_idx" ON "roadmap"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_opportunityId_cvId_userId_key" ON "roadmap"("opportunityId", "cvId", "userId");

-- CreateIndex
CREATE INDEX "roadmap_step_roadmapId_order_idx" ON "roadmap_step"("roadmapId", "order");

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_opportunityId_cvId_fkey" FOREIGN KEY ("opportunityId", "cvId") REFERENCES "opportunity"("id", "cvId") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_step" ADD CONSTRAINT "roadmap_step_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmap"("id") ON DELETE CASCADE ON UPDATE CASCADE;
