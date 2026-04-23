import { Button } from "@/components/ui/button";
import { GraduationCap, ArrowRight } from "lucide-react";

type Param = {
  value: string;
  description: string;
};

export default function PartnersHero({ parameters }: { parameters: Param[] }) {
  return (
    <section className="section-padding bg-gradient-to-br from-secondary via-background to-levely-blue/5 dark:from-[#19282D] dark:via-[#1a2a2f] dark:to-[#19282D]">
      <div className="container-levely">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-levely-blue/10 dark:bg-levely-blue/20 text-levely-blue text-sm font-medium mb-6">
            <GraduationCap className="w-4 h-4" />
            Para Instituciones · LATAM
          </div>

          <h1 className="headline-xl mb-6 text-foreground max-w-5xl mx-auto">
            Convierte estudiantes en candidatos globales{" "}
            <span className="text-levely-blue">10x más rápido.</span>
          </h1>

          <p className="text-xl text-muted-foreground mb-8">
            IA que analiza cada perfil y genera un plan de acción, para que tu cohorte llegue
            preparado a cada beca u oportunidad internacional.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="https://calendly.com/joinlevely/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button className="cursor-pointer" variant="hero" size="xl">
                Agendar demo gratuita · 30 min
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
          <div>
            <p className="text-sm text-muted-foreground mt-4">
              Sin compromisos, respondemos en menos de 24h
            </p>
          </div>
          <div>
            <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8">
              {parameters.map((param) => (
                <div key={param.value} className="text-center">
                  <h3 className="text-3xl font-bold text-foreground">{param.value}</h3>
                  <p className="text-muted-foreground">{param.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
