import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function PartnersCTA() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        <div className="relative overflow-hidden rounded-3xl bg-primary dark:bg-gradient-to-br dark:from-levely-blue dark:to-levely-blue/80 text-primary-foreground p-8 sm:p-12 lg:p-16 text-center">
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-white/5 rounded-full blur-3xl" />
          </div>

          <div className="relative max-w-2xl mx-auto">
            <h2 className="text-3xl headline-lg mb-6 text-white">
              Conviértete en partner de Levely
            </h2>
            <p className="text-lg text-white/80 mb-8">
              Agenda una llamada con nuestro equipo para explorar cómo podemos ayudar a mejorar los
              resultados de empleabilidad de tu institución.
            </p>
            <a
              href="https://calendly.com/joinlevely/30min"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button
                size="xl"
                className="cursor-pointer bg-white text-primary hover:bg-white/90 dark:text-levely-blue"
              >
                Agendar llamada
                <ArrowRight className="w-5 h-5" />
              </Button>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
