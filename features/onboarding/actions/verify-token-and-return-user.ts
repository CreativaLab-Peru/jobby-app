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
    console.log("[token]:", token);
    console.log("[hashedToken]:", hashedToken);
    const magicLink = await prisma.magicLinkToken.findFirst({
      where: {
        tokenHash: hashedToken,
      },
    })
    if (!magicLink){
      return null;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: magicLink.userId,
      },
    })
    if (!user){
      return null;
    }

    return user;
  } catch (error) {
    console.error("[ERROR_VERIFYING_MAGIC_LINK_TOKEN]:", error);
    return null;
  }
}
