import { Metadata } from "next";
import { DiagnosisFlow } from "@/features/diagnostico-cv/screens/diagnosis-flow";

export const metadata: Metadata = {
  title: "Diagnostico de Beca Levely | Analisis IA para Posgrado",
  description:
    "Descubre que becas de posgrado en UK, US, Alemania, Francia y Japon combinan contigo. Analisis IA de tu CV con score de competitividad.",
  keywords: [
    "becas internacionales",
    "diagnostico de beca",
    "posgrado",
    "UK",
    "US",
    "Alemania",
    "Chevening",
    "Fulbright",
    "DAAD",
  ],
  openGraph: {
    title: "Diagnostico de Beca Levely",
    description:
      "Descubre que becas de posgrado combinan contigo. Analisis IA personalizado.",
  },
};

interface DiagnosticoCvPageProps {
  searchParams: Promise<{
    payment?: "success" | "failure" | "pending";
  }>
}

export default async function DiagnosticoCvPage({searchParams}: DiagnosticoCvPageProps) {
  const {payment} = await searchParams;
  return <DiagnosisFlow paymentStatus={payment} />;
}
