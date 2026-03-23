/*
  Warnings:

  - A unique constraint covering the columns `[opportunityId,cvId,userId,routeId]` on the table `roadmap` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "roadmap_opportunityId_cvId_userId_key";

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_opportunityId_cvId_userId_routeId_key" ON "roadmap"("opportunityId", "cvId", "userId", "routeId");
