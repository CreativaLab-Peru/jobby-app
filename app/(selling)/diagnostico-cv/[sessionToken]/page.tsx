//page.tsx
import {Metadata} from "next";
import {hashMagicLinkToken} from "@/utils/magic-links";
import {prisma} from "@/lib/prisma";
import {DiagnosisSessionFlow} from "@/features/diagnostico-cv/screens/diagnosis-session-flow";
import {DiagnosticStatus} from "@prisma/client";

interface PageProps {
  params: Promise<{ sessionToken: string }>;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Diagnostico de Beca - Sube tu CV",
    description: "Sube tu CV para comenzar tu diagnostico de beca",
  };
}

export default async function DiagnosisSessionPage({params}: PageProps) {
  const {sessionToken} = await params;

  // Verify session exists and is valid
  const hashedToken = hashMagicLinkToken(sessionToken);
  const session = await prisma.diagnosticSession.findUnique({
    where: {
      token: hashedToken,
    },
  });

  if (!session) {
    return (
      <div
        className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Enlace invalido</h1>
          <p className="text-[#8a9e93]">
            Este enlace no es valido o ha expirado. Por favor, contacta a soporte si crees que esto
            es un error.
          </p>
        </div>
      </div>
    );
  }

  if (new Date() > session.expiresAt) {
    return (
      <div
        className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-serif font-bold mb-4">Enlace expirado</h1>
          <p className="text-[#8a9e93]">
            Este enlace ha expirado. Por favor, contacta a soporte si necesitas un nuevo enlace.
          </p>
        </div>
      </div>
    );
  }

  if (session.status !== DiagnosticStatus.PENDING) {
    return (
      <div
        className="min-h-screen bg-[#080f0d] text-[#f4f0e6] flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div
            className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#c9f563]/10 mb-5">
            <svg className="w-6 h-6 text-[#c9f563]" fill="none" stroke="currentColor"
                 viewBox="0 0 24 24" strokeWidth={1.8}>
              <rect x="2" y="4" width="20" height="16" rx="2"/>
              <path d="M2 7l10 7 10-7"/>
            </svg>
          </div>
          <h1 className="text-[22px] font-bold font-serif mb-2">Tu diagnóstico ya fue generado</h1>
          <p className="text-[14px] text-[#8a9e93] leading-relaxed">
            Revisa tu correo — ahí encontrarás tus resultados y las oportunidades recomendadas para
            tu perfil.
          </p>
        </div>
      </div>
    );
  }

  return <DiagnosisSessionFlow session={session} sessionToken={sessionToken}/>;
}
