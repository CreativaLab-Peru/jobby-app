/*
  Warnings:

  - You are about to drop the column `currency` on the `subscription_plan` table. All the data in the column will be lost.
  - You are about to drop the column `priceCents` on the `subscription_plan` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[routeId]` on the table `roadmap` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `routeId` to the `roadmap` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "opportunity" ADD COLUMN     "routeId" TEXT;

-- AlterTable
ALTER TABLE "roadmap" ADD COLUMN     "routeId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "subscription_plan" DROP COLUMN "currency",
DROP COLUMN "priceCents";

-- CreateIndex
CREATE UNIQUE INDEX "roadmap_routeId_key" ON "roadmap"("routeId");

-- AddForeignKey
ALTER TABLE "opportunity" ADD CONSTRAINT "opportunity_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap" ADD CONSTRAINT "roadmap_routeId_fkey" FOREIGN KEY ("routeId") REFERENCES "route"("id") ON DELETE CASCADE ON UPDATE CASCADE;
