import {inngest} from "@/inngest/functions/client";
import {prisma} from "@/lib/prisma";
import {generateMagicLinkToken, hashMagicLinkToken} from "@/utils/magic-links";
import {authClient} from "@/lib/auth-client";

const FIRST_PASSWORD = process.env.FIRST_PASSWORD

export default async function SendTestPage() {
  const userData = {
    // Uuid v4 random
    id: "PrvhzRv2fx0tDta4xN9bU85jrBLEAJzD",
    email: "192666@unsaac.edu.pe",
    name: "Edward Melendez",
  }

  await authClient.signUp.email({
    email: userData.email,
    password: FIRST_PASSWORD,
    name:"tmp"
  })

  const user = await prisma.user.findFirst({
    where: {email: userData.email},
   });
  if (!user) {
    throw new Error("User not found after sign up");
  }
  const userId = user.id;

  const token = generateMagicLinkToken();
  const hashedToken = hashMagicLinkToken(token);

  await prisma.magicLinkToken.create({
    data: {
      userId,
      tokenHash: hashedToken,
      expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24), // 24 hours
      purpose: "post_payment_access",
    }
  });

  await inngest.send({
    name: "send/magiclink",
    data: {
      email: user.email,
      name: user.name,
      userId: user.id,
      magicLink: token,
    }
  });



  return (
    <div>
      <h1>Send Test Email</h1>
      <p>This is the Send Test Email page.</p>
      <div>
        {}
      </div>
    </div>
  );
}
