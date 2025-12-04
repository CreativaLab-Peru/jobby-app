"use client"

import React, { useState } from "react";
import {
  User,
  ArrowLeft,
  ChevronsRight,
} from "lucide-react";
import Link from "next/link";
import {StepProps} from "@/features/onboarding/components/onboarding-flow";

export const StepProfile: React.FC<StepProps> = ({ data, setData, onNext, onPrev }) => {
  const [name, setName] = useState(data.name || "");
  const [acceptedTerms, setAcceptedTerms] = useState(data.acceptedTerms || false);
  const formIsValid = name.trim().length > 0 && acceptedTerms;

  const handleComplete = (e: React.FormEvent) => {
    e.preventDefault();
    if (formIsValid) {
      setData("name", name.trim());
      setData("acceptedTerms", acceptedTerms);
      onNext();
    }
  };

  return (
    <form onSubmit={handleComplete} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <User className="w-6 h-6 mr-2 text-blue-500" />
        Paso 2: Datos de Perfil y Aceptación
      </h2>
      <p className="text-gray-600">
        Completa tu nombre y confirma la aceptación de nuestros términos y condiciones.
      </p>

      {/* Campo de Nombre */}
      <div className="space-y-1">
        <label htmlFor="name" className="text-sm font-medium text-gray-700">
          Nombre Completo
        </label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full p-3 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="Ej. Juan Pérez"
        />
      </div>

      {/* Términos y Condiciones */}
      <div className="flex items-center space-x-3 pt-2">
        <input
          id="terms"
          type="checkbox"
          checked={acceptedTerms}
          onChange={(e) => setAcceptedTerms(e.target.checked)}
          required
          className="h-5 w-5 text-blue-500 border-gray-300 rounded focus:ring-blue-500"
        />
        <label htmlFor="terms" className="text-sm font-medium text-gray-700 flex items-center cursor-pointer">
          {/*<ShieldCheck className="w-4 h-4 mr-2 text-green-600" />*/}
          Acepto los <Link className="text-blue-600 hover:text-blue-500 font-semibold ml-1 cursor-pointer"
                           href='/terminos-y-condiciones'
                           target={'_blank'}
        >Términos y Condiciones</Link>
        </label>
      </div>

      <div className="flex justify-between pt-4">
        <button
          type="button"
          onClick={onPrev}
          className="px-4 py-2 text-gray-600 font-semibold rounded-lg hover:bg-gray-100 transition-colors flex items-center"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </button>
        <button
          type="submit"
          disabled={!formIsValid}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Completar Onboarding
          <ChevronsRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
