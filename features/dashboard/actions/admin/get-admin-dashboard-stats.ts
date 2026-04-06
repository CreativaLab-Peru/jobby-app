"use server";

import {prisma} from "@/lib/prisma";
import {requireAdmin} from "@/features/share/actions/require-admin";
import {AdminDashboardRange} from "@/features/dashboard/utils/get-range";


export interface AdminDashboardStats {
  range: AdminDashboardRange;
  since: string;
  until: string;
  totals: {
    users: number;
    cvs: number;
    evaluations: number;
    opportunities: number;
    roadmaps: number;
    complaints: number;
  };
}

export type AdminDashboardStatsResult =
  | { success: true; data: AdminDashboardStats, error: string }
  | { success: false; error: string };


const getRangeDates = (range: AdminDashboardRange) => {
  const end = new Date();
  const start = new Date(end);

  if (range === "3d") {
    start.setDate(start.getDate() - 3);
  } else if (range === "7d") {
    start.setDate(start.getDate() - 7);
  } else if (range === "1m") {
    start.setMonth(start.getMonth() - 1);
  } else if (range === "3m") {
    start.setMonth(start.getMonth() - 3);
  } else if (range === "6m") {
    start.setMonth(start.getMonth() - 6);
  }

  start.setHours(0, 0, 0, 0);
  return {start, end};
};

export const getAdminDashboardStats = async (
  range: AdminDashboardRange
): Promise<AdminDashboardStatsResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return {success: false, error: "Acceso denegado."};
    }

    const {start, end} = getRangeDates(range);
    const createdAtFilter = {gte: start, lte: end};

    const [users, cvs, evaluations, opportunities, roadmaps, complaints] = await Promise.all([
      prisma.user.count({where: {createdAt: createdAtFilter}}),
      prisma.cv.count({where: {createdAt: createdAtFilter, deletedAt: null}}),
      prisma.cvEvaluation.count({where: {createdAt: createdAtFilter}}),
      prisma.opportunity.count({where: {createdAt: createdAtFilter}}),
      prisma.roadmap.count({where: {createdAt: createdAtFilter}}),
      prisma.complaint.count({where: {createdAt: createdAtFilter}}),
    ]);

    return {
      success: true,
      data: {
        range,
        since: start.toISOString(),
        until: end.toISOString(),
        totals: {
          users,
          cvs,
          evaluations,
          opportunities,
          roadmaps,
          complaints,
        },
      },
      error: "",
    };
  } catch (error) {
    console.error("[ADMIN_DASHBOARD_STATS_ERROR]", error);
    return {success: false, error: "Error obteniendo estadisticas"};
  }
};
