"use client";

import Link from "next/link";

const STEPS = [
  "Extrayendo la información clave de tu CV",
  "Calculando tu score de perfil",
  "Detectando tu perfil dominante",
  "Buscando las mejores oportunidades para ti",
  "Generando tu analisis de mejoras",
];

export function DiagnosticoProcessing() {
  return (
    <div
      className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex flex-col items-center justify-center p-6">

      {/* Animated Orb - Mantenemos la animación fluida para indicar que el motor está corriendo */}
      <div className="relative w-32 h-32 mb-10">
        <div className="absolute inset-0 rounded-full border-2 border-[#c8f562]/20 animate-pulse"/>
        <div className="absolute inset-2 rounded-full border-2 border-[#c8f562]/40 animate-pulse"
             style={{animationDelay: "0.2s"}}/>
        <div className="absolute inset-4 rounded-full border-2 border-[#c8f562]/60 animate-pulse"
             style={{animationDelay: "0.4s"}}/>
        <div className="absolute inset-6 rounded-full bg-[#c8f562]/20 animate-pulse"
             style={{animationDelay: "0.6s"}}/>
        <div className="absolute inset-8 rounded-full bg-[#c8f562] animate-pulse"
             style={{animationDelay: "0.8s"}}/>

        {/* Icono de check superpuesto en el centro para dar sensación de confirmación de inicio */}
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <svg className="w-8 h-8 text-[#080f0d]" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
          </svg>
        </div>
      </div>

      {/* Text - Clear async messaging */}
      <h2 className="text-3xl font-serif font-bold mb-3 text-center"
          style={{fontFamily: "'Fraunces', serif"}}>
        ¡Tu diagnóstico está en proceso!
      </h2>
      <p className="text-[#8a9e93] mb-10 text-center max-w-md text-lg">
        Ya no necesitas esperar en esta pantalla. Te enviaremos un correo con tus resultados.
      </p>

      {/* Steps - "What happens next" perspective */}
      <div
        className="w-full max-w-md bg-[#111c18] p-6 rounded-2xl border border-[#c8f562]/10 mb-10">
        <h3 className="text-[#c8f562] text-sm font-semibold mb-4 uppercase tracking-wider">
          En segundo plano estamos:
        </h3>
        <div className="space-y-4">
          {STEPS.map((step, index) => (
            <div key={index} className="flex items-center gap-3">
              <div
                className="w-5 h-5 rounded-full bg-[#c8f562]/10 flex items-center justify-center flex-shrink-0 border border-[#c8f562]/30">
                <div className="w-1.5 h-1.5 rounded-full bg-[#c8f562] animate-pulse"
                     style={{animationDelay: `${index * 0.2}s`}}/>
              </div>
              <span className="text-[#8a9e93] text-sm">{step}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action - Escape hatch */}
      <Link
        href="/diagnostico-cv" // Cambia esta ruta a tu dashboard o home
        className="group flex items-center gap-2 bg-[#c8f562] text-[#080f0d] px-6 py-3 rounded-full font-semibold transition-all hover:bg-[#d4fa7a] hover:scale-105 active:scale-95"
      >
        <span>Volver al inicio</span>
        <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none"
             stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"/>
        </svg>
      </Link>

    </div>
  );
}
