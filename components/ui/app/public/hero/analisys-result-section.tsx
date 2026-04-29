import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

const stats = [
  { label: "Resumen prof.", value: 91, color: "bg-levely-green" },
  { label: "Educación", value: 85, color: "bg-levely-green" },
  { label: "Exp. laboral", value: 78, color: "bg-levely-green" },
  { label: "Contacto", value: 40, color: "bg-orange-500" },
];

export function AnalysisResultSection() {
  return (
    <section className="section-padding bg-background">
      <div className="container-levely">
        {/* Card Principal - Usando tus medidas exactas de padding y bordes */}
        <div className="relative overflow-hidden rounded-[2.5rem] bg-primary dark:bg-levely-dark p-8 sm:p-14 lg:p-20 shadow-2xl border border-white/5">
          {/* Blobs de fondo consistentes con tu Hero */}
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-secondary/10 rounded-full blur-[120px] -mr-40 -mt-40 pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px] -ml-40 -mb-40 pointer-events-none" />

          <div className="relative">
            {/* Header: Título de sección y Badge de paso */}
            <div className="flex justify-between items-center mb-12">
              <p className="text-white/50 uppercase tracking-[0.2em] text-xs font-semibold">
                Tu Análisis · Chevening UK
              </p>
              <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-levely-green/10 border border-levely-green/20">
                <span className="text-levely-green text-xs font-bold">Paso 2 completado</span>
              </div>
            </div>

            {/* Grid de Contenido: Score + Barras */}
            <div className="grid lg:grid-cols-[240px_1fr] gap-12 lg:gap-20 items-center">
              {/* Lado Izquierdo: Score Circular */}
              <div className="flex flex-col items-center justify-center">
                <div className="relative group">
                  <div className="w-44 h-44 rounded-full border-[8px] border-white/5 flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
                    <div className="text-center">
                      <span className="text-6xl font-bold text-levely-green block leading-none">
                        71
                      </span>
                      <span className="text-white/30 text-lg font-medium">/100</span>
                    </div>
                  </div>
                  {/* Resplandor del score */}
                  <div className="absolute inset-0 bg-secondary/20 blur-[40px] rounded-full -z-10 opacity-50" />
                </div>
              </div>

              {/* Lado Derecho: Textos y Barras */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight leading-tight">
                    Tu CV tiene potencial, <br />
                    <span className="text-white/60 font-medium">pero necesita ajustes.</span>
                  </h2>
                  <p className="text-lg text-white/50 max-w-xl leading-relaxed">
                    Los comités de Chevening revisan cientos de CVs. Con los ajustes correctos, el
                    tuyo puede destacar sobre la competencia.
                  </p>
                </div>

                {/* Listado de Progreso */}
                <div className="grid gap-5 max-w-2xl">
                  {stats.map((stat) => (
                    <div key={stat.label} className="space-y-2.5">
                      <div className="flex justify-between items-end">
                        <span className="text-sm font-bold text-white/70 uppercase tracking-wider">
                          {stat.label}
                        </span>
                        <span
                          className={cn(
                            "text-sm font-bold",
                            stat.value < 50 ? "text-orange-400" : "text-levely-green",
                          )}
                        >
                          {stat.value}%
                        </span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                        <div
                          className={cn(
                            "h-full rounded-full transition-all duration-1000",
                            stat.color,
                          )}
                          style={{ width: `${stat.value}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
