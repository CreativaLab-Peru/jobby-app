"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";
import { Prisma, User } from "@prisma/client";

export type AdminUserItem = Pick<
  User,
  | "id"
  | "name"
  | "email"
  | "image"
  | "role"
  | "isBlocked"
  | "emailVerified"
  | "createdAt"
  | "updatedAt"
  | "lastLoginAt"
> & {
  _count: {
    cvs: number;
    payments: number;
    sessions: number;
  };
};

export type AdminUserListResult =
  | {
      success: true;
      data: {
        users: AdminUserItem[];
        hasMore: boolean;
        totalCount: number;
      };
    }
  | { success: false; error: string };

export interface GetAdminUsersOptions {
  query?: string;
  role?: "USER" | "ADMIN" | null;
  status?: "active" | "blocked" | null;
  emailVerified?: "verified" | "unverified" | null;
  dateFrom?: string | null;
  dateTo?: string | null;
  sortBy?: "createdAt" | "name" | "email" | "lastLoginAt";
  sortOrder?: "asc" | "desc";
}

export const getAdminUsers = async (
  skip = 0,
  take = 10,
  options?: GetAdminUsersOptions
): Promise<AdminUserListResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: admin.error };
    }

    const where: Prisma.UserWhereInput = {};

    if (options?.query) {
      where.OR = [
        { name: { contains: options.query, mode: "insensitive" } },
        { email: { contains: options.query, mode: "insensitive" } },
      ];
    }

    if (options?.role) {
      where.role = options.role;
    }

    if (options?.status === "active") {
      where.isBlocked = false;
    } else if (options?.status === "blocked") {
      where.isBlocked = true;
    }

    if (options?.emailVerified === "verified") {
      where.emailVerified = true;
    } else if (options?.emailVerified === "unverified") {
      where.emailVerified = false;
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

    const [users, totalCount] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take,
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          role: true,
          isBlocked: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          _count: {
            select: {
              cvs: true,
              payments: true,
              sessions: true,
            },
          },
        },
        orderBy: { [sortBy]: sortOrder },
      }),
      prisma.user.count({ where }),
    ]);

    return {
      success: true,
      data: {
        users,
        hasMore: skip + take < totalCount,
        totalCount,
      },
    };
  } catch (error) {
    console.error("[ADMIN_GET_USERS_ERROR]", error);
    return { success: false, error: "Error obteniendo usuarios" };
  }
};

