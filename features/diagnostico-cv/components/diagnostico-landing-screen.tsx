"use client";

import { useState } from "react";
import { DIAGNOSTICO_PRICE } from "../types/diagnostico";

interface DiagnosticoLandingScreenProps {
  onStart: () => void;
}

export function DiagnosticoLandingScreen({ onStart }: DiagnosticoLandingScreenProps) {
  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #c8f562 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative max-w-4xl mx-auto px-6 py-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#c8f562]/20 bg-[#c8f562]/10 mb-8">
            <span className="text-[#c8f562] text-sm font-medium">Nuevo</span>
            <span className="text-[#8a9e93] text-sm">Diagnostico IA para becas</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl md:text-6xl font-serif font-bold mb-6 leading-tight" style={{ fontFamily: "'Fraunces', serif" }}>
            Sabes quais becas
            <br />
            <span className="text-[#c8f562]">combinan contigo?</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg text-[#8a9e93] max-w-2xl mx-auto mb-12">
            Analizamos tu CV y te mostramos exactamente qué becas de posgrado en UK, US, Alemania, Francia y Japin tienes en el radar, con tu score de competitividad.
          </p>

          {/* CTA Button */}
          <button
            onClick={onStart}
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#c8f562] text-[#080f0d] rounded-xl font-bold text-lg hover:bg-[#a8d444] transition-colors"
          >
            Empezar mi diagnostico
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* Price Card */}
      <div className="max-w-md mx-auto px-6 pb-20">
        <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.08)] rounded-2xl p-8 text-center">
          <div className="flex items-baseline justify-center gap-1 mb-2">
            <span className="text-[#8a9e93] text-lg">S/</span>
            <span className="text-5xl font-bold text-[#f4f0e6]">{DIAGNOSTICO_PRICE}</span>
          </div>
          <p className="text-[#8a9e93] text-sm mb-6">Pago único</p>

          <div className="space-y-4 text-left">
            {[
              "Analisis IA de tu CV",
              "Matching con becas de5 paises",
              "Score de competitividad 0-100",
              "Perfil personalizado",
              "Top 10 oportunidades",
              "Email con resultados",
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full bg-[#c8f562]/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-3 h-3 text-[#c8f562]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="text-[#f4f0e6]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Trust Indicators */}
      <div className="border-t border-[rgba(255,255,255,.08)] py-12">
        <div className="max-w-4xl mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-8 text-[#8a9e93] text-sm">
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Pago seguro</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              <span>Resultados en minutos</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span>Email incluido</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
