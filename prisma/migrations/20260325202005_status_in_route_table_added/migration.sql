-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "RouteStatus" ADD VALUE 'ROADMAP_IN_PROGRESS';
ALTER TYPE "RouteStatus" ADD VALUE 'PROGRAM_PENDING';
ALTER TYPE "RouteStatus" ADD VALUE 'PROGRAM_IN_PROGRESS';
ALTER TYPE "RouteStatus" ADD VALUE 'PROGRAM_DONE';
