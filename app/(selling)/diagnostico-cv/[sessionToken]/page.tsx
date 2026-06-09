import { Metadata } from "next";
import { hashMagicLinkToken } from "@/utils/magic-links";
import { prisma } from "@/lib/prisma";
import { DiagnosticoSessionFlow } from "@/features/diagnostico-cv/screens/diagnostico-session-flow";

interface PageProps {
  params: Promise<{ sessionToken: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Diagnostico de Beca - Sube tu CV",
    description: "Sube tu CV para comenzar tu diagnostico de beca",
  };
}

export default async function DiagnosticoSessionPage({ params }: PageProps) {
  const { sessionToken } = await params;

  // Verify session exists and is valid
  const hashedToken = hashMagicLinkToken(sessionToken);
  const session = await prisma.diagnosticSession.findUnique({
    where: { token: hashedToken },
  });

  if (!session) {
    return (
      <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Enlace invalido</h1>
          <p className="text-[#8a9e93]">
            Este enlace no es valido o ha expirado. Por favor, contacta a soporte si crees que esto es un error.
          </p>
        </div>
        </div>
    );
  }

  if (new Date() > session.expiresAt) {
    return (
      <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Enlace expirado</h1>
          <p className="text-[#8a9e93]">
            Este enlace ha expirado. Por favor, contacta a soporte si necesitas un nuevo enlace.
          </p>
        </div>
      </div>
    );
  }

  return <DiagnosticoSessionFlow session={session} sessionToken={sessionToken} />;
}
