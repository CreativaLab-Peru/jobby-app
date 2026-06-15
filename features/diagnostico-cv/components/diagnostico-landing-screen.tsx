"use client";

import { DIAGNOSTICO_PRICE } from "../types/diagnostico";
import {BADGES, DIAGNOSTICO_FEATURES} from "@/const";
import Image from "next/image";

interface DiagnosticoLandingScreenProps {
  onStart: () => void;
  paymentStatus?: "success" | "failure" | "pending";
}

const STATS = [
  {
    icon: (
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.5}
        d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z"
      />
    ),
    text: (
      <>
        Respaldado por <strong className="text-[rgba(240,237,228,.6)] font-medium">PRO Innóvate · PRODUCE</strong>
      </>
    ),
  },
  {
    icon: (
      <>
        <circle cx="12" cy="12" r="10" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M2 12h20M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z" />
      </>
    ),
    text: (
      <>
        <strong className="text-[rgba(240,237,228,.6)] font-medium">522+</strong> usuarios activos en Latinoamérica
      </>
    ),
  },
  {
    icon: (
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    ),
    text: (
      <>
        <strong className="text-[rgba(240,237,228,.6)] font-medium">500+</strong> oportunidades internacionales
      </>
    ),
  },
  {
    icon: (
      <>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
      </>
    ),
    text: (
      <>
        Cusco, Perú · <strong className="text-[rgba(240,237,228,.6)] font-medium">para toda Latinoamérica</strong>
      </>
    ),
  },
];

