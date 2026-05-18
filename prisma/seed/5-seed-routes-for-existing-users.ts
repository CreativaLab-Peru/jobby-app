/**
 * One-time migration script: Creates a default route for every existing user
 * who has at least one CV but no routes yet.
 *
 * Usage: npx tsx prisma/seed/seed-routes-for-existing-users.ts
 */

import {PrismaClient, RouteStatus} from "@prisma/client";

export async function seedRoutesForExistingUsers(prisma: PrismaClient) {
  try {
    // Find users with CVs but no routes
    const usersWithCvsNoRoutes = await prisma.user.findMany({
      where: {
        cvs: {some: {deletedAt: null}},
        routes: {none: {}},
      },
      include: {
        cvs: {
          where: {deletedAt: null},
          orderBy: {createdAt: "desc"},
          take: 1,
          include: {
            evaluations: {
              where: {status: "SUCCEEDED"},
              take: 1,
            },
            opportunities: {take: 1},
          },
        },
      },
    });


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

    }

    // Also create empty routes for users without CVs and without routes
    const usersNoCvsNoRoutes = await prisma.user.findMany({
      where: {
        routes: {none: {}},
        cvs: {none: {deletedAt: null}},
      },
    });


    for (const user of usersNoCvsNoRoutes) {
      await prisma.route.create({
        data: {
          userId: user.id,
          name: "Mi primera ruta",
          status: RouteStatus.CV_PENDING,
          isActive: true,
        },
      });
    }
  } catch (e) {
    console.error("[ERROR_SEED_ROUTES_FOR_EXISTING_USERS]", e)
  }
}
