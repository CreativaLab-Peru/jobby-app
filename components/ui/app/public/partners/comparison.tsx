import { XCircle, CheckCircle2, AlertCircle } from "lucide-react";

type WithoutLevel = {
  title: string;
  items: string[];
}[];

export default function Comparison({ whitoutLevely }: { whitoutLevely: WithoutLevel }) {
  return (
    <section className="section-padding bg-secondary/30 dark:bg-secondary/10">
      <div className="container-levely">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="headline-lg text-4xl text-foreground">Lo que cambia con Levely</h2>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="bg-card border border-border/50 rounded-3xl p-8 sm:p-10 transition-all duration-300 hover:shadow-md">
            <h3 className="text-2xl font-bold mb-8 text-muted-foreground">
              {whitoutLevely[0].title}
            </h3>
            <ul className="space-y-5">
              {whitoutLevely[0].items.map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-muted-foreground">
                  <XCircle className="w-6 h-6 text-red-400 shrink-0 mt-0.5" />
                  <span className="text-lg leading-tight">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative overflow-hidden bg-card border-2 border-levely-blue/30 rounded-3xl p-8 sm:p-10 shadow-lg shadow-levely-blue/5 transition-all duration-300 hover:shadow-xl hover:shadow-levely-blue/10 hover:border-levely-blue/50">
            <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-levely-blue/10 to-transparent rounded-bl-full pointer-events-none" />

            <h3 className="text-2xl font-bold mb-8 text-levely-blue relative z-10">
              {whitoutLevely[1].title}
            </h3>
            <ul className="space-y-5 relative z-10">
              {whitoutLevely[1].items.map((item, index) => (
                <li key={index} className="flex items-start gap-4 text-foreground">
                  <CheckCircle2 className="w-6 h-6 text-levely-blue shrink-0 mt-0.5" />
                  <span className="text-lg leading-tight font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 max-w-4xl mx-auto bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900/30 rounded-2xl p-6 sm:p-8 flex flex-col sm:flex-row items-start gap-4 sm:gap-6 shadow-sm">
          <div className="bg-red-100 dark:bg-red-900/50 p-3 rounded-xl shrink-0">
            <AlertCircle className="w-7 h-7 text-red-500 dark:text-red-400" />
          </div>
          <div>
            <h4 className="text-xl font-bold text-foreground mb-2">
              El problema que nadie resuelve a escala
            </h4>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Con 50 o 200 estudiantes, dar feedback personalizado a cada uno es físicamente
              imposible. Levely lo hace en{" "}
              <span className="font-semibold text-foreground">2 minutos por perfil</span> — sin que
              tú tengas que revisar cada CV.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
