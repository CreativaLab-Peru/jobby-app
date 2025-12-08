'use server'

import { prisma } from "@/lib/prisma";
import {hashMagicLinkToken} from "@/utils/magic-links";
import {User} from "@prisma/client";

export async function verifyTokenAndReturnUser(token: string | undefined): Promise<User | null> {
  try {
    if (!token) {
      return null;
    }

    const hashedToken = hashMagicLinkToken(token);
    console.info("[token]:", token);
    console.info("[hashedToken]:", hashedToken);
    const magicLink = await prisma.magicLinkToken.findFirst({
      where: {
        tokenHash: hashedToken,
        usedAt: null,
        expiresAt: {
          gt: new Date(),
        },
      },
    })
    if (!magicLink){
      console.info("[MAGIC_LINK_NOT_FOUND]");
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: magicLink.userId,
      },
    })
    if (!user){
      console.info("[USER_NOT_FOUND_FOR_MAGIC_LINK]");
      return null;
    }

    return user;
  } catch (error) {
    console.error("[ERROR_VERIFYING_MAGIC_LINK_TOKEN]:", error);
    return null;
  }
}
