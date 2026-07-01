import { RadarLanding } from "@/features/radar-de-becas/components/radar-landing";
import { PublicPageTransition } from "@/components/shared/public-page-transition";
import {Metadata} from "next";

export const metadata: Metadata = {
  title: "Radar de Becas — Levely",
  description:
    "Cada mañana escaneamos más de 100 fuentes y te enviamos las mejores becas del día — full funded, maestrías, doctorados y fellowships. Gratis siempre.",
};

export default function RutaPage() {
  return (
    <PublicPageTransition>
      <RadarLanding />
    </PublicPageTransition>
  );
}