export function DiagnosticoLandingScreen({ onStart, paymentStatus }: DiagnosticoLandingScreenProps) {
  // Parse price into integer and decimal parts for styled display
  const [priceInt, priceDec] = String(DIAGNOSTICO_PRICE).split(".");

  return (
    <div
      className="min-h-screen bg-[#0a0f0c] text-[#f0ede4] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Nav ── */}
      <nav className="flex justify-between items-center px-6 md:px-10 py-[18px] border-b border-white/[.06]">
        <span
          className="text-[#c9f563] text-[22px] font-bold italic"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          levely
        </span>
        <span className="text-[13px] text-[rgba(240,237,228,.5)]">Diagnóstico con IA</span>
      </nav>

      {/* ── Payment success banner ── */}
      {paymentStatus && paymentStatus !== "failure" && (
        <div className={`flex items-center justify-center gap-2.5 px-6 py-3 border-b ${
          paymentStatus === "success"
            ? "bg-[#c9f563]/[.08] border-[#c9f563]/[.18]"
            : "bg-amber-400/[.08] border-amber-400/[.18]"
        }`}>
          {paymentStatus === "success" ? (
            <svg className="w-4 h-4 text-[#c9f563] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="M2 7l10 7 10-7" />
            </svg>
          ) : (
            <svg className="w-4 h-4 text-amber-400 flex-shrink-0 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.25} />
              <path d="M21 12a9 9 0 00-9-9" />
            </svg>
          )}
          <p className={`text-[13px] ${paymentStatus === "success" ? "text-[#c9f563]/90" : "text-amber-400/90"}`}>
            {paymentStatus === "success"
              ? "¡Pago recibido! Revisa tu correo — ahí encontrarás el enlace a tu diagnóstico."
              : "Tu pago está en proceso — te avisaremos por correo en cuanto se confirme."}
          </p>
        </div>
      )}

      {/* ── Hero ── */}
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-12 px-6 md:px-10 pt-10 md:pt-14 pb-12 flex-1 items-start max-w-6xl mx-auto w-full">
        {/* Left — copy */}
        <div className="flex flex-col">
          {/* Eyebrow */}
          <div className="flex items-center gap-2.5 mb-6 md:mb-7">
            <div className="w-8 h-px bg-[#c9f563]" />
            <span className="text-[11px] font-semibold tracking-[.12em] uppercase text-[rgba(240,237,228,.45)]">
              Diagnóstico de perfil · Levely
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-[40px] md:text-[56px] font-black leading-[1.04] tracking-[-1.5px] mb-6"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Descubre cuánto<br />
            vale tu CV<br />
            para una beca<br />
            <em className="text-[#c9f563]">internacional.</em>
          </h1>

          {/* Subtitle */}
          <p className="text-[15px] leading-[1.65] text-[rgba(240,237,228,.55)] max-w-full lg:max-w-[420px] mb-8 md:mb-9">
            Sube tu CV. En{" "}
            <strong className="text-[rgba(240,237,228,.85)] font-medium">2 minutos</strong>{" "}
            recibes tu score, tus 10 mejores oportunidades y el plan exacto para ganar
            tu beca — Chevening, Fulbright, DAAD o la que elijas.
          </p>

          {/* Social proof badges */}
          <div className="flex flex-wrap gap-2">
            {BADGES.map(({ label }, i) => (
              <div
                key={i}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 border border-white/10 rounded-full text-[12px] text-[rgba(240,237,228,.55)]"
              >
                <span className="text-[#c9f563] font-bold text-[13px]">+</span>
                {label}
              </div>
            ))}
          </div>

          <div
            className="mt-16 flex flex-col sm:flex-row items-center gap-6 text-sm text-muted-foreground animate-fade-up"
            style={{ animationDelay: "0.4s" }}>
            <div className="flex -space-x-2">
              {[
                "/testimonios/Andy.png",
                "/testimonios/Monica.png",
                "/testimonios/Jhon.png",
                "/testimonios/Aaron.png",
                "/testimonios/Brenda.png",
              ].map((src, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-accent/20 to-accent/40 border-2 border-background flex items-center justify-center overflow-hidden fadeUp"
                >
                  <Image
                    src={src}
                    alt={`Avatar ${i + 1}`}
                    width={40}
                    height={40}
                    className="object-cover w-full h-full"
                  />
                </div>
              ))}
            </div>
            <p>
              <span className="font-semibold text-primary">+500</span> profesionales ya
              optimizaron su perfil
            </p>
          </div>
        </div>

        {/* Right — price card */}
        <div className="relative bg-[#c9f563] rounded-[20px] p-6 md:p-8 overflow-hidden flex flex-col w-full">
          {/* Decorative blob */}
          <div className="absolute w-48 h-48 bg-white/[.08] rounded-full -bottom-14 -right-10 pointer-events-none" />

          <p className="text-[11px] font-semibold tracking-[.1em] uppercase text-[rgba(10,15,12,.45)] mb-4">
            Diagnóstico completo
          </p>

          {/* Price */}
          <div className="flex items-baseline gap-0.5 mb-1">
            <span className="text-[18px] font-semibold text-[#0a0f0c] mr-1">S/</span>
            <span
              className="text-[64px] md:text-[72px] font-black leading-none tracking-[-2px] text-[#0a0f0c]"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {priceInt}
            </span>
            <span
              className="text-[28px] md:text-[32px] font-bold text-[#0a0f0c] self-start mt-3"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              {priceDec ? `.${priceDec}` : ""}0
            </span>
          </div>
          <p className="text-[12px] text-[rgba(10,15,12,.45)] mb-6">
            Pago único · Sin suscripción · PDF incluido
          </p>

          {/* CTA */}
          <button
            onClick={onStart}
            className="w-full bg-[#0a0f0c] text-[#c9f563] rounded-xl py-4 text-[15px] font-semibold tracking-[.01em] mb-6 hover:bg-[#1a2a20] transition-colors"
          >
            Empezar mi diagnóstico →
          </button>

          {/* Features */}
          <div className="flex flex-col gap-2.5 mb-5">
            {DIAGNOSTICO_FEATURES.map((feat, i) => (
              <div key={i} className="flex items-center gap-2.5 text-[13px] text-[rgba(10,15,12,.75)]">
                <svg
                  className="w-3.5 h-3.5 flex-shrink-0 text-[#0a0f0c] opacity-70"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {feat}
              </div>
            ))}
          </div>

          {/* Card footer */}
          <div className="border-t border-[rgba(10,15,12,.12)] pt-4 flex items-center gap-2 text-[11px] text-[rgba(10,15,12,.45)]">
            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0110 0v4" />
            </svg>
            Pago seguro · Visa / Mastercard / Yape
          </div>
        </div>
      </section>

      {/* ── Footer stats ── */}
      <footer className="border-t border-white/[.06] px-6 md:px-10 py-6 md:py-4 flex gap-6 md:gap-8 flex-col sm:flex-row sm:flex-wrap">
        {STATS.map(({ icon, text }, i) => (
          <div key={i} className="flex items-center gap-2 text-[12px] text-[rgba(240,237,228,.35)]">
            <svg
              className="w-3.5 h-3.5 opacity-40 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
            >
              {icon}
            </svg>
            {text}
          </div>
        ))}
      </footer>
    </div>
  );
}
