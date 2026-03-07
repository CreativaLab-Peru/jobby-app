"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Mic2, Target, Building2, Rocket, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {cn} from "@/lib/utils";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  opportunities: any[];
  onStart: (opp: any) => void;
  isConnecting: boolean;
}

export function NewInterviewModal({ isOpen, onClose, opportunities, onStart, isConnecting }: Props) {
  const [selectedOppId, setSelectedOppId] = useState<string | null>(null);

  const selectedOpp = opportunities.find(o => o.id === selectedOppId);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-4 z-50 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-background rounded-[2.5rem] shadow-2xl max-w-xl w-full overflow-hidden flex flex-col border border-border"
          >
            <div className="p-8 border-b">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-black tracking-tight uppercase">Nueva Simulación</h2>
                  <p className="text-sm text-muted-foreground mt-1 font-medium">
                    Prepara tu entrevista basada en una vacante específica.
                  </p>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <div className="p-8 space-y-4 max-h-[50vh] overflow-y-auto">
              {opportunities.length === 0 ? (
                <div className="text-center py-10 opacity-50 italic">
                  No tienes oportunidades con match. Analiza un CV primero.
                </div>
              ) : (
                opportunities.map((opp) => (
                  <button
                    key={opp.id}
                    onClick={() => setSelectedOppId(opp.id)}
                    className={cn(
                      "w-full text-left p-5 rounded-2xl border-2 transition-all flex items-center justify-between group",
                      selectedOppId === opp.id
                        ? "border-primary bg-primary/5 shadow-inner"
                        : "border-border hover:border-primary/40 hover:bg-muted/30"
                    )}
                  >
                    <div className="flex flex-col gap-1">
                      <span className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {opp.company || "Empresa"}
                      </span>
                      <h4 className="font-bold text-lg leading-tight">{opp.title}</h4>
                      <span className="text-[10px] font-medium text-muted-foreground italic">
                        CV: {opp.cv?.title}
                      </span>
                    </div>
                    <div className={cn(
                      "w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all",
                      selectedOppId === opp.id ? "border-primary bg-primary" : "border-muted-foreground"
                    )}>
                      {selectedOppId === opp.id && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                  </button>
                ))
              )}
            </div>

            <div className="p-8 border-t bg-muted/10 flex flex-col gap-4">
              <div className="flex items-start gap-3 p-3 rounded-xl bg-primary/10 border border-primary/20">
                <AlertCircle className="w-4 h-4 text-primary mt-0.5" />
                <p className="text-[10px] font-medium leading-relaxed text-primary/80 uppercase tracking-tight">
                  La IA actuará como reclutador de la empresa seleccionada y usará tu CV específico para evaluarte.
                </p>
              </div>

              <div className="flex gap-3 justify-end">
                <Button variant="outline" onClick={onClose} className="rounded-xl font-bold px-6 h-12 text-xs uppercase tracking-widest">
                  Cancelar
                </Button>
                <Button
                  onClick={() => onStart(selectedOpp)}
                  disabled={!selectedOppId || isConnecting}
                  className="rounded-xl bg-primary font-black px-8 h-12 text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                  {isConnecting ? "Sincronizando..." : "Empezar Ahora"}
                  {!isConnecting && <Rocket className="ml-2 w-4 h-4" />}
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
