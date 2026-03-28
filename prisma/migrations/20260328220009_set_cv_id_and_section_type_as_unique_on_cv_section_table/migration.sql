/*
  Warnings:

  - A unique constraint covering the columns `[cvId,sectionType]` on the table `cv_section` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "cv_section_cvId_sectionType_key" ON "cv_section"("cvId", "sectionType");
