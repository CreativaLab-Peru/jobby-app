"use client";

import { useState } from "react"; // Necesario para el modal
import { motion } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  ExternalLink,
  MapPin,
  ShieldCheck,
  Calendar,
  UserCheck,
  Award,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { RoadmapDisplay } from "@/features/roadmap/components/roadmap-display";
import type { RoadmapDetail } from "@/features/roadmap/actions/get-roadmap-by-id";
import { formatDate } from "@/utils/format-date";
import { MentorBadge } from "@/features/booking/components/mentor-badge";
import { BookingModal } from "@/features/booking/components/booking-modal";
import {RouteDossier} from "@/features/booking/actions/get-route-dossier";

const OPPORTUNITY_LABELS: Record<string, string> = {
  INTERNSHIP: "Pasantía",
  SCHOLARSHIP: "Beca",
  EXCHANGE_PROGRAM: "Intercambio",
  EMPLOYMENT: "Empleo",
  STARTUP: "Aceleradora",
};

interface RoadmapDetailScreenProps {
  roadmap: RoadmapDetail;
  canViewFull: boolean;
  dossier: Extract<RouteDossier, { success: true }>["data"];
}

export function RoadmapDetailScreen({
                                      roadmap,
                                      canViewFull,
                                      dossier,
                                    }: RoadmapDetailScreenProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const opp = roadmap.opportunity;

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      {/* Ajustamos el max-w para dar espacio al sidebar en pantallas grandes */}
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* COLUMNA PRINCIPAL (Roadmap) - Ocupa 8 de 12 columnas */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-8 space-y-6"
          >
            {/* Back Button */}
            <Button
              variant="ghost"
              asChild
              className="rounded-xl font-bold text-muted-foreground group"
            >
              <Link href="/my-roadmaps">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Mis Roadmaps
              </Link>
            </Button>

            {/* Context Card */}
            <div className="rounded-xl border border-border bg-card p-5 space-y-2">
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded bg-secondary/50 border border-border">
                      {OPPORTUNITY_LABELS[opp.type] || opp.type}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatDate(roadmap.createdAt, "d MMM yyyy")}
                    </span>
                  </div>
                  <h2 className="font-bold text-lg truncate">{opp.title}</h2>
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    {opp.company && (
                      <span className="flex items-center gap-1">
                        <Building2 className="w-3 h-3" />
                        {opp.company}
                      </span>
                    )}
                    {opp.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {opp.location}
                      </span>
                    )}
                  </div>
                </div>
                <Button variant="outline" size="sm" asChild className="shrink-0 rounded-lg text-xs font-bold">
                  <a href={opp.linkUrl} target="_blank" rel="noopener noreferrer">
                    Postular
                    <ExternalLink className="w-3 h-3 ml-1.5" />
                  </a>
                </Button>
              </div>
            </div>

            <RoadmapDisplay
              title={roadmap.title}
              summary={roadmap.summary}
              steps={roadmap.steps}
              canViewFull={canViewFull}
            />
          </motion.div>

          {/* ASIDE (Publicidad de Mentoría) - Ocupa 4 de 12 columnas */}
          <aside className="lg:col-span-4 space-y-6">
            <div className="sticky top-8"> {/* Para que nos siga al hacer scroll */}
              <Card className="border border-border bg-card rounded-2xl overflow-hidden shadow-sm p-6 space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-primary">
                    <ShieldCheck className="w-5 h-5" />
                    <span className="text-xs font-black uppercase tracking-tighter">Mentoría 1:1</span>
                  </div>
                  <h3 className="text-lg font-bold leading-tight">
                    ¿Quieres asegurar tu {OPPORTUNITY_LABELS[opp.type]?.toLowerCase() || "oportunidad"}?
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Valida tu estrategia del roadmap con un experto y recibe feedback personalizado.
                  </p>
                </div>

                {/* Perfil simplificado para Sidebar */}
                <div className="flex items-center gap-4 py-2">
                  <div className="relative h-14 w-14 rounded-full border border-border overflow-hidden shrink-0">
                    <Image
                      src="/people/darita.jpeg"
                      alt="Dara Mariluz"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-sm font-bold">Dara Mariluz</span>
                      <UserCheck className="w-3 h-3 text-primary" />
                    </div>
                    <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Career Strategist
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5">
                  <MentorBadge icon={Award}>Startup Peru</MentorBadge>
                  <MentorBadge icon={Award}>Chevening</MentorBadge>
                </div>

                <Button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full rounded-xl font-bold py-6 shadow-md hover:shadow-lg transition-all"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Revisión
                </Button>

                <p className="text-[10px] text-center text-muted-foreground">
                  Acelera tu roadmap con una mentoría
                </p>
              </Card>
            </div>
          </aside>
        </div>
      </div>

      {/* Modal de reserva */}
      <BookingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        userName={dossier.userName}
        userEmail={dossier.userEmail}
        score={dossier.cv.score}
      />
    </main>
  );
}
