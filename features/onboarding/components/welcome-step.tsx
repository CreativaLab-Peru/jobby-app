import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Lock } from "lucide-react";
import { useOnboardingStore } from "@/features/onboarding/store/talent-onboarding-store";
import Image from "next/image";
import Link from "next/link";

export function WelcomeStep() {
  const { setStep } = useOnboardingStore();
  const [index, setIndex] = useState(0);

  const words = ["becas", "fellowships", "grants", "programas", "maestrías"];
  const avatars = [
    { src: "/testimonios/Andy.png", label: "A" },
    { src: "/testimonios/Monica.png", label: "M" },
    { src: "/testimonios/Jhon.png", label: "J" },
    { src: "/testimonios/Aaron.png", label: "A" },
    { src: "/testimonios/Brenda.png", label: "B" },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-center min-h-[80vh] max-w-5xl mx-auto text-center px-6 py-20 animate-in fade-in duration-1000">
      {/* Navegación Volver */}
      <nav className="mb-8 md:mb-16">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>
      </nav>

      {/* Badge con líneas laterales (Estilo Imagen) */}
      <div className="flex items-center gap-4 md:gap-8 mb-6 md:mb-10 w-full justify-center">
        <div className="hidden xs:block h-[1px] w-8 md:w-16 bg-border/60" />
        <div className="inline-flex items-center text-[13px] md:text-sm text-muted-foreground tracking-wider font-medium uppercase">
          <span>Descubre</span>
          <div className="mx-3 min-w-[90px] md:min-w-[110px] h-6 relative overflow-hidden flex items-center justify-center">
            <span
              key={words[index]}
              className="font-bold text-foreground animate-in slide-in-from-top-4 fade-in duration-500 absolute lowercase tracking-normal"
            >
              {words[index]}
            </span>
          </div>
          {/* <span>hacen match contigo</span> */}
        </div>
        <div className="hidden xs:block h-[1px] w-8 md:w-16 bg-border/60" />
      </div>

      {/* Bloque de Título y Textos Secundarios */}
      <div className="max-w-3xl mb-6 md:mb-12">
        <h1 className="text-3xl md:text-6xl font-bold tracking-tight text-foreground leading-[1.2] md:leading-[1.1] mb-8">
          ¿Cuántas becas perdiste por <span className="text-primary">no saber que existían?</span>
        </h1>

        {/* <div className="space-y-2 text-sm md:text-base">
          <p className="text-muted-foreground opacity-80">Aplicas a las mismas 3 que todos.</p>
          <p className="text-red-500 font-medium">Eso tiene solución.</p>
          <p className="text-primary italic">Levely te dice dónde estás y qué hacer.</p>
        </div> */}
      </div>

      {/* Botón Principal y Micro-copy */}
      <div className="w-full max-w-xs space-y-5 mb-10 md:mb-20">
        <Button
          size="lg"
          className="w-full h-16 text-lg font-bold rounded-full bg-primary text-primary-foreground hover:opacity-90 transition-all shadow-xl shadow-primary/20 group"
          onClick={() => setStep(2)}
        >
          Empezar gratis
          <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </Button>

        {/* <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-bold uppercase tracking-[0.15em]">
          <Lock className="w-3 h-3" />
          <span>Gratis · 2 minutos · Sin tarjeta</span>
        </div> */}
      </div>

      {/* Footer de Stats*/}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 w-full max-w-4xl pt-8 md:pt-10 border-t border-border/40">
        {/* Columna 1: Avatares Dinámicos */}
        <div className="flex flex-col items-center md:items-start gap-3">
          <div className="flex -space-x-3">
            {avatars.map((avatar, i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full border-2 border-background bg-secondary flex items-center justify-center overflow-hidden"
              >
                <Image
                  src={avatar.src}
                  alt={`Usuario ${avatar.label}`}
                  width={40}
                  height={40}
                  className="object-cover w-full h-full"
                  onError={(e) => {
                    e.currentTarget.style.display = "none";
                  }}
                />
                <span className="text-[10px] font-bold text-muted-foreground">{avatar.label}</span>
              </div>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-bold tracking-tight">
            +1,200 esta semana
          </p>
        </div>

        {/* Columna 2: Becas */}
        <div className="flex flex-col items-center md:border-x border-border/40 px-4">
          <span className="text-3xl font-bold text-foreground">10+</span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold text-center mt-1">
            Becas full-funded disponibles
          </p>
        </div>

        {/* Columna 3: Base de datos */}
        <div className="flex flex-col items-center md:items-end">
          <span className="text-3xl font-bold text-foreground">500+</span>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-bold text-center md:text-right mt-1">
            Oportunidades en base de datos
          </p>
        </div>
      </div>
    </div>
  );
}
