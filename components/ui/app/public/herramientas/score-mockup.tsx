import React from "react";

export function ScoreMockup() {
  return (
    <div className="p-8 rounded-[2rem] bg-card border border-border shadow-2xl space-y-8 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      {/* Circle Progress & Details */}
      <div className="flex flex-col sm:flex-row items-center gap-8">
        {/* Circle Score */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-border"
              strokeWidth="8"
              fill="transparent"
            />
            <circle
              cx="50"
              cy="50"
              r="40"
              className="stroke-primary"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray="251.2"
              strokeDashoffset="72.8" /* 71% */
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute text-center">
            <span className="text-4xl font-extrabold text-primary">71</span>
            <span className="text-xs text-muted-foreground block mt-0.5">/100 · Chevening</span>
          </div>
        </div>

        {/* Bars Detail */}
        <div className="flex-1 w-full space-y-4">
          {/* Liderazgo */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">Liderazgo</span>
              <span className="text-primary">91%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="bg-primary h-full rounded-full" style={{ width: "91%" }} />
            </div>
          </div>

          {/* Formación */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">Formación</span>
              <span className="text-accent">85%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="bg-accent h-full rounded-full" style={{ width: "85%" }} />
            </div>
          </div>

          {/* Experiencia */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">Experiencia</span>
              <span className="text-primary/70">72%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="bg-primary/70 h-full rounded-full" style={{ width: "72%" }} />
            </div>
          </div>

          {/* Idiomas */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">Idiomas</span>
              <span className="text-accent/60">40%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className="bg-accent/60 h-full rounded-full" style={{ width: "40%" }} />
            </div>
          </div>
        </div>
      </div>

      {/* Recommendation Box */}
      <div className="p-4 rounded-xl bg-accent/5 border border-accent/20 text-sm leading-relaxed text-foreground/90">
        <span className="font-bold text-accent">Recomendación Clave:</span> En la sección de Liderazgo, añade métricas de impacto cuantitativo. En lugar de "lideré equipo", usa <span className="italic font-semibold text-primary">"lideré equipo de 5 personas incrementando alcance en 40%"</span>.
      </div>
    </div>
  );
}
