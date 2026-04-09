"use client";

import {useEffect, useState, useRef} from "react";
import {useRouter} from "next/navigation";
import {CheckCircle2, Loader2, Circle, Terminal, Sparkles, Search, ShieldCheck} from "lucide-react";
import {cn} from "@/lib/utils";
import {promoteTempAnalysisAction} from "@/features/onboarding/actions/promote-temp-analysis";
import {getPipelineStatus} from "@/features/onboarding/actions/get-pipeline-status";
import {JobStatus} from "@prisma/client";
import {getRoutesForUser} from "@/features/routes/actions/get-routes-for-user";
import {useRouteStore} from "@/store/use-route-store";

type PipelineSteps = {
  config: JobStatus;
  analysis: JobStatus;
  matches: JobStatus;
};

interface AnalysisLoadingScreenProps {
  temporalUserId: string;
  tempCvEvaluationId: string;
}

function SafeTimestamp() {
  const [time, setTime] = useState<string>("");

  useEffect(() => {
    setTime(new Date().toLocaleTimeString([], {hour12: false}));
  }, []);

  if (!time) return <span className="opacity-0">[00:00:00]</span>;
  return <span className="text-primary font-bold">[{time}]</span>;
}

export function AnalysisLoadingScreen({
                                        tempCvEvaluationId,
                                        temporalUserId
                                      }: AnalysisLoadingScreenProps) {
  const router = useRouter();
  const [logs, setLogs] = useState<string[]>(["Iniciando protocolo de migración..."]);
  const [pipeline, setPipeline] = useState<PipelineSteps>({
    config: JobStatus.PENDING,
    analysis: JobStatus.PENDING,
    matches: JobStatus.PENDING
  });

  // Route
  const {hydrate} = useRouteStore();

  const stateRef = useRef(pipeline); // Para evitar duplicados en logs
  const isPromoting = useRef(false);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev.slice(-4), msg]);
  };

  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

    const initAndPoll = async () => {
      if (isPromoting.current) return;
      isPromoting.current = true;

      // 1. Promover el CV
      addLog("Identidad confirmada. Vinculando cuenta...");
      const result = await promoteTempAnalysisAction({tempCvEvaluationId, temporalUserId});

      if (!result.success || !result.cvId) {
        addLog("Error crítico: No se pudo crear la estructura.");
        return;
      }
      addLog("Estructura de CV creada. Iniciando auditoría...");

      // 2. Iniciar Polling
      pollInterval = setInterval(async () => {
        const res = await getPipelineStatus(result.cvId!);
        if (!res.success) return;

        const {steps} = res;

        // Solo agregar log si el estado cambió (Evita spam en consola)
        if (steps.config === JobStatus.SUCCEEDED && stateRef.current.config !== JobStatus.SUCCEEDED) {
          addLog("Seguridad: Datos migrados a la bóveda.");
        }
        if (steps.analysis === JobStatus.IN_PROGRESS && stateRef.current.analysis !== JobStatus.IN_PROGRESS) {
          addLog("IA: Analizando trayectoria profesional...");
        }
        if (steps.matches === JobStatus.IN_PROGRESS && stateRef.current.matches !== JobStatus.IN_PROGRESS) {
          addLog("Engine: Escaneando mercado global...");
        }

        stateRef.current = steps;
        setPipeline(steps);

        if (steps.matches === JobStatus.SUCCEEDED) {
          addLog("¡Pasos completados con éxito!");
          clearInterval(pollInterval);
          const routesResult = await getRoutesForUser();
          if (routesResult.success) {
            hydrate(routesResult.routes);
          }
          setTimeout(() => router.push("/dashboard"), 1500);
        }
      }, 3000);
    };

    initAndPoll();
    return () => clearInterval(pollInterval);
  }, []);

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
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-background">
      <div className="max-w-xl w-full space-y-10">

        <div className="text-center space-y-4">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase animate-pulse">
            <Terminal className="w-3 h-3"/> Agent Levely Active
          </div>
          <h1 className="text-4xl font-black italic uppercase tracking-tighter">
            Procesando tu <span className="text-primary">Futuro</span>
          </h1>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {steps.map((s) => (
            <div key={s.id} className={cn(
              "relative flex items-center gap-5 p-5 rounded-[2rem] border transition-all duration-700",
              s.status === JobStatus.IN_PROGRESS ? "bg-primary/5 border-primary scale-[1.02] shadow-[0_0_20px_rgba(var(--primary),0.1)]" : "bg-card border-border/40 opacity-60"
            )}>
              <div className={cn("p-3 rounded-2xl",
                s.status === JobStatus.SUCCEEDED ? "bg-green-500/10 text-green-500" :
                  s.status === JobStatus.IN_PROGRESS ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
              )}>
                <s.icon className="w-6 h-6"/>
              </div>
              <div className="flex-1">
                <h3 className="font-black uppercase italic text-sm">{s.label}</h3>
                <p className="text-xs text-muted-foreground">{s.desc}</p>
              </div>
              <div>
                {s.status === JobStatus.SUCCEEDED ?
                  <CheckCircle2 className="w-6 h-6 text-green-500"/> :
                  s.status === JobStatus.IN_PROGRESS ?
                    <Loader2 className="w-6 h-6 text-primary animate-spin"/> :
                    <Circle className="w-6 h-6 text-border"/>}
              </div>
            </div>
          ))}
        </div>

        {/* Consola de Logs Corregida */}
        <div
          className="bg-black/5 dark:bg-white/5 rounded-3xl p-6 font-mono text-[11px] space-y-2 border border-border/20">
          {logs.map((log, i) => (
            <div key={i} className="flex gap-3 items-start animate-in fade-in slide-in-from-left-2">
              <SafeTimestamp/> {/* <--- SOLUCIÓN AL ERROR DE HIDRATACIÓN */}
              <span className="text-muted-foreground">{log}</span>
            </div>
          ))}
          <div className="w-1 h-3 bg-primary animate-pulse inline-block ml-1"/>
        </div>
      </div>
    </div>
  );
}
