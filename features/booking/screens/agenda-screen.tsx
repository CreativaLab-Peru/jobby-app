"use client";

import { useState } from "react";
import {
  ShieldCheck,
  Calendar,
  FileDown,
  Award,
  Sparkles,
  UserCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookingModal } from "../components/booking-modal";
import { MentorBadge } from "@/features/booking/components/mentor-badge";
import Image from "next/image";
import {DownloadDossierButton} from "@/features/booking/components/pdf-download-link";
import {RouteDossier} from "@/features/booking/actions/get-route-dossier";

interface AgendaScreenProps {
  dossier: Extract<RouteDossier, { success: true }>["data"];
}

export function AgendaScreen({ dossier }: AgendaScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background pb-20 pt-20">
      <main className="max-w-3xl mx-auto px-4 pt-12 space-y-8">

        {/* --- HEADER (Basado en Roadmap Header) --- */}
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-primary/10 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">Potencia tu aplicación con un mentor experto</h2>
            <p className="text-xs text-muted-foreground font-medium">
              Valida tu estrategia y recibe feedback directo para asegurar tu éxito
            </p>
          </div>
        </div>

        {/* --- MENTOR CARD (Basado en Step Card) --- */}
        <Card className="border border-border bg-card rounded-xl overflow-hidden shadow-sm">
          <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">

            {/* Perfil Sidebar */}
            <div className="flex flex-col items-center gap-2 shrink-0">
              {/* Añadimos 'relative' para que 'fill' funcione correctamente */}
              <div className="relative h-28 w-28 rounded-full border border-border bg-muted overflow-hidden">
                <Image
                  src="/people/darita.jpeg"
                  alt="Dara Mariluz"
                  className="object-cover" // Quitamos h-full/w-full porque 'fill' se encarga
                  fill
                  sizes="112px" // Optimización: 28 * 4 = 112px
                  priority // Opcional: si es la imagen principal de la página
                />
              </div>

              <div className="flex items-center gap-1.5 px-3 py-1 bg-secundary/10 border border-secundary/20 rounded-lg">
                <ShieldCheck className="w-4 h-4" />
                <span className="text-[10px] font-black text-secundary uppercase tracking-tight">Mentora calificada</span>
              </div>

              {/* Badge de disponibilidad alineado a tu sistema de diseño */}
              <div className="flex items-center gap-1.5 px-3 py-1 bg-primary/10 border border-primary/20 rounded-lg">
                <div className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black text-primary uppercase tracking-tight">En linea</span>
              </div>

            </div>

            {/* Contenido */}
            <div className="flex-1 space-y-5">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xl font-bold tracking-tight text-foreground">Dara Mariluz</h3>
                  <UserCheck className="w-4 h-4 text-primary" />
                </div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                  Founder & Career Strategist
                </p>
              </div>

              {/* Badges con el estilo de tus Resources */}
              <div className="flex flex-wrap gap-2 pt-1">
                <MentorBadge icon={Award}>Le Wagon</MentorBadge>
                <MentorBadge icon={Award}>Startup Peru</MentorBadge>
                <MentorBadge icon={Award}>Chevening</MentorBadge>
                <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-md bg-secondary/50 border border-border text-muted-foreground">
                  +7 becas
                </span>
              </div>

              {/* Quote con estilo de Descripción de Step */}
              <div className="relative p-4 rounded-xl bg-muted/30 border border-border italic text-sm text-foreground leading-relaxed">
                "{dossier.userName.split(' ')[0]}, he diseñado tu roadmap de IA, pero nada supera una revisión humana final."
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4 pt-2">
                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full sm:w-fit h-11 px-8 rounded-lg font-bold text-sm gap-2 shadow-sm"
                >
                  <Calendar className="h-4 w-4" />
                  Agendar revisión con Dara
                </Button>
                {/*<span className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-bold uppercase tracking-widest">*/}
                {/*  <Clock className="w-3.5 h-3.5 text-primary" />*/}
                {/*  Sesión de 30 min*/}
                {/*</span>*/}
              </div>
            </div>
          </div>
        </Card>

        {/* --- DOSSIER CARD (Basado en Upgrade CTA) --- */}
        <div className="rounded-xl border border-dashed border-primary/30 bg-primary/5 p-6 flex flex-col md:flex-row items-center justify-between gap-6 transition-all hover:bg-primary/10">
          <div className="flex items-start gap-4">
            <div className="p-2 bg-background rounded-lg border border-primary/20">
              <FileDown className="w-5 h-5 text-primary" />
            </div>
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h4 className="text-sm font-bold text-foreground">Dossier de Candidato</h4>
                <Sparkles className="w-3.5 h-3.5 text-primary" />
              </div>
              <p className="text-xs text-muted-foreground font-medium">
                Tu reporte de <span className="text-primary font-bold">{dossier.cv.score} pts</span> y roadmap listo para ser validado.
              </p>
            </div>
          </div>

         < DownloadDossierButton dossier={dossier} />
        </div>

      </main>

      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={dossier.userName}
      />
    </div>
  );
}
