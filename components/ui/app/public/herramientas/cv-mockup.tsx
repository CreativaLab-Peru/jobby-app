import React from "react";

export function CVMockup() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
      {/* Harvard Format Card */}
      <div className="p-6 rounded-[2rem] bg-card border border-border shadow-xl hover:shadow-2xl hover:border-primary/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[16rem]">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-primary/5 rounded-full blur-2xl -z-10 pointer-events-none" />
        
        <div>
          <span className="text-[9px] font-extrabold px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full uppercase tracking-wider block w-fit mb-4">
            Harvard Format
          </span>
          <h3 className="text-lg font-bold text-foreground mb-2">Formato Harvard</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            El estándar de universidades top. Una página. Limpio. Preferido por Chevening, Fulbright y Oxford.
          </p>
        </div>

        <div className="text-xs font-bold text-primary inline-flex items-center gap-1 mt-4">
          Generado en 30 seg ⚡
        </div>
      </div>

      {/* Europass Format Card */}
      <div className="p-6 rounded-[2rem] bg-card border border-border shadow-xl hover:shadow-2xl hover:border-accent/40 transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[16rem]">
        <div className="absolute top-0 right-0 w-[120px] h-[120px] bg-accent/5 rounded-full blur-2xl -z-10 pointer-events-none" />
        
        <div>
          <span className="text-[9px] font-extrabold px-2.5 py-1 bg-accent/10 text-accent border border-accent/20 rounded-full uppercase tracking-wider block w-fit mb-4">
            Europass
          </span>
          <h3 className="text-lg font-bold text-foreground mb-2">Formato Europass</h3>
          <p className="text-xs text-muted-foreground leading-relaxed">
            El estándar europeo. Requerido para DAAD, Erasmus Mundus y programas en la UE.
          </p>
        </div>

        <div className="text-xs font-bold text-accent inline-flex items-center gap-1 mt-4">
          Generado en 30 seg ⚡
        </div>
      </div>
    </div>
  );
}
