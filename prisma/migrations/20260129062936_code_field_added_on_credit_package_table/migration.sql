/*
  Warnings:

  - Added the required column `code` to the `credit_package` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "credit_package" ADD COLUMN     "code" TEXT NOT NULL;
