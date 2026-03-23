-- AlterTable
ALTER TABLE "roadmap_step" ADD COLUMN     "exampleStrong" TEXT,
ADD COLUMN     "exampleWeak" TEXT,
ADD COLUMN     "sourceInsights" JSONB,
ADD COLUMN     "tags" TEXT[];
