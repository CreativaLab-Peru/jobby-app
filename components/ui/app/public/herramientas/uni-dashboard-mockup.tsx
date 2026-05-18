import React from "react";

export function UniDashboardMockup() {
  const kpis = [
    { value: "87", label: "registradas de 100", color: "text-primary bg-primary/5" },
    { value: "68", label: "score promedio", color: "text-accent bg-accent/5" },
    { value: "42", label: "roadmaps activos", color: "text-primary/80 bg-primary/5" },
    { value: "18", label: "aplicaciones", color: "text-accent/80 bg-accent/5" },
  ];

  const progress = [
    { label: "Perfil completado", pct: 87, color: "bg-primary text-primary" },
    { label: "Roadmap activo", pct: 48, color: "bg-accent text-accent" },
    { label: "Postulación iniciada", pct: 21, color: "bg-primary/70 text-primary/70" },
  ];

  const students = [
    { name: "Valentina R.", score: 84, scoreColor: "text-primary", program: "Chevening", status: "Activa", badgeClass: "bg-primary/15 text-primary border border-primary/20" },
    { name: "Andrea M.", score: 76, scoreColor: "text-accent", program: "Fulbright", status: "Roadmap", badgeClass: "bg-accent/15 text-accent border border-accent/20" },
    { name: "Lucía T.", score: 48, scoreColor: "text-muted-foreground", program: "OEA", status: "Inactiva", badgeClass: "bg-muted text-muted-foreground border border-border" },
  ];

  return (
    <div className="p-6 rounded-[2rem] bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-primary/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Title */}
      <div className="text-[10px] font-bold tracking-widest text-muted-foreground/60 uppercase border-b border-border pb-3">
        Dashboard en vivo — Mujeres Digitales · Programa Mujer Global
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {kpis.map((kpi, idx) => (
          <div key={idx} className={`p-4 rounded-2xl border border-border/60 text-center ${kpi.color}`}>
            <div className="text-3xl font-extrabold">{kpi.value}</div>
            <div className="text-[10px] font-bold text-muted-foreground uppercase mt-1 tracking-wider leading-snug">{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* Progress Bars */}
      <div className="space-y-4 pt-2">
        {progress.map((prog, idx) => (
          <div key={idx} className="space-y-1.5">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-muted-foreground uppercase tracking-wider">{prog.label}</span>
              <span className={prog.color}>{prog.pct}%</span>
            </div>
            <div className="w-full h-2 bg-border rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${prog.color.split(" ")[0]}`} style={{ width: `${prog.pct}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Student Table */}
      <div className="border border-border/80 rounded-2xl overflow-hidden bg-background/50">
        {/* Table Head */}
        <div className="grid grid-cols-4 p-3 bg-muted/40 border-b border-border/60 text-[10px] font-extrabold text-muted-foreground/80 uppercase tracking-widest">
          <div>Nombre</div>
          <div className="text-center">Score</div>
          <div>Beca</div>
          <div className="text-right">Estado</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/60">
          {students.map((student, idx) => (
            <div key={idx} className="grid grid-cols-4 p-4 items-center text-xs sm:text-sm font-semibold">
              <div className="text-foreground">{student.name}</div>
              <div className={`text-center font-bold ${student.scoreColor}`}>{student.score}</div>
              <div className="text-muted-foreground">{student.program}</div>
              <div className="text-right">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${student.badgeClass}`}>
                  {student.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
