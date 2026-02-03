/*
  Warnings:

  - Changed the type of `type` on the `user_credit_balance` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "user_credit_balance" DROP COLUMN "type",
ADD COLUMN     "type" "CreditBalanceType" NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "user_credit_balance_userId_type_key" ON "user_credit_balance"("userId", "type");
