import {OnboardingForm} from "@/features/onboarding/components/talent-onboarding-form";

export default async function OnboardingPage() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-3xl space-y-8">
        {/* Header de la página */}
        {/*<div className="text-center space-y-2">*/}
        {/*  <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight">*/}
        {/*    Configura tu <span className="text-primary">perfil de match</span>*/}
        {/*  </h1>*/}
        {/*  <p className="text-muted-foreground text-lg">*/}
        {/*    Solo te tomará 2 minutos. Queremos asegurarnos de mostrarte lo que realmente buscas.*/}
        {/*  </p>*/}
        {/*</div>*/}

        {/* Formulario (Client Component) */}
        <OnboardingForm />

        {/* Footer de confianza */}
        <footer className="text-center text-sm text-muted-foreground pt-4">
          Tus datos están seguros y solo se usarán para encontrar oportunidades relevantes en el futuro.
        </footer>
      </div>
    </main>
  );
}
