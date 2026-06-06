-- CreateEnum
CREATE TYPE "ScholarshipType" AS ENUM ('MASTER', 'PHD', 'FELLOWSHIP');

-- CreateEnum
CREATE TYPE "DiagnosticStatus" AS ENUM ('PENDING', 'CV_UPLOADED', 'PROCESSING', 'COMPLETED');

-- CreateTable
CREATE TABLE "country" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "flag" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "country_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scholarship_opportunity" (
    "id" TEXT NOT NULL,
    "countryId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "ScholarshipType" NOT NULL,
    "requirements" TEXT[],
    "benefits" TEXT[],
    "deadline" TIMESTAMP(3),
    "url" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "scholarship_opportunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_session" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "status" "DiagnosticStatus" NOT NULL DEFAULT 'PENDING',
    "countries" TEXT[],
    "scholarshipType" "ScholarshipType",
    "area" TEXT,
    "cvUrl" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "diagnostic_result" (
    "id" TEXT NOT NULL,
    "sessionId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "resultJson" JSONB NOT NULL,
    "overallScore" DOUBLE PRECISION,
    "profileType" TEXT,
    "profileDescription" TEXT,
    "recommendations" JSONB,
    "opportunities" JSONB,
    "emailSent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "diagnostic_result_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "country_code_key" ON "country"("code");

-- CreateIndex
CREATE INDEX "scholarship_opportunity_countryId_idx" ON "scholarship_opportunity"("countryId");

-- CreateIndex
CREATE INDEX "scholarship_opportunity_type_idx" ON "scholarship_opportunity"("type");

-- CreateIndex
CREATE INDEX "scholarship_opportunity_isActive_idx" ON "scholarship_opportunity"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_session_token_key" ON "diagnostic_session"("token");

-- CreateIndex
CREATE INDEX "diagnostic_session_token_idx" ON "diagnostic_session"("token");

-- CreateIndex
CREATE INDEX "diagnostic_session_email_idx" ON "diagnostic_session"("email");

-- CreateIndex
CREATE UNIQUE INDEX "diagnostic_result_sessionId_key" ON "diagnostic_result"("sessionId");

-- CreateIndex
CREATE INDEX "diagnostic_result_email_idx" ON "diagnostic_result"("email");

-- CreateIndex
CREATE INDEX "diagnostic_result_sessionId_idx" ON "diagnostic_result"("sessionId");

-- AddForeignKey
ALTER TABLE "scholarship_opportunity" ADD CONSTRAINT "scholarship_opportunity_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "diagnostic_result" ADD CONSTRAINT "diagnostic_result_sessionId_fkey" FOREIGN KEY ("sessionId") REFERENCES "diagnostic_session"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
