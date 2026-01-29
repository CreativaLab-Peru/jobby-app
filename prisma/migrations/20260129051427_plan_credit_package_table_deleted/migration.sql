/*
  Warnings:

  - You are about to drop the `plan_credit_package` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "plan_credit_package" DROP CONSTRAINT "plan_credit_package_creditId_fkey";

-- DropTable
DROP TABLE "plan_credit_package";
