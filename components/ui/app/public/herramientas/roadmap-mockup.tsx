import React from "react";

export function RoadmapMockup() {
  const steps = [
    {
      status: "completed",
      title: "✓ Perfil analizado",
      desc: "Score 71/100 · CV subido y procesado",
      colorClass: "bg-primary border-primary",
      lineClass: "bg-primary/30",
      textColor: "text-primary",
      cardBg: "bg-primary/5 border-primary/20",
    },
    {
      status: "active",
      title: "En progreso — Mejorar perfil",
      desc: "Agrega LinkedIn · Cuantifica 2 logros",
      colorClass: "bg-accent border-accent",
      lineClass: "bg-accent/20",
      textColor: "text-accent",
      cardBg: "bg-accent/5 border-accent/25",
    },
    {
      status: "locked",
      title: "🔒 Escribir ensayos Chevening",
      desc: "4 ensayos · método STAR + Learning",
      colorClass: "bg-muted border-border",
      lineClass: "bg-border",
      textColor: "text-muted-foreground/60",
      cardBg: "bg-muted/10 border-border/40",
    },
    {
      status: "locked",
      title: "🔒 Simular entrevista",
      desc: "Voz real · STAR + Learning · feedback",
      colorClass: "bg-muted border-border",
      lineClass: "bg-border",
      textColor: "text-muted-foreground/60",
      cardBg: "bg-muted/10 border-border/40",
    },
    {
      status: "locked",
      title: "🔒 Postular — Nov 2026",
      desc: "Checklist final · Envío",
      colorClass: "bg-muted border-border",
      textColor: "text-muted-foreground/60",
      cardBg: "bg-muted/10 border-border/40",
    },
  ];

  return (
    <div className="p-8 rounded-[2rem] bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />
      
      <div className="flex items-center justify-between border-b border-border/60 pb-4">
        <h3 className="text-lg font-bold text-foreground">Ruta de Postulación - Chevening</h3>
        <span className="text-xs px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full font-bold uppercase tracking-wider">Activo</span>
      </div>

      {/* Steps Roadmap */}
      <div className="space-y-0 relative pl-4 sm:pl-8">
        {steps.map((step, idx) => (
          <div key={idx} className="flex gap-4 sm:gap-6 relative pb-6 last:pb-0">
            {/* Line & Dot column */}
            <div className="flex flex-col items-center flex-shrink-0 relative">
              <div className={`w-4 h-4 rounded-full border-2 ${step.colorClass} relative z-10 flex items-center justify-center`} />
              {step.lineClass && (
                <div className={`w-0.5 absolute top-4 bottom-0 ${step.lineClass}`} />
              )}
            </div>

            {/* Card body */}
            <div className={`flex-1 p-4 rounded-2xl border transition-all duration-300 ${step.cardBg}`}>
              <h4 className={`text-sm sm:text-base font-bold ${step.textColor}`}>
                {step.title}
              </h4>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                {step.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
