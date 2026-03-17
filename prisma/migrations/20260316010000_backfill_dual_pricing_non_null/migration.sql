-- Backfill dual-pricing values for existing plans
UPDATE "subscription_plan"
SET
  "priceCentsPEN" = COALESCE(
    "priceCentsPEN",
    CASE
      WHEN "slug" = 'free' THEN 0
      WHEN "slug" = 'starter' THEN 1990
      WHEN "slug" = 'pro' THEN 2990
      ELSE 0
    END
  ),
  "priceCentsUSD" = COALESCE(
    "priceCentsUSD",
    CASE
      WHEN "slug" = 'free' THEN 0
      WHEN "slug" = 'starter' THEN 600
      WHEN "slug" = 'pro' THEN 900
      ELSE 0
    END
  );

-- Keep schema and DB aligned: both fields are required in Prisma schema
ALTER TABLE "subscription_plan"
ALTER COLUMN "priceCentsPEN" SET NOT NULL,
ALTER COLUMN "priceCentsUSD" SET NOT NULL;
