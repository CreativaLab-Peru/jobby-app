-- CreateTable
CREATE TABLE "cv_evaluation_prompt" (
    "id" TEXT NOT NULL,
    "evaluationId" TEXT NOT NULL,
    "cvId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cv_evaluation_prompt_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "user_beca_param" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "beca" TEXT NOT NULL,
    "usedAt" TIMESTAMP(3),
    "evaluationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "user_beca_param_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "cv_evaluation_prompt_evaluationId_idx" ON "cv_evaluation_prompt"("evaluationId");

-- CreateIndex
CREATE INDEX "cv_evaluation_prompt_userId_createdAt_idx" ON "cv_evaluation_prompt"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "user_beca_param_userId_usedAt_idx" ON "user_beca_param"("userId", "usedAt");

-- AddForeignKey
ALTER TABLE "cv_evaluation_prompt" ADD CONSTRAINT "cv_evaluation_prompt_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "cv_evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_evaluation_prompt" ADD CONSTRAINT "cv_evaluation_prompt_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "cv"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cv_evaluation_prompt" ADD CONSTRAINT "cv_evaluation_prompt_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_beca_param" ADD CONSTRAINT "user_beca_param_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_beca_param" ADD CONSTRAINT "user_beca_param_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "cv_evaluation"("id") ON DELETE SET NULL ON UPDATE CASCADE;
