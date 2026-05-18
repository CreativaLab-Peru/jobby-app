import React from "react";

export function RadarMockup() {
  const radarItems = [
    {
      country: "🇬🇧",
      title: "British Council — Convocatoria Chevening 2027",
      meta: "gov.uk/chevening · Detectado hace 3h · Traducido al español",
      isNew: true,
    },
    {
      country: "🇩🇪",
      title: "DAAD Newsletter — Nuevas becas de investigación 2026",
      meta: "daad.de · Detectado hace 6h · Traducido al español",
      isNew: false,
    },
    {
      country: "🇪🇺",
      title: "Erasmus+ — Convocatoria abierta para América Latina",
      meta: "erasmus.eu · Detectado hace 12h · Traducido al español",
      isNew: false,
    },
    {
      country: "🇺🇸",
      title: "Embajada EE.UU. Perú — Fulbright abre inscripciones",
      meta: "pe.usembassy.gov · Detectado hace 1 día · Traducido al español",
      isNew: false,
    },
  ];

  return (
    <div className="p-6 rounded-[2rem] bg-card border border-border shadow-2xl space-y-4 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Header mock */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Radar en Vivo</span>
        <span className="w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
      </div>

      {/* List items */}
      <div className="space-y-3">
        {radarItems.map((item, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-xl border flex gap-3 transition-all duration-300 ${
              item.isNew
                ? "bg-primary/5 border-primary/30"
                : "bg-background/40 border-border hover:border-accent/30"
            }`}
          >
            <div className="text-2xl flex-shrink-0 w-10 h-10 rounded-lg bg-muted/40 flex items-center justify-center border border-border/30">
              {item.country}
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-bold text-foreground truncate">
                  {item.title}
                </h4>
                {item.isNew && (
                  <span className="px-2 py-0.5 bg-accent/25 text-accent text-[9px] font-bold uppercase tracking-wider rounded-full flex-shrink-0">
                    Nuevo
                  </span>
                )}
              </div>
              
              <p className="text-[11px] text-muted-foreground mt-1 truncate">
                {item.meta}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
