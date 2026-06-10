"use client";

import { useState } from "react";
import { DIAGNOSTICO_PRICE } from "../types/diagnostico";
import {DIAGNOSTICO_FEATURES} from "@/const";

interface DiagnosticoPaymentFormProps {
  onBack?: () => void;
  onSubmit: (email: string, name: string) => Promise<void>;
  isLoading: boolean;
}

// ── Icon components ──────────────────────────────────────────────────────────

const CheckIcon = () => (
  <svg className="w-[13px] h-[13px] flex-shrink-0 opacity-65" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <polyline points="20 6 9 17 4 12" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ArrowRightIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.25} strokeWidth={2.5} />
    <path d="M21 12a9 9 0 00-9-9" strokeWidth={2.5} />
  </svg>
);

const LockIcon = () => (
  <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);

// ── Component ────────────────────────────────────────────────────────────────

export function DiagnosticoPaymentForm({
                                         onBack,
                                         onSubmit,
                                         isLoading,
                                       }: DiagnosticoPaymentFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  const validateEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: typeof errors = {};

    if (!name.trim()) newErrors.name = "El nombre es requerido";
    if (!email.trim()) newErrors.email = "El email es requerido";
    else if (!validateEmail(email)) newErrors.email = "Ingresa un email válido";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(email, name);
  };

  const [priceInt, priceDec] = String(DIAGNOSTICO_PRICE).split(".");

  // Shared input class builder
  const inputClass = (field: "name" | "email") =>
    [
      "w-full px-3.5 py-3 bg-[#111a16] border rounded-xl text-[14px] text-[#f0ede4]",
      "placeholder-[rgba(240,237,228,.2)] outline-none transition-colors",
      errors[field]
        ? "border-[rgba(226,75,74,.6)] focus:border-[rgba(226,75,74,.9)]"
        : "border-white/[.08] focus:border-[#c9f563]",
    ].join(" ");

  return (
    <div
      className="min-h-screen bg-[#0a0f0c] text-[#f0ede4] flex flex-col"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      {/* ── Nav ── */}
      <nav className="flex justify-between items-center px-6 md:px-12 py-[18px] border-b border-white/[.06]">
        <span
          className="text-[#c9f563] text-[22px] font-bold italic"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          levely
        </span>

        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-1.5 text-[13px] text-[rgba(240,237,228,.4)] hover:text-[rgba(240,237,228,.7)] transition-colors bg-transparent border-none cursor-pointer"
          >
            <svg className="w-3.5 h-3.5 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 12H5M12 5l-7 7 7 7" />
            </svg>
            Volver
          </button>
        )}
      </nav>

      {/* ── Body ──
        Mobile:  single column, centered, max-w-[420px]
        Desktop: two columns side by side, max-w-[820px], separated by a divider
      ── */}
      <div className="flex flex-1 items-start justify-center px-6 md:px-12 pt-10 md:pt-14 pb-12">
        <div className="flex flex-col md:flex-row items-start gap-6 md:gap-10 w-full max-w-[420px] md:max-w-[820px]">

          {/* ── Price card ── */}
          <div className="relative bg-[#c9f563] rounded-[20px] p-7 md:p-8 overflow-hidden flex flex-col w-full md:w-[340px] md:flex-shrink-0">
            {/* Decorative blob */}
            <div className="absolute w-44 h-44 bg-white/[.08] rounded-full -bottom-12 -right-8 pointer-events-none" />

            <p className="text-[11px] font-semibold tracking-[.1em] uppercase text-[rgba(10,15,12,.45)] mb-3">
              Diagnóstico completo
            </p>

            <div className="flex items-baseline gap-0.5 mb-1">
              <span className="text-[16px] font-semibold text-[#0a0f0c] mr-1">S/</span>
              <span
                className="text-[56px] md:text-[64px] font-black leading-none tracking-[-1.5px] text-[#0a0f0c]"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {priceInt}
              </span>
              <span
                className="text-[26px] font-bold text-[#0a0f0c] self-start mt-2.5"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                {priceDec ? `.${priceDec}` : ""}0
              </span>
            </div>

            <p className="text-[11px] text-[rgba(10,15,12,.45)] mb-5">
              Pago único · Sin suscripción · PDF incluido
            </p>

            <div className="flex flex-col gap-2 mb-5">
              {DIAGNOSTICO_FEATURES.map((feat, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[rgba(10,15,12,.72)]">
                  <CheckIcon />
                  {feat}
                </div>
              ))}
            </div>

            <div className="border-t border-[rgba(10,15,12,.12)] pt-3.5 flex items-center gap-2 text-[11px] text-[rgba(10,15,12,.4)]">
              <LockIcon />
              Pago seguro · Visa / Mastercard / Yape
            </div>
          </div>

          {/* Vertical divider — desktop only */}
          <div className="hidden md:block w-px self-stretch bg-white/[.06] flex-shrink-0" />

          {/* ── Form ── */}
          <div className="w-full md:flex-1 md:min-w-0">
            <div className="mb-6">
              <h2
                className="text-[26px] font-black leading-[1.1] tracking-[-0.5px] mb-1.5"
                style={{ fontFamily: "'Fraunces', serif" }}
              >
                Tus datos
              </h2>
              <p className="text-[13px] text-[rgba(240,237,228,.4)] leading-relaxed">
                Solo para enviarte el enlace de acceso a tu diagnóstico.
              </p>
            </div>

            <form onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="flex flex-col gap-1.5 mb-4">
                <label
                  htmlFor="pf-name"
                  className="text-[12px] font-medium text-[rgba(240,237,228,.5)] tracking-[.02em]"
                >
                  Nombre completo
                </label>
                <input
                  id="pf-name"
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: undefined }));
                  }}
                  placeholder="Tu nombre"
                  autoComplete="name"
                  className={inputClass("name")}
                />
                {errors.name && (
                  <p className="text-[12px] text-[#e24b4a]">{errors.name}</p>
                )}
              </div>

              {/* Email */}
              <div className="flex flex-col gap-1.5 mb-2">
                <label
                  htmlFor="pf-email"
                  className="text-[12px] font-medium text-[rgba(240,237,228,.5)] tracking-[.02em]"
                >
                  Correo electrónico
                </label>
                <input
                  id="pf-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                  }}
                  placeholder="tu@email.com"
                  autoComplete="email"
                  className={inputClass("email")}
                />
                {errors.email && (
                  <p className="text-[12px] text-[#e24b4a]">{errors.email}</p>
                )}
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 bg-[#c9f563] text-[#0a0f0c] rounded-xl text-[15px] font-semibold flex items-center justify-center gap-2 hover:bg-[#b8e050] transition-colors disabled:opacity-45 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <SpinnerIcon />
                    Procesando...
                  </>
                ) : (
                  <>
                    Ir a pagar
                    <ArrowRightIcon />
                  </>
                )}
              </button>
            </form>

            <div className="flex items-center justify-center gap-1.5 mt-4 text-[11px] text-[rgba(240,237,228,.22)]">
              <LockIcon />
              Pagos procesados por MercadoPago · Datos seguros
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
