-- AlterTable
ALTER TABLE "queue_job" ADD COLUMN     "userId" TEXT;

-- AddForeignKey
ALTER TABLE "queue_job" ADD CONSTRAINT "queue_job_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
