-- AlterTable
ALTER TABLE "credit_package" ADD COLUMN     "planId" TEXT;

-- CreateIndex
CREATE INDEX "credit_package_planId_idx" ON "credit_package"("planId");

-- AddForeignKey
ALTER TABLE "credit_package" ADD CONSTRAINT "credit_package_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plan"("id") ON DELETE SET NULL ON UPDATE CASCADE;
