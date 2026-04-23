'use client';
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const faqs = [
  { q: "¿Funciona si mi CV está en español?", a: "Sí. Levely analiza tu CV en cualquier idioma y genera la versión Harvard directamente en inglés." },
  { q: "¿Puedo usar Builder para otras becas?", a: "Sí. Incluye 3 análisis. Úsalos para Chevening, DAAD, Fulbright o Eiffel." },
  { q: "¿Qué tan específico es el análisis para Chevening?", a: "La IA evalúa tu CV contra los criterios reales de Chevening: liderazgo, impacto en tu comunidad, visión de retorno al país, perfil académico y experiencia profesional relevante." },
  { q: "¿Hay garantía si no me gusta?", a: "Sí. Si en las primeras 24 horas sientes que el análisis no fue útil, te devolvemos el pago sin preguntas." },
];

export function CheveningFAQ() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <div className="bg-secondary/30 rounded-3xl p-6 space-y-3">
      <h3 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Preguntas frecuentes</h3>
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-border/50 last:border-none py-3 cursor-pointer" onClick={() => setOpen(open === i ? null : i)}>
          <div className="flex justify-between items-center gap-2">
            <span className="text-sm font-medium leading-tight">{faq.q}</span>
            {open === i ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {open === i && <p className="text-xs text-muted-foreground mt-2 leading-relaxed animate-in fade-in slide-in-from-top-1">{faq.a}</p>}
        </div>
      ))}
    </div>
  );
}
