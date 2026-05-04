-- CreateEnum
CREATE TYPE "CompanyRole" AS ENUM ('ADMIN', 'ENCARGADO', 'SUB_ENCARGADO', 'MIEMBRO');

-- CreateEnum
CREATE TYPE "CompanySeekingType" AS ENUM ('TALENT', 'SCHOLARSHIPS', 'EMPLOYMENT');

-- CreateEnum
CREATE TYPE "CompanyOnboardingStatus" AS ENUM ('STEP_1', 'STEP_2', 'STEP_3', 'COMPLETED');

-- CreateEnum
CREATE TYPE "InvitationStatus" AS ENUM ('PENDING', 'ACCEPTED', 'EXPIRED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "MemberStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'SUSPENDED');

-- CreateTable
CREATE TABLE "company" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "logoUrl" TEXT,
    "ruc" TEXT,
    "website" TEXT,
    "primaryColor" TEXT,
    "seekingTypes" "CompanySeekingType"[],
    "onboardingStep" "CompanyOnboardingStatus" NOT NULL DEFAULT 'STEP_1',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_member" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL DEFAULT 'MIEMBRO',
    "status" "MemberStatus" NOT NULL DEFAULT 'ACTIVE',
    "invitedBy" TEXT,
    "joinedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_invitation" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL DEFAULT 'MIEMBRO',
    "token" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "codeHash" TEXT NOT NULL,
    "status" "InvitationStatus" NOT NULL DEFAULT 'PENDING',
    "invitedBy" TEXT,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "usedAt" TIMESTAMP(3),
    "usedByIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_invitation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_notification" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT,
    "metadata" JSONB,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "company_notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "feature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permission" (
    "id" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "role" "CompanyRole" NOT NULL,
    "canRead" BOOLEAN NOT NULL DEFAULT false,
    "canWrite" BOOLEAN NOT NULL DEFAULT false,
    "canDelete" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "role_permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "company_feature_flag" (
    "id" TEXT NOT NULL,
    "companyId" TEXT NOT NULL,
    "featureId" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "overrideBy" TEXT,
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "company_feature_flag_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "company_slug_key" ON "company"("slug");

-- CreateIndex
CREATE INDEX "company_member_companyId_role_idx" ON "company_member"("companyId", "role");

-- CreateIndex
CREATE INDEX "company_member_userId_idx" ON "company_member"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_member_companyId_userId_key" ON "company_member"("companyId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "company_invitation_token_key" ON "company_invitation"("token");

-- CreateIndex
CREATE INDEX "company_invitation_companyId_status_idx" ON "company_invitation"("companyId", "status");

-- CreateIndex
CREATE INDEX "company_invitation_email_idx" ON "company_invitation"("email");

-- CreateIndex
CREATE INDEX "company_invitation_token_idx" ON "company_invitation"("token");

-- CreateIndex
CREATE INDEX "company_notification_companyId_userId_readAt_idx" ON "company_notification"("companyId", "userId", "readAt");

-- CreateIndex
CREATE UNIQUE INDEX "role_permission_featureId_role_key" ON "role_permission"("featureId", "role");

-- CreateIndex
CREATE INDEX "company_feature_flag_companyId_enabled_idx" ON "company_feature_flag"("companyId", "enabled");

-- CreateIndex
CREATE UNIQUE INDEX "company_feature_flag_companyId_featureId_key" ON "company_feature_flag"("companyId", "featureId");

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_member" ADD CONSTRAINT "company_member_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_invitation" ADD CONSTRAINT "company_invitation_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_notification" ADD CONSTRAINT "company_notification_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permission" ADD CONSTRAINT "role_permission_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_feature_flag" ADD CONSTRAINT "company_feature_flag_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "company"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "company_feature_flag" ADD CONSTRAINT "company_feature_flag_featureId_fkey" FOREIGN KEY ("featureId") REFERENCES "feature"("id") ON DELETE CASCADE ON UPDATE CASCADE;
