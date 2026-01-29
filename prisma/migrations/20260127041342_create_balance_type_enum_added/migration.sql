/*
  Warnings:

  - Added the required column `type` to the `user_credit_balance` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "CreditBalanceType" AS ENUM ('AI_ACTIONS', 'UPLOADS', 'MANAGE_CVS');

-- AlterTable
ALTER TABLE "user_credit_balance" ADD COLUMN     "type" TEXT NOT NULL;
