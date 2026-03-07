"use client";

import { useEffect } from "react";
import { PhoneOff, ShieldCheck, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AIAvatar } from "../components/ai-avatar";
import { LiveTranscript } from "../components/live-transcript";
import {useVapi} from "@/features/interview/hooks/use-vapi";
import {useRouter} from "next/navigation";

interface InterviewSessionScreenProps {
  cvId: string;
  oppId: string;
}

export default function InterviewSessionScreen({ oppId, cvId }: InterviewSessionScreenProps) {
  const router = useRouter();

  const {
    startCall,
    endCall,
    isConnected,
    isConnecting,
    isSpeaking,
    transcript
  } = useVapi();

  useEffect(() => {
    if (oppId && cvId) startCall(oppId, cvId);
  }, [oppId, cvId, startCall]);

  const handleEndCall = () => {
    endCall();
    setTimeout(() => {
      router.push("/interviews");
    }, 1000); // Pequeña demora para que el usuario vea que la llamada terminó
  };

  return (
    <div className="min-h-[93vh] bg-neutral-950 text-foreground flex flex-col items-center justify-between p-8 overflow-hidden relative">
      {/* Fondo con Gradiente Sutil (Uso de Primary/Secondary) */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05),transparent_70%)]" />

      {/* 1. Header de Estado */}
      <header className="z-20 w-full flex justify-between items-center max-w-5xl">
        <div className="flex items-center gap-3 bg-secondary/20 backdrop-blur-xl px-5 py-2.5 rounded-2xl border border-white/5">
          <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]' : 'bg-destructive'}`} />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">
            {isConnected ? "Sesión Encriptada" : isConnecting ? "Estableciendo Puente..." : "Desconectado"}
          </span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">IA en Entrenamiento</span>
        </div>
      </header>

      {/* 2. Área Central: Personaje de IA */}
      <section className="flex-1 flex flex-col items-center justify-center gap-12 w-full">
        <AIAvatar isSpeaking={isSpeaking} isConnected={isConnected} />

        {/* 3. Transcripción Integrada */}
        <LiveTranscript messages={transcript} />
      </section>

      {/* 4. Controles e Info */}
      <footer className="z-20 w-full max-w-xl flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-3 group">
          <Button
            variant="destructive"
            size="lg"
            onClick={handleEndCall}
            className="rounded-[2rem] w-20 h-20 shadow-2xl shadow-destructive/20 hover:scale-110 active:scale-95 transition-all duration-300"
          >
            <PhoneOff className="w-8 h-8 text-white" />
          </Button>
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground group-hover:text-destructive transition-colors">
            Finalizar Simulación
          </span>
        </div>

        <div className="flex items-center gap-4 py-4 border-t border-white/5 w-full justify-center">
          <div className="flex items-center gap-2 opacity-40">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span className="text-[9px] font-black uppercase tracking-tighter text-white">
              Privacidad Garantizada: Tus datos no se usan para entrenamiento externo.
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
