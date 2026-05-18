import { OnboardingForm } from "@/features/onboarding/components/talent-onboarding-form";
import SellingScholarshipScreen from "@/features/onboarding/screens/selling-scholarship-screen";

interface OnboardingPageProps {
  searchParams?: Promise<{
    beca?: string;
  }>
}

enum Scholarships {
  CHEVENING = "chevening",
}

export default async function OnboardingPage({
  searchParams
}: OnboardingPageProps) {
  const { beca } = await searchParams;
  if (beca && beca === Scholarships.CHEVENING) {
    return <SellingScholarshipScreen beca={beca} />;
  }
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-5xl">
        {/* Título de la página */}
        <OnboardingForm />
      </div>
    </main>
  );
}
