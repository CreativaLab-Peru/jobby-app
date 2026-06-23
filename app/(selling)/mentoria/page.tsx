import { Metadata } from "next";
import { MentoriaFlow } from "@/features/mentoria/screens/mentoria-flow";

export const metadata: Metadata = {
  title: "Mentoría 1:1 de Beca | Levely",
  description:
    "En 60 minutos construimos la ruta exacta a tu beca. Sesión personalizada con Dara Mariluz, fundadora de Levely.",
};

interface MentoriaPageProps {
  searchParams: Promise<{ status?: "sent" | "error" }>;
}

export default async function MentoriaPage({ searchParams }: MentoriaPageProps) {
  const { status } = await searchParams;
  return <MentoriaFlow requestStatus={status} />;
}
