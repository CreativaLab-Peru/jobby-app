-- CreateTable
CREATE TABLE "complaint" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "complaint" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "complaint_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "complaint_userId_createdAt_idx" ON "complaint"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "complaint" ADD CONSTRAINT "complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
