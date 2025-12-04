import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";
import {prisma} from "@/lib/prisma";
import {inngest} from "@/inngest/functions/client";
import {authClient} from "@/lib/auth-client";

const EMAIL = "201804876h@utea.edu.pe"
const FIRST_PASSWORD = process.env.FIRST_PASSWORD

export default async function MagicLinkPage() {

  try {
    await authClient.signUp.email({
      email: EMAIL,
      password: FIRST_PASSWORD,
      name:"tmp"
    })

    const existingUser = await prisma.user.findFirst({
      where: {email: EMAIL},
    });
    if (!existingUser) {
      return <div>Error creating user.</div>;
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
        magicLink: token,
      }
    });
    return <div>Sending magic link...</div>;
  } catch (e) {
    console.error(e);
    return <div>Error sending magic link: {(e as Error).message}</div>;
  }

}
