import {OnboardingFlow} from "@/features/onboarding/components/onboarding-flow";
import {verifyTokenAndReturnUser} from "@/features/onboarding/actions/verify-token-and-return-user";
import {redirect} from "next/navigation";

export default async function MagicLinkPage({
                                              searchParams,
                                            }: {
  searchParams: Promise<{ token?: string }>;
}) {
  const {token} = await searchParams;
  const user = await verifyTokenAndReturnUser(token);
  if (!user) {
    return redirect('/404');
  }

  return (
    <div className="py-0">
      <OnboardingFlow
        user={user}
        token={token}
      />
    </div>
  );
}
