import { PrismaClient } from "@prisma/client";
import {seedRoutesForExistingUsers} from "@/prisma/seed/5-seed-routes-for-existing-users";
import {publicitySuggestionsConfiguration} from "@/prisma/seed/4-publicity-suggestions-configuration";
import {cvSectionConfiguration} from "@/prisma/seed/3-conf-cv-sections-configuration";
import {creditPackageConfiguration} from "@/prisma/seed/2-credit-package-configuration";
import {appConfiguration} from "@/prisma/seed/0-app-configuration";
import {paymentConfiguration} from "@/prisma/seed/1-payment-configuration";

const prisma = new PrismaClient();

async function main() {
  await appConfiguration(prisma);
  await paymentConfiguration(prisma);
  await creditPackageConfiguration(prisma);
  await publicitySuggestionsConfiguration(prisma);
  await cvSectionConfiguration(prisma);
  await seedRoutesForExistingUsers(prisma);
}

main()
  .then(async () => {
    console.log("Seeding completed successfully.");
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
