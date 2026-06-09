"use client";

import { useState } from "react";
import { DIAGNOSTICO_PRICE } from "../types/diagnostico";

interface DiagnosticoPaymentFormProps {
  onSubmit: (email: string, name: string) => Promise<void>;
  isLoading: boolean;
}

export function DiagnosticoPaymentForm({ onSubmit, isLoading }: DiagnosticoPaymentFormProps) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [errors, setErrors] = useState<{ email?: string; name?: string }>({});

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: { email?: string; name?: string } = {};

    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    }

    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!validateEmail(email)) {
      newErrors.email = "Ingresa un email valido";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    await onSubmit(email, name);
  };

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Completa tu informacion
          </h2>
          <p className="text-[#8a9e93]">
            Sera usada solo para enviarte el enlace de acceso
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-[#0d1a17] border border-[rgba(255,255,255,.08)] rounded-2xl p-8">
          {/* Price Summary */}
          <div className="flex items-center justify-between px-4 py-3 bg-[#111f1b] rounded-xl mb-6">
            <span className="text-[#8a9e93]">Diagnostico Levely</span>
            <span className="text-[#c8f562] font-bold">S/ {DIAGNOSTICO_PRICE}</span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name Input */}
            <div>
              <label htmlFor="name" className="block text-sm text-[#8a9e93] mb-2">
                Nombre completo
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Tu nombre"
                className="w-full px-4 py-3 bg-[#111f1b] border border-[rgba(255,255,255,.08)] rounded-xl text-[#f4f0e6] placeholder-[#5a6b62] focus:outline-none focus:border-[#c8f562] transition-colors"
              />
              {errors.name && (
                <p className="text-red-400 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm text-[#8a9e93] mb-2">
                Correo electronico
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full px-4 py-3 bg-[#111f1b] border border-[rgba(255,255,255,.08)] rounded-xl text-[#f4f0e6] placeholder-[#5a6b62] focus:outline-none focus:border-[#c8f562] transition-colors"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#c8f562] text-[#080f0d] rounded-xl font-bold text-lg hover:bg-[#a8d444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Procesando...
                </>
              ) : (
                <>
                  Ir a pagar
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* Security Note */}
          <p className="text-center text-[#5a6b62] text-xs mt-6">
            Pagos procesados por MercadoPago. Tus datos estan seguros.
          </p>
        </div>
      </div>
    </div>
  );
}
