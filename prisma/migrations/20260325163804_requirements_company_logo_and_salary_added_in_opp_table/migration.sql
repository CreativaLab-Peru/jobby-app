-- AlterTable
ALTER TABLE "opportunity" ADD COLUMN     "companyLogoUrl" TEXT,
ADD COLUMN     "maxSalary" TEXT,
ADD COLUMN     "minSalary" TEXT,
ADD COLUMN     "optionalRequirements" TEXT,
ADD COLUMN     "requiredRequirements" TEXT,
ALTER COLUMN "requirements" DROP NOT NULL;
