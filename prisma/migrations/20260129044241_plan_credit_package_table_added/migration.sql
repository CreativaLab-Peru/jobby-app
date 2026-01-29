-- CreateTable
CREATE TABLE "plan_credit_package" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "creditId" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "type" "CreditBalanceType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "plan_credit_package_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "plan_credit_package_creditId_idx" ON "plan_credit_package"("creditId");

-- AddForeignKey
ALTER TABLE "plan_credit_package" ADD CONSTRAINT "plan_credit_package_creditId_fkey" FOREIGN KEY ("creditId") REFERENCES "credit_package"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
