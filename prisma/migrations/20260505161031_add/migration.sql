-- CreateTable
CREATE TABLE "interview_attempt" (
    "id" TEXT NOT NULL,
    "interviewSessionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plannedSeconds" INTEGER NOT NULL,
    "secondsUsed" INTEGER NOT NULL DEFAULT 0,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),
    "finishReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "interview_attempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_attempt_interviewSessionId_key" ON "interview_attempt"("interviewSessionId");

-- CreateIndex
CREATE INDEX "interview_attempt_userId_createdAt_idx" ON "interview_attempt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "interview_attempt_interviewSessionId_idx" ON "interview_attempt"("interviewSessionId");

-- AddForeignKey
ALTER TABLE "interview_attempt" ADD CONSTRAINT "interview_attempt_interviewSessionId_fkey" FOREIGN KEY ("interviewSessionId") REFERENCES "interview_session"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_attempt" ADD CONSTRAINT "interview_attempt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
