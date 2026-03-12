-- CreateTable
CREATE TABLE "cv_photo" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "publicId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_photo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_photo_userId_idx" ON "cv_photo"("userId");

-- AddForeignKey
ALTER TABLE "cv_photo" ADD CONSTRAINT "cv_photo_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
