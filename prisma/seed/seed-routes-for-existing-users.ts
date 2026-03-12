/**
 * One-time migration script: Creates a default route for every existing user
 * who has at least one CV but no routes yet.
 *
 * Usage: npx tsx prisma/seed/seed-routes-for-existing-users.ts
 */

import { PrismaClient, RouteStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Find users with CVs but no routes
  const usersWithCvsNoRoutes = await prisma.user.findMany({
    where: {
      cvs: { some: { deletedAt: null } },
      routes: { none: {} },
    },
    include: {
      cvs: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        take: 1,
        include: {
          evaluations: {
            where: { status: "SUCCEEDED" },
            take: 1,
          },
          opportunities: { take: 1 },
        },
      },
    },
  });

  console.log(`Found ${usersWithCvsNoRoutes.length} users with CVs but no routes.`);

  for (const user of usersWithCvsNoRoutes) {
    const cv = user.cvs[0];
    if (!cv) continue;

    // Determine the route status based on what the user has already done
    let status: RouteStatus = RouteStatus.CV_CREATED;
    if (cv.evaluations.length > 0) status = RouteStatus.ANALYSIS_DONE;
    if (cv.opportunities.length > 0) status = RouteStatus.OPPORTUNITIES_DONE;

    await prisma.route.create({
      data: {
        userId: user.id,
        cvId: cv.id,
        name: "Mi primera ruta",
        status,
        isActive: true,
      },
    });

    console.log(`  ✅ Created route for user ${user.email} (status: ${status})`);
  }

  // Also create empty routes for users without CVs and without routes
  const usersNoCvsNoRoutes = await prisma.user.findMany({
    where: {
      routes: { none: {} },
      cvs: { none: { deletedAt: null } },
    },
  });

  console.log(`Found ${usersNoCvsNoRoutes.length} users without CVs or routes.`);

  for (const user of usersNoCvsNoRoutes) {
    await prisma.route.create({
      data: {
        userId: user.id,
        name: "Mi primera ruta",
        status: RouteStatus.CV_PENDING,
        isActive: true,
      },
    });

    console.log(`  ✅ Created empty route for user ${user.email}`);
  }

  console.log("Done!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

