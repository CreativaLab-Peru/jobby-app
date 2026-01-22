import {OnboardingForm} from "@/features/onboarding/components/talent-onboarding-form";

export default async function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">

        {/* Título de la página */}
        <OnboardingForm />

        {/* Footer de confianza */}
        <footer className="text-center text-sm text-muted-foreground pt-4">
          Tus datos están seguros y solo se usarán para encontrar oportunidades relevantes en el futuro.
        </footer>
      </div>
    </main>
  );
}
