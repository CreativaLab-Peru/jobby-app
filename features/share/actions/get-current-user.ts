import { prisma } from "@/lib/prisma";
import { getSession } from "@/features/authentication/actions/get-session";

export const getCurrentUser = async () => {
  try {
    const session = await getSession();
    if (!session.success) {
      return null;
    }
    return await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
    });
  } catch (error) {
    console.error("[GET_CURRENT_USER_ERROR]", error);
    return null;
  }
};
