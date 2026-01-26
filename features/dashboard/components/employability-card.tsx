"use client"

import { Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Props {
  score: number;
  sector: string | null;
}

export function EmployabilityCard({ score, sector }: Props) {
  const dashOffset = 364.4 - (364.4 * score) / 100;
  const status = score > 70 ? 'Altamente Competitivo' : score > 40 ? 'En Crecimiento' : 'En Construcción';
  const statusColor = score > 70 ? 'text-green-500 dark:text-green-300' : score > 40 ? 'text-blue-500 dark:text-blue-300' : 'text-yellow-500 dark:text-yellow-300';

  return (
    <Card className="md:col-span-2 relative overflow-hidden border-0 shadow-xl bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950">
      {/* Fondo decorativo */}
      <div className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-gradient-to-br from-blue-200 via-coral-200 to-transparent opacity-30 dark:from-blue-900 dark:via-coral-950 dark:to-transparent dark:opacity-20 z-0 blur-sm" />
      <CardHeader className="relative z-10 pb-2">
        <CardTitle className="text-base font-black uppercase tracking-widest text-gray-700 dark:text-gray-100 flex items-center gap-2">
          <Target className="w-6 h-6 text-blue-400 dark:text-blue-300" /> Índice de Empleabilidad
        </CardTitle>
      </CardHeader>
      <CardContent className="relative z-10 flex flex-col md:flex-row items-center gap-8 pt-0">
        {/* Progreso circular */}
        <div className="relative flex items-center justify-center w-36 h-36">
          <svg className="w-36 h-36 transform -rotate-90">
            <circle cx="72" cy="72" r="58" stroke="#e5e7eb" strokeWidth="12" fill="transparent" className="dark:stroke-[#23272f]" />
            <circle
              cx="72" cy="72" r="58"
              stroke={score > 70 ? '#22c55e' : score > 40 ? '#3b82f6' : '#facc15'}
              strokeWidth="12"
              fill="transparent"
              className="transition-all duration-1000"
              strokeDasharray={364.4}
              strokeDashoffset={dashOffset}
              style={{ filter: score > 70 ? 'drop-shadow(0 2px 8px rgba(34,197,94,0.15))' : score > 40 ? 'drop-shadow(0 2px 8px rgba(59,130,246,0.15))' : 'drop-shadow(0 2px 8px rgba(250,204,21,0.15))' }}
            />
          </svg>
          <span className="absolute text-4xl font-black text-gray-800 dark:text-white drop-shadow dark:drop-shadow-lg">{score}%</span>
        </div>
        <div className="flex-1 space-y-3">
          <div className="flex items-center gap-2 mb-1">
            <span className={`font-bold text-lg uppercase ${statusColor} dark:drop-shadow`}>{status}</span>
            {sector && <span className="text-xs font-bold uppercase text-blue-500 dark:text-blue-200 bg-blue-100 dark:bg-blue-900 px-2 py-0.5 rounded-full shadow-sm border border-blue-200 dark:border-blue-700">{sector.replace('_', ' ')}</span>}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-300 font-medium leading-relaxed">
            Tu perfil está <span className="font-bold italic text-gray-700 dark:text-white">{status}</span>
            {sector && <> en el sector <span className="text-blue-500 dark:text-blue-200 font-bold uppercase">{sector.replace('_', ' ')}</span></>}. 
          </p>
          <div className="flex gap-2 mt-2">
            <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200 border-none font-bold shadow-sm">Actualizado</Badge>
            <Badge variant="outline" className="font-bold border-2 border-blue-400 text-blue-500 dark:border-blue-600 dark:text-blue-200 bg-white/80 dark:bg-[#23272f] shadow-sm">Levely AI Verified</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
