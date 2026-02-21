-- 1. Limpieza
UPDATE "cv" SET "opportunityType" = 'INTERNSHIP' WHERE "opportunityType"::text IN ('RESEARCH_FELLOWSHIP', 'GRADUATE_PROGRAM');
UPDATE "opportunity" SET "type" = 'INTERNSHIP' WHERE "type"::text IN ('RESEARCH_FELLOWSHIP', 'GRADUATE_PROGRAM');
UPDATE "cv" SET "opportunityType" = 'EMPLOYMENT' WHERE "opportunityType"::text IN ('FREELANCE', 'FULL_TIME', 'PART_TIME');
UPDATE "opportunity" SET "type" = 'EMPLOYMENT' WHERE "type"::text IN ('FREELANCE', 'FULL_TIME', 'PART_TIME');

-- 2. Cambio de Enum (Si el tipo OpportunityType_new ya existe de un intento fallido, bórralo primero con: DROP TYPE IF EXISTS "OpportunityType_new" CASCADE;)
BEGIN;
CREATE TYPE "OpportunityType_new" AS ENUM ('INTERNSHIP', 'SCHOLARSHIP', 'EXCHANGE_PROGRAM', 'EMPLOYMENT');
ALTER TABLE "cv" ALTER COLUMN "opportunityType" TYPE "OpportunityType_new" USING ("opportunityType"::text::"OpportunityType_new");
ALTER TABLE "opportunity" ALTER COLUMN "type" TYPE "OpportunityType_new" USING ("type"::text::"OpportunityType_new");
ALTER TYPE "OpportunityType" RENAME TO "OpportunityType_old";
ALTER TYPE "OpportunityType_new" RENAME TO "OpportunityType";
DROP TYPE "OpportunityType_old";
COMMIT;
