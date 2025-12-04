"use client"

import React, { useState } from "react";
import {
  LogIn,
  ArrowRight,
  Mail,
  Lock,
  Eye,
  EyeOff,
} from "lucide-react";
import {StepProps} from "@/features/onboarding/components/onboarding-flow";

export const StepCredentials: React.FC<StepProps> = ({ data, setData, onNext }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleConfirm, setIsVisibleConfirm] = useState(false);

  const passwordIsValid = password.length >= 6;
  const passwordsMatch = confirm === password;

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordIsValid && passwordsMatch) {
      setData("tempPassword", password);
      onNext();
    }
  };

  return (
    <form onSubmit={handleNext} className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 flex items-center">
        <LogIn className="w-6 h-6 mr-2 text-blue-500" />
        Paso 1: Verificación de Credenciales
      </h2>
      <p className="text-gray-600">
        Confirma tu acceso con tu contraseña. Tu correo ya está cargado.
      </p>

      {/* Email */}
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700 flex items-center">
          <Mail className="w-4 h-4 mr-2 text-gray-500" />
          Correo Electrónico
        </label>
        <input
          type="email"
          value={data.email}
          disabled
          className="w-full p-3 border border-gray-200 rounded-lg bg-gray-50/70 text-gray-600 cursor-not-allowed shadow-inner focus:outline-none"
        />
      </div>

      {/* Password */}
      <div className="space-y-1">
        <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center">
          <Lock className="w-4 h-4 mr-2 text-gray-500" />
          Contraseña
        </label>

        <div className="relative">
          <input
            id="password"
            type={isVisible ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Ingresa tu contraseña"
          />

          <button
            type="button"
            onClick={() => setIsVisible(!isVisible)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {isVisible ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {!passwordIsValid && password.length > 0 && (
          <p className="text-xs text-red-500">
            La contraseña debe tener al menos 6 caracteres.
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-1">
        <label htmlFor="confirm" className="text-sm font-medium text-gray-700 flex items-center">
          <Lock className="w-4 h-4 mr-2 text-gray-500" />
          Confirmar Contraseña
        </label>

        <div className="relative">
          <input
            id="confirm"
            type={isVisibleConfirm ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            required
            className="w-full p-3 pr-12 border border-gray-300 rounded-lg text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            placeholder="Repite tu contraseña"
          />

          <button
            type="button"
            onClick={() => setIsVisibleConfirm(!isVisibleConfirm)}
            className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
          >
            {isVisibleConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        {confirm.length > 0 && !passwordsMatch && (
          <p className="text-xs text-red-500">
            Las contraseñas no coinciden.
          </p>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!passwordIsValid || !passwordsMatch}
          className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
        >
          Siguiente
          <ArrowRight className="w-4 h-4 ml-2" />
        </button>
      </div>
    </form>
  );
};
