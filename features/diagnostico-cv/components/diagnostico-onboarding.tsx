"use client";

import { useState, useEffect } from "react";
import {
  DIAGNOSTICO_SCHOLARSHIP_TYPES,
  DIAGNOSTICO_AREAS,
} from "../types/diagnostico";
import {CountryOption, getCountriesAction} from "@/features/diagnostico-cv/actions/get-countries";

interface DiagnosticoOnboardingProps {
  onComplete: (data: {
    countries: string[]; // country codes: ["GB", "US"]
    scholarshipType: string;
    area: string;
  }) => void;
  isLoading: boolean;
}

type SubStep = "countries" | "scholarship" | "area";
const SUB_STEPS: SubStep[] = ["countries", "scholarship", "area"];

export function DiagnosticoOnboarding({ onComplete, isLoading }: DiagnosticoOnboardingProps) {
  const [subStep, setSubStep] = useState<SubStep>("countries");

  // Countries from DB
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [countriesLoading, setCountriesLoading] = useState(true);

  // Selections — stored as country.code strings
  const [selectedCodes, setSelectedCodes] = useState<string[]>([]);
  const [selectedScholarship, setSelectedScholarship] = useState<string | null>(null);
  const [selectedArea, setSelectedArea] = useState<string | null>(null);

  useEffect(() => {
    getCountriesAction()
      .then(setCountries)
      .finally(() => setCountriesLoading(false));
  }, []);

  const subStepIndex = SUB_STEPS.indexOf(subStep);
  // Bar fills proportionally through the first global step (1/3 of total flow)
  const globalProgress = ((subStepIndex + 1) / SUB_STEPS.length) * (1 / 3) * 100;

  const toggleCode = (code: string) => {
    setSelectedCodes((prev) => {
      if (prev.includes(code)) return prev.filter((c) => c !== code);
      if (prev.length >= 2) return prev; // max 2 countries
      return [...prev, code];
    });
  };

  const canProceed = () => {
    if (subStep === "countries") return selectedCodes.length > 0;
    if (subStep === "scholarship") return !!selectedScholarship;
    if (subStep === "area") return !!selectedArea;
    return false;
  };

  const goBack = () => {
    if (subStep === "scholarship") setSubStep("countries");
    if (subStep === "area") setSubStep("scholarship");
  };

  const handleNext = () => {
    if (subStep === "countries" && canProceed()) setSubStep("scholarship");
    else if (subStep === "scholarship" && canProceed()) setSubStep("area");
    else if (subStep === "area" && canProceed()) {
      onComplete({
        countries: selectedCodes,       // ["GB", "US"] — codes, not UUIDs
        scholarshipType: selectedScholarship!,
        area: selectedArea!,
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Global progress — step 1 of 3 */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#111f1b] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#c8f562] transition-all duration-300"
              style={{ width: `${globalProgress}%` }}
            />
          </div>
          <span className="text-[#8a9e93] text-sm">1 de 3</span>
        </div>

        {/* Sub-step: Countries */}
        {subStep === "countries" && (
          <div>
            <h2
              className="text-2xl font-serif font-bold mb-2 text-center"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              Selecciona hasta 2 países
            </h2>
            <p className="text-[#8a9e93] text-center mb-8">
              ¿A qué países te gustaría aplicar?
            </p>

            {countriesLoading ? (
              <div className="space-y-3">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="w-full h-16 rounded-xl bg-[#111f1b] animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {countries.map((country) => (
                  <button
                    key={country.code}
                    onClick={() => toggleCode(country.code)}
                    className={`w-full p-4 rounded-xl border transition-all flex items-center gap-4 ${
                      selectedCodes.includes(country.code)
                        ? "border-[#c8f562] bg-[#c8f562]/10"
                        : "border-[rgba(255,255,255,.08)] hover:border-[#c8f562]/30"
                    }`}
                  >
                    <span className="text-2xl">{country.flag}</span>
                    <span className="flex-1 text-left font-medium">{country.name}</span>
                    {selectedCodes.includes(country.code) && (
                      <div className="w-5 h-5 rounded-full bg-[#c8f562] flex items-center justify-center">
                        <svg className="w-3 h-3 text-[#080f0d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Sub-step: Scholarship Type */}
        {subStep === "scholarship" && (
          <div>
            <h2
              className="text-2xl font-serif font-bold mb-2 text-center"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              ¿Qué tipo de beca buscas?
            </h2>
            <p className="text-[#8a9e93] text-center mb-8">
              El diagnóstico está especializado en becas de posgrado
            </p>
            <div className="space-y-3">
              {DIAGNOSTICO_SCHOLARSHIP_TYPES.map((type) => (
                <button
                  key={type.id}
                  onClick={() => setSelectedScholarship(type.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedScholarship === type.id
                      ? "border-[#c8f562] bg-[#c8f562]/10"
                      : "border-[rgba(255,255,255,.08)] hover:border-[#c8f562]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{type.icon}</span>
                    <span className="font-medium">{type.label}</span>
                  </div>
                  <p className="text-[#8a9e93] text-sm mt-2 pl-9">{type.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Sub-step: Area */}
        {subStep === "area" && (
          <div>
            <h2
              className="text-2xl font-serif font-bold mb-2 text-center"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              ¿Cuál es tu área principal?
            </h2>
            <p className="text-[#8a9e93] text-center mb-8">
              Personaliza las oportunidades y mejora la precisión del análisis
            </p>
            <div className="space-y-3">
              {DIAGNOSTICO_AREAS.map((area) => (
                <button
                  key={area.id}
                  onClick={() => setSelectedArea(area.id)}
                  className={`w-full p-4 rounded-xl border transition-all text-left ${
                    selectedArea === area.id
                      ? "border-[#c8f562] bg-[#c8f562]/10"
                      : "border-[rgba(255,255,255,.08)] hover:border-[#c8f562]/30"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{area.icon}</span>
                    <span className="font-medium">{area.label}</span>
                  </div>
                  <p className="text-[#8a9e93] text-sm mt-2 pl-9">{area.description}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex gap-3 mt-8">
          {subStep !== "countries" && (
            <button
              onClick={goBack}
              disabled={isLoading}
              className="flex-1 py-4 border border-[rgba(255,255,255,.08)] rounded-xl font-medium hover:border-[#c8f562]/30 transition-colors disabled:opacity-50"
            >
              Atrás
            </button>
          )}
          <button
            onClick={handleNext}
            disabled={!canProceed() || isLoading || countriesLoading}
            className="flex-1 py-4 bg-[#c8f562] text-[#080f0d] rounded-xl font-bold hover:bg-[#a8d444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Procesando...
              </>
            ) : subStep === "area" ? (
              "Continuar"
            ) : (
              <>
                Siguiente
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
