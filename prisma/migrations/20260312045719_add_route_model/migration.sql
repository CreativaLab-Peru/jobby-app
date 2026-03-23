-- CreateEnum (idempotent)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'RouteStatus') THEN
        CREATE TYPE "RouteStatus" AS ENUM ('CV_PENDING', 'CV_CREATED', 'ANALYSIS_PENDING', 'ANALYSIS_DONE', 'OPPORTUNITIES_PENDING', 'OPPORTUNITIES_DONE');
    END IF;
END $$;

ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'CV_PENDING';
ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'CV_CREATED';
ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'ANALYSIS_PENDING';
ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'ANALYSIS_DONE';
ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'OPPORTUNITIES_PENDING';
ALTER TYPE "RouteStatus" ADD VALUE IF NOT EXISTS 'OPPORTUNITIES_DONE';

-- CreateTable
CREATE TABLE IF NOT EXISTS "route" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT,
    "name" TEXT NOT NULL,
    "status" "RouteStatus" NOT NULL DEFAULT 'CV_PENDING',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "route_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "route_cvId_key" ON "route"("cvId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "route_userId_idx" ON "route"("userId");

-- CreateIndex
CREATE INDEX IF NOT EXISTS "route_userId_isActive_idx" ON "route"("userId", "isActive");

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'route_userId_fkey'
    ) THEN
        ALTER TABLE "route" ADD CONSTRAINT "route_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
    END IF;
END $$;

-- AddForeignKey
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'route_cvId_fkey'
    ) THEN
        ALTER TABLE "route" ADD CONSTRAINT "route_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    END IF;
END $$;
