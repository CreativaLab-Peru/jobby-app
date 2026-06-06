import { PrismaClient } from "@prisma/client";

/**
 * Generates and inserts random mock users into the database.
 *
 * @param prisma - The active PrismaClient instance
 * @param count - The number of users to generate (default is 10)
 */
export async function seedRandomUsers(prisma: PrismaClient, count: number = 10) {
  try {
    console.log(`[SEED] Starting generation of ${count} random users...`);

    const firstNames = ["Carlos", "Maria", "Juan", "Ana", "Luis", "Elena", "Pedro", "Lucia", "Diego", "Sofia", "Mateo", "Valentina"];
    const lastNames = ["Garcia", "Martinez", "Lopez", "Gonzalez", "Perez", "Rodriguez", "Sanchez", "Ramirez", "Cruz", "Flores", "Gomez", "Diaz"];

    const usersToCreate = [];

    for (let i = 0; i < count; i++) {
      // Pick random names
      const randomFirstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const randomLastName = lastNames[Math.floor(Math.random() * lastNames.length)];

      // Generate a random 5-character string to guarantee unique emails
      const randomString = Math.random().toString(36).substring(2, 7);

      const name = `${randomFirstName} ${randomLastName}`;
      const email = `${randomFirstName.toLowerCase()}.${randomLastName.toLowerCase()}.${randomString}@gmail.com`;

      usersToCreate.push({
        name,
        email,
        emailVerified: true,
        // Since your User model does not have @default(now()) for these, we must pass them manually
        createdAt: new Date(),
        updatedAt: new Date(),
        // Mocking some reasonable defaults for a test user
        acceptedTermsAndConditions: true,
        acceptedPrivacyPolicy: true,
        acceptedTermsAt: new Date(),
        acceptedPrivacyPolicyAt: new Date(),
        isBlocked: false,
        happensAfterPayment: false,
      });
    }

    // Insert all users in a single transaction/batch
    const result = await prisma.user.createMany({
      data: usersToCreate,
      skipDuplicates: true, // Safely ignore if a collision somehow occurs
    });

    console.log(`[SEED] Successfully inserted ${result.count} test users into the database.`);
  } catch (e) {
    console.error("[ERROR_SEEDING_USERS]", e);
  }
}
