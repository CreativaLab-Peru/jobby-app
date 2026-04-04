"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter} from "next/navigation";
import {CheckCircle2, Loader2, Circle, Terminal, Sparkles, Search, ShieldCheck} from "lucide-react";
import {authClient} from "@/lib/auth-client";
import {cn} from "@/lib/utils";
import {promoteTempAnalysisAction} from "@/features/onboarding/actions/promote-temp-analysis";
import {getPipelineStatus} from "@/features/onboarding/actions/get-pipeline-status";
import {JobStatus} from "@prisma/client";

interface AnalysisLoadingScreenProps {
  temporalUserId: string
  tempCvEvaluationId: string
}

export function AnalysisLoadingScreen({
                                        tempCvEvaluationId,
                                        temporalUserId
                                      }: AnalysisLoadingScreenProps) {
  const [pipeline, setPipeline] = useState({
    config: JobStatus.PENDING as JobStatus,
    analysis: JobStatus.PENDING as JobStatus,
    matches: JobStatus.PENDING as JobStatus
  });
  const [logs, setLogs] = useState<string[]>(["Iniciando protocolo de migración..."]);
  const [createdCvId, setCreatedCvId] = useState<string | null>(null);
  const router = useRouter();
  const pollInterval = useRef<NodeJS.Timeout | null>(null);

  // Helper para agregar logs tipo agente
  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]); // Mantenemos los últimos 5 logs
  };

  const startPipeline = async () => {
    const session = await authClient.getSession();
    if (!session?.data?.user) return router.push("/login");

    addLog("Identidad confirmada. Vinculando cuenta...");

    const result = await promoteTempAnalysisAction({
      tempCvEvaluationId,
      temporalUserId,
    });

    if (result.success && result.cvId) {
      setCreatedCvId(result.cvId);
      addLog("Estructura de CV creada con éxito.");
    } else {
      addLog("Error crítico en la vinculación.");
    }
  };

  useEffect(() => {
    startPipeline();
    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, []);

  // Polling Real-time
  useEffect(() => {
    if (!createdCvId) return;

    pollInterval.current = setInterval(async () => {
      const res = await getPipelineStatus(createdCvId);
      if (res.success && res.steps) {
        setPipeline(res.steps);

        // Lógica de logs dinámicos basada en status
        if (res.steps.config === JobStatus.SUCCEEDED) addLog("CV configurado correctamente.");
        if (res.steps.analysis === JobStatus.IN_PROGRESS) addLog("IA Analizando trayectoria profesional...");
        if (res.steps.matches === JobStatus.IN_PROGRESS) addLog("Escaneando mercado global de vacantes...");

        // Redirección final
        if (res.steps.matches === JobStatus.SUCCEEDED) {
          addLog("¡Todo listo! Redirigiendo...");
          if (pollInterval.current) clearInterval(pollInterval.current);
          setTimeout(() => router.push("/dashboard"), 1500);
        }
      }
    }, 3000);

    return () => {
      if (pollInterval.current) clearInterval(pollInterval.current);
    };
  }, [createdCvId]);

  const steps = [
    {
      id: "config",
      label: "Configuración",
      status: pipeline.config,
      icon: ShieldCheck,
      desc: "Migrando datos a tu bóveda segura"
    },
    {
      id: "analysis",
      label: "Auditoría IA",
      status: pipeline.analysis,
      icon: Sparkles,
      desc: "Evaluando score y habilidades"
    },
    {
      id: "matches",
      label: "Match Engine",
      status: pipeline.matches,
      icon: Search,
      desc: "Buscando oportunidades activas"
    },
  ];

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center p-6 bg-background selection:bg-primary/30">
      <div className="max-w-xl w-full space-y-10">

        {/* Header Agente */}
        <div className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest animate-pulse">
            <Terminal className="w-3 h-3"/> Agent Levely Active
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Procesando tu <span className="text-primary">Futuro</span>
          </h1>
        </div>

        {/* Pasos Visuales */}
        <div className="grid grid-cols-1 gap-4">
          {steps.map((s) => (
            <div
              key={s.id}
              className={cn(
                "relative overflow-hidden flex items-center gap-5 p-5 rounded-[2rem] border transition-all duration-700",
                s.status === JobStatus.IN_PROGRESS ? "bg-primary/5 border-primary shadow-glow scale-[1.02]" : "bg-card border-border/40 opacity-60"
              )}
            >
              <div className={cn(
                "p-3 rounded-2xl",
                s.status === JobStatus.SUCCEEDED ? "bg-levely-green/10 text-levely-green" :
                  s.status === JobStatus.IN_PROGRESS ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <s.icon className="w-6 h-6"/>
              </div>

              <div className="flex-1">
                <h3 className="font-black uppercase italic text-sm tracking-tight">{s.label}</h3>
                <p className="text-xs text-muted-foreground font-medium">{s.desc}</p>
              </div>

              <div className="flex items-center justify-center w-10">
                {s.status === JobStatus.SUCCEEDED ? (
                  <CheckCircle2 className="w-6 h-6 text-levely-green animate-in zoom-in"/>
                ) : s.status === JobStatus.IN_PROGRESS ? (
                  <Loader2 className="w-6 h-6 text-primary animate-spin"/>
                ) : (
                  <Circle className="w-6 h-6 text-border"/>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Consola de Logs (El toque del Agente) */}
        <div
          className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 font-mono text-[11px] space-y-2 border border-border/20">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2">
              <span
                className="text-primary font-bold">[{new Date().toLocaleTimeString([], {hour12: false})}]</span>
              <span className="text-muted-foreground">{log}</span>
            </div>
          ))}
          <div className="w-1 h-3 bg-primary animate-caret-blink inline-block ml-1"/>
        </div>

      </div>
    </div>
  );
}
