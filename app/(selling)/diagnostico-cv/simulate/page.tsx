"use client";

import { useState } from "react";
import { createDiagnosticSessionAction } from "./actions";

export default function SimulateDiagnosticoPage() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [result, setResult] = useState<{ token: string; sessionId: string } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await createDiagnosticSessionAction(email, name);
      setResult(res);
    } catch (err) {
      console.error("[ERROR_SIMULATE]", err);
      setError("Failed to create session");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-serif font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Simular Diagnostico CV
          </h1>
          <p className="text-[#8a9e93]">
            Crea una sesion de diagnostico sin necesidad de pago
          </p>
        </div>

        {!result ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm text-[#8a9e93] mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#111f1b] border border-[rgba(255,255,255,.08)] rounded-xl text-[#f4f0e6] placeholder-[#8a9e93] focus:outline-none focus:border-[#c8f562]"
                placeholder="tu@email.com"
              />
            </div>

            <div>
              <label htmlFor="name" className="block text-sm text-[#8a9e93] mb-1">
                Nombre
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-[#111f1b] border border-[rgba(255,255,255,.08)] rounded-xl text-[#f4f0e6] placeholder-[#8a9e93] focus:outline-none focus:border-[#c8f562]"
                placeholder="Tu nombre"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center">{error}</p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 bg-[#c8f562] text-[#080f0d] rounded-xl font-bold text-lg hover:bg-[#a8d444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creando..." : "Crear Sesion de Diagnostico"}
            </button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="p-4 bg-[#111f1b] border border-[#c8f562]/30 rounded-xl">
              <p className="text-[#8a9e93] text-sm mb-1">Session ID</p>
              <p className="text-[#f4f0e6] font-mono text-sm break-all">{result.sessionId}</p>
            </div>

            <div className="p-4 bg-[#111f1b] border border-[#c8f562]/30 rounded-xl">
              <p className="text-[#8a9e93] text-sm mb-1">Token</p>
              <p className="text-[#f4f0e6] font-mono text-sm break-all">{result.token}</p>
            </div>

            <div className="p-4 bg-[#111f1b] border border-[#c8f562]/30 rounded-xl">
              <p className="text-[#8a9e93] text-sm mb-1">Access URL</p>
              <a
                href={`/diagnostico-cv/${result.token}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#c8f562] font-mono text-sm break-all hover:underline"
              >
                {`${typeof window !== "undefined" ? window.location.origin : ""}/diagnostico-cv/${result.token}`}
              </a>
            </div>

            <button
              onClick={() => {
                setResult(null);
                setEmail("");
                setName("");
              }}
              className="w-full py-4 bg-[#111f1b] text-[#f4f0e6] rounded-xl font-bold text-lg hover:bg-[#1a2e28] transition-colors border border-[rgba(255,255,255,.08)]"
            >
              Crear otra sesion
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
