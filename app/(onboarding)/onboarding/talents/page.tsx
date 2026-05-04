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
      <div className="w-full max-w-3xl space-y-8">

        {/* Título de la página */}
        <OnboardingForm />

        {/* Footer de confianza */}
        <footer className="text-center text-sm text-muted-foreground pt-4">
          Tus datos están seguros y solo se usarán para encontrar oportunidades relevantes en el
          futuro.
        </footer>
      </div>
    </main>
  );
}
