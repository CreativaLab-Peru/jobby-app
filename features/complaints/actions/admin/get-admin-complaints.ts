"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Complaint, User } from "@prisma/client";
import { Prisma } from "@prisma/client";

export type AdminComplaintItem = Complaint & {
  user: Pick<User, "id" | "email" | "name" | "image">;
};

export type AdminComplaintListResult =
  | {
      success: true;
      data: {
        complaints: AdminComplaintItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminComplaintsOptions {
  query?: string;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

export const getAdminComplaints = async (
  skip = 0,
  take = 10,
  options?: GetAdminComplaintsOptions
): Promise<AdminComplaintListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const where: Prisma.ComplaintWhereInput = {};

    if (options?.query) {
      where.OR = [
        { name: { contains: options.query, mode: "insensitive" } },
        { email: { contains: options.query, mode: "insensitive" } },
        { complaint: { contains: options.query, mode: "insensitive" } },
        { phone: { contains: options.query, mode: "insensitive" } },
        { user: { name: { contains: options.query, mode: "insensitive" } } },
      ];
    }

    if (options?.dateFrom || options?.dateTo) {
      where.createdAt = {};
      if (options?.dateFrom) {
        (where.createdAt as Prisma.DateTimeFilter).gte = new Date(options.dateFrom);
      }
      if (options?.dateTo) {
        const endDate = new Date(options.dateTo);
        endDate.setHours(23, 59, 59, 999);
        (where.createdAt as Prisma.DateTimeFilter).lte = endDate;
      }
    }

    const sortBy = options?.sortBy || "createdAt";
    const sortOrder = options?.sortOrder || "desc";

    const [complaints, totalCount] = await Promise.all([
      prisma.complaint.findMany({
        where,
        skip,
        take,
        include: {
          user: { select: { id: true, email: true, name: true, image: true } },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.complaint.count({ where }),
    ]);

    return {
      success: true,
      data: {
        complaints: complaints as AdminComplaintItem[],
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_COMPLAINTS_ERROR]", error);
    return { success: false, error: "Error obteniendo reclamos" };
  }
};

