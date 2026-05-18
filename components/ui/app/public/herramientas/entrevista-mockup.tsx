import React from "react";
import { AlertTriangle } from "lucide-react";

export function EntrevistaMockup() {
  const starCells = [
    { label: "S", name: "Situation", pct: 90, color: "text-primary bg-primary/10 border-primary/20" },
    { label: "T", name: "Task", pct: 82, color: "text-accent bg-accent/10 border-accent/20" },
    { label: "A", name: "Action", pct: 78, color: "text-primary bg-primary/10 border-primary/20" },
    { label: "R", name: "Result", pct: 88, color: "text-accent bg-accent/10 border-accent/20" },
    { label: "L", name: "Learning", pct: 22, color: "text-destructive bg-destructive/10 border-destructive/20" },
  ];

  return (
    <div className="p-6 rounded-[2rem] bg-card border border-border shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[200px] h-[200px] bg-accent/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Question Block */}
      <div className="p-5 rounded-2xl bg-secondary/30 border border-border text-foreground font-medium text-center italic text-sm sm:text-base leading-relaxed">
        "Tell me about a time you demonstrated leadership in a challenging situation."
      </div>

      {/* STAR Grid */}
      <div className="grid grid-cols-5 gap-3">
        {starCells.map((cell, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-xl border text-center flex flex-col items-center justify-center transition-transform hover:scale-105 ${cell.color}`}
          >
            <span className="text-xl sm:text-2xl font-black">{cell.label}</span>
            <span className="text-xs font-bold mt-1">{cell.pct}</span>
          </div>
        ))}
      </div>

      {/* Feedback Warning Box */}
      <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-xs sm:text-sm text-foreground/90 leading-relaxed flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-destructive font-bold">Learning ausente</strong> — es lo que Chevening evalúa con más peso. Agrega qué aprendiste y cómo cambió tu forma de liderar.
        </div>
      </div>
    </div>
  );
}
