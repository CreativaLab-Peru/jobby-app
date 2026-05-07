/*
  Warnings:

  - You are about to drop the column `seekingTypes` on the `company` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "company" DROP COLUMN "seekingTypes";

-- CreateTable
CREATE TABLE "company_preference" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "seekingTypes" "CompanySeekingType"[],
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_preference_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_preference_companyId_key" ON "company_preference"("companyId");

-- AddForeignKey
ALTER TABLE "company_preference" ADD CONSTRAINT "company_preference_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;
