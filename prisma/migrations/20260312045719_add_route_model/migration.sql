-- CreateEnum
CREATE TYPE "RouteStatus" AS ENUM ('CV_PENDING', 'CV_CREATED', 'ANALYSIS_PENDING', 'ANALYSIS_DONE', 'OPPORTUNITIES_PENDING', 'OPPORTUNITIES_DONE');

-- CreateTable
CREATE TABLE "route" (
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
CREATE UNIQUE INDEX "route_cvId_key" ON "route"("cvId");

-- CreateIndex
CREATE INDEX "route_userId_idx" ON "route"("userId");

-- CreateIndex
CREATE INDEX "route_userId_isActive_idx" ON "route"("userId", "isActive");

-- AddForeignKey
ALTER TABLE "route" ADD CONSTRAINT "route_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "route" ADD CONSTRAINT "route_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE SET NULL ON UPDATE CASCADE;
