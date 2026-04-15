/*
  Warnings:

  - You are about to drop the column `cvId` on the `cv_evaluation_prompt` table. All the data in the column will be lost.
  - You are about to drop the column `evaluationId` on the `cv_evaluation_prompt` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `cv_evaluation_prompt` table. All the data in the column will be lost.
  - Added the required column `beca` to the `cv_evaluation_prompt` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "cv_evaluation_prompt" DROP CONSTRAINT "cv_evaluation_prompt_cvId_fkey";

-- DropForeignKey
ALTER TABLE "cv_evaluation_prompt" DROP CONSTRAINT "cv_evaluation_prompt_evaluationId_fkey";

-- DropForeignKey
ALTER TABLE "cv_evaluation_prompt" DROP CONSTRAINT "cv_evaluation_prompt_userId_fkey";

-- DropIndex
DROP INDEX "cv_evaluation_prompt_evaluationId_idx";

-- DropIndex
DROP INDEX "cv_evaluation_prompt_userId_createdAt_idx";

-- AlterTable
ALTER TABLE "cv_evaluation_prompt" DROP COLUMN "cvId",
DROP COLUMN "evaluationId",
DROP COLUMN "userId",
ADD COLUMN     "beca" TEXT NOT NULL;
