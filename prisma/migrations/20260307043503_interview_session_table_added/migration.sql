-- CreateTable
CREATE TABLE "interview_session" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "opportunityId" TEXT NOT NULL,
    "vapiCallId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'COMPLETED',
    "overallScore" INTEGER,
    "confidence" INTEGER,
    "clarity" INTEGER,
    "alignment" INTEGER,
    "feedback" TEXT,
    "transcript" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "interview_session_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "interview_session_vapiCallId_key" ON "interview_session"("vapiCallId");

-- CreateIndex
CREATE INDEX "interview_session_userId_idx" ON "interview_session"("userId");

-- CreateIndex
CREATE INDEX "interview_session_opportunityId_cvId_idx" ON "interview_session"("opportunityId", "cvId");

-- AddForeignKey
ALTER TABLE "interview_session" ADD CONSTRAINT "interview_session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_session" ADD CONSTRAINT "interview_session_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interview_session" ADD CONSTRAINT "interview_session_opportunityId_cvId_fkey" FOREIGN KEY ("opportunityId", "cvId") REFERENCES "opportunity"("id", "cvId") ON DELETE RESTRICT ON UPDATE CASCADE;
