-- AlterTable
ALTER TABLE "subscription_plan" 
ADD COLUMN "priceCentsPEN" DECIMAL(10,2),
ADD COLUMN "priceCentsUSD" DECIMAL(10,2),
ADD COLUMN "paddleProductId" TEXT,
ADD COLUMN "paddlePriceIdUSD" TEXT;

-- Create indexes for Paddle IDs
CREATE INDEX IF NOT EXISTS "subscription_plan_paddleProductId_idx" ON "subscription_plan"("paddleProductId");
CREATE INDEX IF NOT EXISTS "subscription_plan_paddlePriceIdUSD_idx" ON "subscription_plan"("paddlePriceIdUSD");
