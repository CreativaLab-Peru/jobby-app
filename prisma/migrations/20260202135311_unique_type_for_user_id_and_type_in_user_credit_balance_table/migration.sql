/*
  Warnings:

  - A unique constraint covering the columns `[userId,type]` on the table `user_credit_balance` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "user_credit_balance_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "user_credit_balance_userId_type_key" ON "user_credit_balance"("userId", "type");
