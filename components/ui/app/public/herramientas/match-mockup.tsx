import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MatchMockup() {
  const opportunities = [
    {
      country: "🇬🇧",
      name: "Chevening UK",
      meta: "Maestría fully funded · Cierra NOV 2026",
      pct: 74,
      color: "bg-primary",
      text: "text-primary",
      blurred: false,
    },
    {
      country: "🇩🇪",
      name: "DAAD Alemania",
      meta: "Postgrado · Cierra OCT 2026",
      pct: 68,
      color: "bg-accent",
      text: "text-accent",
      blurred: false,
    },
    {
      country: "🇺🇸",
      name: "Fulbright EEUU",
      meta: "Maestría · Cierra ABR 2027",
      pct: 61,
      color: "bg-primary/50",
      text: "text-primary/70",
      blurred: true,
    },
  ];

  return (
    <div className="space-y-4">
      <div className="p-6 rounded-[2rem] bg-card border border-border shadow-2xl space-y-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="space-y-4">
          {opportunities.map((opp, idx) => (
            <div
              key={idx}
              className={`relative p-5 rounded-2xl border border-border bg-background/50 backdrop-blur-sm flex items-center gap-4 transition-all duration-300 ${
                opp.blurred ? "blur-[2px] opacity-60 select-none pointer-events-none" : "hover:border-accent/40"
              }`}
            >
              <div className="text-3xl flex-shrink-0 w-12 h-12 rounded-xl bg-muted/40 flex items-center justify-center border border-border/40">
                {opp.country}
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold text-foreground truncate">
                  {opp.name}
                </h3>
                <p className="text-xs text-muted-foreground truncate mt-0.5">
                  {opp.meta}
                </p>
                <div className="w-full h-1.5 bg-border rounded-full mt-2.5 overflow-hidden">
                  <div className={`h-full rounded-full ${opp.color}`} style={{ width: `${opp.pct}%` }} />
                </div>
              </div>

              <div className={`text-2xl font-extrabold flex-shrink-0 ml-2 ${opp.text}`}>
                {opp.pct}%
              </div>

              {opp.blurred && (
                <div className="absolute inset-0 flex items-center justify-center bg-background/20 rounded-2xl">
                  <span className="px-3 py-1 bg-card/90 border border-border text-[10px] font-bold uppercase tracking-wider text-muted-foreground rounded-full shadow-lg">
                    Desbloquear
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* bottom locked notification */}
      <div className="p-4 rounded-2xl bg-card border border-border shadow-md flex items-center justify-between text-sm">
        <span className="text-muted-foreground text-xs sm:text-sm">
          + 9 oportunidades desbloqueadas con Builder ·
        </span>
        <Link href="/onboarding/talents" className="font-bold text-primary hover:text-accent inline-flex items-center gap-1">
          Empezar gratis
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
