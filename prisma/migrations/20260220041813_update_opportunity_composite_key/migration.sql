/*
  Warnings:

  - The primary key for the `opportunity` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "opportunity" DROP CONSTRAINT "opportunity_cvId_fkey";

-- AlterTable
ALTER TABLE "opportunity" DROP CONSTRAINT "opportunity_pkey",
ADD CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id", "cvId");

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;
