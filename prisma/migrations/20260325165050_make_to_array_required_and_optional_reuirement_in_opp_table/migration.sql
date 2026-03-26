/*
  Warnings:

  - The `optionalRequirements` column on the `opportunity` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `requiredRequirements` column on the `opportunity` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "opportunity" DROP COLUMN "optionalRequirements",
ADD COLUMN     "optionalRequirements" TEXT[],
DROP COLUMN "requiredRequirements",
ADD COLUMN     "requiredRequirements" TEXT[];
