-- CreateEnum
CREATE TYPE "Language" AS ENUM ('EN', 'ES');

-- CreateEnum
CREATE TYPE "OpportunityType" AS ENUM ('INTERNSHIP', 'SCHOLARSHIP', 'EXCHANGE_PROGRAM', 'EMPLOYMENT', 'RESEARCH_FELLOWSHIP', 'GRADUATE_PROGRAM', 'FREELANCE', 'FULL_TIME', 'PART_TIME');

-- CreateEnum
CREATE TYPE "CvType" AS ENUM ('TECHNOLOGY_ENGINEERING', 'DESIGN_CREATIVITY', 'MARKETING_STRATEGY', 'MANAGEMENT_BUSINESS', 'FINANCE_PROJECTS', 'SOCIAL_MEDIA', 'EDUCATION', 'SCIENCE');

-- CreateEnum
CREATE TYPE "CvSectionType" AS ENUM ('SUMMARY', 'EXPERIENCE', 'EDUCATION', 'SKILLS', 'PROJECTS', 'VOLUNTEERING', 'CERTIFICATIONS', 'LANGUAGES', 'CONTACT', 'COMPLEMENTS', 'ACHIEVEMENTS', 'INTERESTS');

-- CreateEnum
CREATE TYPE "JobStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'SUCCEEDED', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL,
    "image" TEXT,
    "updatedPassword" BOOLEAN NOT NULL DEFAULT false,
    "isBlocked" BOOLEAN NOT NULL DEFAULT false,
    "lastLoginAt" TIMESTAMP(3),
    "acceptedTermsAndConditions" BOOLEAN NOT NULL DEFAULT false,
    "acceptedTermsAt" TIMESTAMP(3),
    "acceptedPrivacyPolicy" BOOLEAN NOT NULL DEFAULT false,
    "acceptedPrivacyPolicyAt" TIMESTAMP(3),
    "acceptedCookiePolicy" BOOLEAN NOT NULL DEFAULT false,
    "acceptedSecurityPolicy" BOOLEAN NOT NULL DEFAULT false,
    "acceptedSecurityPolicyAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "session" (
    "id" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "ipAddress" TEXT,
    "userAgent" TEXT,
    "userId" TEXT NOT NULL,

    CONSTRAINT "session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "account" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "providerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT,
    "refreshToken" TEXT,
    "idToken" TEXT,
    "accessTokenExpiresAt" TIMESTAMP(3),
    "refreshTokenExpiresAt" TIMESTAMP(3),
    "scope" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscription_plan" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priceCents" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "currency" TEXT NOT NULL DEFAULT 'USD',
    "features" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "manualCvLimit" INTEGER NOT NULL DEFAULT 2,
    "uploadCvLimit" INTEGER NOT NULL DEFAULT 2,

    CONSTRAINT "subscription_plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "manualCvsUsed" INTEGER NOT NULL DEFAULT 0,
    "uploadCvsUsed" INTEGER NOT NULL DEFAULT 0,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "createdByJobId" TEXT,
    "language" "Language" NOT NULL DEFAULT 'EN',
    "opportunityType" "OpportunityType" NOT NULL,
    "cvType" "CvType" NOT NULL,
    "title" TEXT,
    "extractedJson" JSONB,
    "fullTextSearch" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),
    "notes" TEXT,

    CONSTRAINT "cv_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_section" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "sectionType" "CvSectionType" NOT NULL,
    "title" TEXT,
    "contentJson" JSONB,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_evaluation" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "overallScore" DOUBLE PRECISION,
    "summary" TEXT,
    "extractorOutput" JSONB,
    "createdByJobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cv_evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evaluation_score" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "sectionType" "CvSectionType" NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION,
    "detailsJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evaluation_score_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "recommendation" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "sectionType" "CvSectionType",
    "text" TEXT NOT NULL,
    "severity" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "recommendation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cv_preview" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "snapshotHtml" TEXT,
    "snapshotJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdBy" TEXT,
    "note" TEXT,

    CONSTRAINT "cv_preview_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attachment" (
    "id" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mimeType" TEXT,
    "url" TEXT NOT NULL,
    "size" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "queue_job" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "status" "JobStatus" NOT NULL DEFAULT 'PENDING',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "maxAttempts" INTEGER NOT NULL DEFAULT 5,
    "lastError" TEXT,
    "startedAt" TIMESTAMP(3),
    "finishedAt" TIMESTAMP(3),
    "cvId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "queue_job_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- CreateIndex
CREATE UNIQUE INDEX "session_token_key" ON "session"("token");

-- CreateIndex
CREATE UNIQUE INDEX "subscription_plan_slug_key" ON "subscription_plan"("slug");

-- CreateIndex
CREATE INDEX "user_subscription_userId_idx" ON "user_subscription"("userId");

-- CreateIndex
CREATE INDEX "user_subscription_planId_idx" ON "user_subscription"("planId");

-- CreateIndex
CREATE INDEX "user_subscription_active_idx" ON "user_subscription"("active");

-- CreateIndex
CREATE INDEX "cv_userId_idx" ON "cv"("userId");

-- CreateIndex
CREATE INDEX "cv_language_idx" ON "cv"("language");

-- CreateIndex
CREATE INDEX "cv_opportunityType_idx" ON "cv"("opportunityType");

-- CreateIndex
CREATE INDEX "cv_cvType_idx" ON "cv"("cvType");

-- CreateIndex
CREATE INDEX "cv_section_cvId_sectionType_idx" ON "cv_section"("cvId", "sectionType");

-- CreateIndex
CREATE INDEX "cv_section_cvId_order_idx" ON "cv_section"("cvId", "order");

-- CreateIndex
CREATE INDEX "cv_evaluation_cvId_idx" ON "cv_evaluation"("cvId");

-- CreateIndex
CREATE INDEX "cv_evaluation_status_idx" ON "cv_evaluation"("status");

-- CreateIndex
CREATE INDEX "cv_evaluation_createdAt_idx" ON "cv_evaluation"("createdAt");

-- CreateIndex
CREATE INDEX "evaluation_score_evaluationId_sectionType_idx" ON "evaluation_score"("evaluationId", "sectionType");

-- CreateIndex
CREATE INDEX "recommendation_evaluationId_idx" ON "recommendation"("evaluationId");

-- CreateIndex
CREATE INDEX "cv_preview_cvId_createdAt_idx" ON "cv_preview"("cvId", "createdAt");

-- CreateIndex
CREATE INDEX "attachment_cvId_idx" ON "attachment"("cvId");

-- CreateIndex
CREATE UNIQUE INDEX "queue_job_jobId_key" ON "queue_job"("jobId");

-- CreateIndex
CREATE INDEX "queue_job_status_idx" ON "queue_job"("status");

-- CreateIndex
CREATE INDEX "queue_job_type_idx" ON "queue_job"("type");

-- CreateIndex
CREATE INDEX "queue_job_cvId_idx" ON "queue_job"("cvId");

-- AddForeignKey
ALTER TABLE "session" ADD CONSTRAINT "session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "account" ADD CONSTRAINT "account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_subscription" ADD CONSTRAINT "user_subscription_planId_fkey" FOREIGN KEY ("planId") REFERENCES "subscription_plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv" ADD CONSTRAINT "cv_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_section" ADD CONSTRAINT "cv_section_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_evaluation" ADD CONSTRAINT "cv_evaluation_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evaluation_score" ADD CONSTRAINT "evaluation_score_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "cv_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "recommendation" ADD CONSTRAINT "recommendation_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "cv_evaluation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_preview" ADD CONSTRAINT "cv_preview_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attachment" ADD CONSTRAINT "attachment_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "queue_job" ADD CONSTRAINT "queue_job_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
