"use client";

const STEPS = [
  "Leyendo y extrayendo tu CV",
  "Calculando tu score para la beca elegida",
  "Detectando tu perfil dominante",
  "Buscando tus mejores oportunidades",
  "Generando roadmap y enviando PDF",
];

export function DiagnosticoLoading() {
  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex flex-col items-center justify-center p-6">
      {/* Animated Orb */}
      <div className="relative w-32 h-32 mb-12">
        {/* Outer ring */}
        <div className="absolute inset-0 rounded-full border-2 border-[#c8f562]/20 animate-pulse" />
        {/* Middle ring */}
        <div className="absolute inset-2 rounded-full border-2 border-[#c8f562]/40 animate-pulse" style={{ animationDelay: "0.2s" }} />
        {/* Inner ring */}
        <div className="absolute inset-4 rounded-full border-2 border-[#c8f562]/60 animate-pulse" style={{ animationDelay: "0.4s" }} />
        {/* Core */}
        <div className="absolute inset-6 rounded-full bg-[#c8f562]/20 animate-pulse" style={{ animationDelay: "0.6s" }} />
        {/* Center glow */}
        <div className="absolute inset-8 rounded-full bg-[#c8f562] animate-pulse" style={{ animationDelay: "0.8s" }} />
      </div>

      {/* Text */}
      <h2 className="text-2xl font-serif font-bold mb-4 text-center" style={{ fontFamily: "'Fraunces', serif" }}>
        Analizando tu CV...
      </h2>
      <p className="text-[#8a9e93] mb-12 text-center">
        Esto tomara solo unos momentos
</p>

      {/* Steps */}
      <div className="space-y-4 w-full max-w-sm">
        {STEPS.map((step, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Check/Loading indicator */}
            <div className="w-6 h-6 rounded-full bg-[#c8f562]/20 flex items-center justify-center flex-shrink-0">
              <div className="w-2 h-2 rounded-full bg-[#c8f562] animate-pulse" style={{ animationDelay: `${index * 0.2}s` }} />
            </div>
            <span className="text-[#8a9e93] text-sm">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
