"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {ArrowRight, FileCheck, Gift, Sparkles} from "lucide-react";
import Link from "next/link";

interface AuthInterceptionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AuthInterceptionModal = ({
                                        open,
                                        onOpenChange
                                      }: AuthInterceptionModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      {/* bg-background y border-border para usar los colores del sistema */}
      <DialogContent className="sm:max-w-[500px] bg-background border-border rounded-3xl p-8 shadow-2xl">
        <DialogHeader className="flex flex-col items-center gap-2">

          {/* Logo usando color primary */}
          <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center mb-2 shadow-lg shadow-primary/20">
            <span className="text-2xl font-bold text-primary-foreground">L</span>
          </div>

          <DialogTitle className="text-2xl font-bold tracking-tight text-foreground">
            Comienza ahora
          </DialogTitle>
          <DialogDescription className="text-muted-foreground text-center">
            Crea una cuenta gratuita para analizar tu CV y guardar tus progresos.
          </DialogDescription>

          {/* Sección de Beneficios Gratuitos (UX: Reciprocidad) */}
          <div className="my-6 space-y-3 bg-secondary/30 p-4 rounded-2xl border border-border/50">
            <p className="text-xs font-bold text-primary flex items-center gap-2 mb-2 uppercase tracking-wider">
              <Gift className="w-4 h-4" /> Beneficios de bienvenida:
            </p>
            <div className="grid gap-2">
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="bg-primary/20 p-1 rounded-full text-primary">
                  <Sparkles className="w-3 h-3" />
                </div>
                <span><strong>1 Crédito IA</strong> para análisis profundo</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-foreground/80">
                <div className="bg-primary/20 p-1 rounded-full text-primary">
                  <FileCheck className="w-3 h-3" />
                </div>
                <span><strong>1 Creación de CV</strong> profesional gratis</span>
              </div>
            </div>
          </div>

          {/* Botón de Redirección Secundario */}
          <div className="flex justify-center">
            <Link href="/onboarding/talents" className="w-full">
              <Button
                variant="default"
              >
                Ir a Onboarding
                <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
