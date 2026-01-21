-- CreateEnum
CREATE TYPE "PaymentType" AS ENUM ('SUBSCRIPTION', 'ONE_TIME', 'REFUND', 'FREE');

-- CreateEnum
CREATE TYPE "LogAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'PAYMENT', 'EVALUATION', 'JOB', 'EMAIL', 'FILE_UPLOAD', 'AUTH', 'OPPORTUNITY', 'OTHER');

-- CreateEnum
CREATE TYPE "LogLevel" AS ENUM ('INFO', 'WARNING', 'ERROR', 'CRITICAL');

-- AlterTable
ALTER TABLE "subscription_plan" ADD COLUMN     "paymentType" "PaymentType" NOT NULL DEFAULT 'ONE_TIME',
ALTER COLUMN "manualCvLimit" SET DEFAULT 0,
ALTER COLUMN "uploadCvLimit" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "happensAfterPayment" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "temporal_user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "temporal_user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "opportunity" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "OpportunityType" NOT NULL,
    "deadline" TIMESTAMP(3),
    "match" DECIMAL(5,2) NOT NULL,
    "requirements" TEXT NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "magic_link_token" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "purpose" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedByIp" TEXT,
    "usedByUa" TEXT,
    "metadata" JSONB,

    CONSTRAINT "magic_link_token_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "log_entry" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "email" TEXT,
    "action" "LogAction" NOT NULL,
    "entity" TEXT,
    "entityId" TEXT,
    "level" "LogLevel" NOT NULL DEFAULT 'INFO',
    "message" TEXT NOT NULL,
    "metadata" JSONB,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "log_entry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "temporal_user_email_key" ON "temporal_user"("email");

-- CreateIndex
CREATE INDEX "magic_link_token_userId_idx" ON "magic_link_token"("userId");

-- CreateIndex
CREATE INDEX "magic_link_token_tokenHash_idx" ON "magic_link_token"("tokenHash");

-- CreateIndex
CREATE INDEX "log_entry_userId_idx" ON "log_entry"("userId");

-- CreateIndex
CREATE INDEX "log_entry_entity_entityId_idx" ON "log_entry"("entity", "entityId");

-- CreateIndex
CREATE INDEX "log_entry_action_idx" ON "log_entry"("action");

-- CreateIndex
CREATE INDEX "log_entry_level_idx" ON "log_entry"("level");

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "magic_link_token" ADD CONSTRAINT "magic_link_token_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "log_entry" ADD CONSTRAINT "log_entry_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
