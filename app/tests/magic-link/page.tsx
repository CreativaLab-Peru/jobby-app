import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";
import {prisma} from "@/lib/prisma";
import {inngest} from "@/inngest/functions/client";

const EMAIL = "192666@unsaac.edu.pe"

export default async function MagicLinkPage() {

  try {
    const existingUser = await prisma.user.findUnique({
      where: {email: EMAIL},
    });
    if (!existingUser) {
      return <div>User not found.</div>;
    }

    const token = generateMagicLinkToken();
    const hashedToken = hashMagicLinkToken(token);

    await prisma.magicLinkToken.create({
      data: {
        userId: existingUser.id,
        tokenHash: hashedToken,
        expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
        purpose: "post_payment_access",
      }
    });

    await inngest.send({
      name: "send/magiclink",
      data: {
        email: existingUser.email,
        name: existingUser.name,
        userId: existingUser.id,
        magicLink: hashedToken,
      }
    });
    return <div>Sending magic link...</div>;
  } catch (e) {
    console.error(e);
    return <div>Error sending magic link: {(e as Error).message}</div>;
  }

}
