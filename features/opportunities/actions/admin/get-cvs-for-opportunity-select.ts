"use server";

import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/features/share/actions/require-admin";

export interface CvSelectItem {
  id: string;
  title: string | null;
  userLabel: string;
}

export type GetCvsForOpportunitySelectResult =
  | { success: true; data: CvSelectItem[] }
  | { success: false; error: string };

export const getCvsForOpportunitySelect = async (
  query?: string
): Promise<GetCvsForOpportunitySelectResult> => {
  try {
    const admin = await requireAdmin();
    if (!admin.success) {
      return { success: false, error: "Acceso denegado." };
    }

    const cvs = await prisma.cv.findMany({
      where: {
        deletedAt: null,
        ...(query
          ? {
              OR: [
                { title: { contains: query, mode: "insensitive" } },
                { user: { name: { contains: query, mode: "insensitive" } } },
                { user: { email: { contains: query, mode: "insensitive" } } },
              ],
            }
          : {}),
      },
      select: {
        id: true,
        title: true,
        user: { select: { name: true, email: true } },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    const data: CvSelectItem[] = cvs.map((cv) => ({
      id: cv.id,
      title: cv.title,
      userLabel: cv.user?.name ?? cv.user?.email ?? "Sin usuario",
    }));

    return { success: true, data };
  } catch (error) {
    console.error("[GET_CVS_FOR_SELECT_ERROR]", error);
    return { success: false, error: "Error al obtener los CVs" };
  }
};
