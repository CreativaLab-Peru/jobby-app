import {Metadata} from "next";
import {
  getDiagnosticResultAction
} from "@/features/diagnostico-cv/actions/get-diagnostic-result-action";
import {DiagnosticResultScreen} from "@/features/diagnostico-cv/screens/diagnostic-result-screen";

interface PageProps {
  params: Promise<{ sessionToken: string }>;
}

export async function generateMetadata({params}: PageProps): Promise<Metadata> {
  const {sessionToken: id} = await params;
  const result = await getDiagnosticResultAction(id);
  if (!result.success) {
    return {title: "Diagnóstico no encontrado"};
  }
  return {
    title: `Diagnóstico de Beca — ${result.data.profileType}`,
    description: result.data.profileDescription,
  };
}

export default async function DiagnosticResultPage({params}: PageProps) {
  const {sessionToken: id} = await params;
  const result = await getDiagnosticResultAction(id);

  if (!result.success) {
    return <ErrorState type={result.error}/>;
  }

  return <DiagnosticResultScreen data={result.data}/>;
}

// ── Error states ──────────────────────────────────────────────────────────────

function ErrorState({type}: { type: "NOT_FOUND" | "INVALID_DATA" }) {
  const isNotFound = type === "NOT_FOUND";

  return (
    <div
      className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <div
          className="w-14 h-14 rounded-2xl bg-[#111f1b] flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7 text-[#8a9e93]" fill="none" stroke="currentColor"
               viewBox="0 0 24 24">
            {isNotFound ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              />
            )}
          </svg>
        </div>

        <h1
          className="text-xl font-bold mb-2"
          style={{fontFamily: "'Fraunces', serif"}}
        >
          {isNotFound ? "Diagnóstico no encontrado" : "Error al cargar los resultados"}
        </h1>
        <p className="text-[#8a9e93] text-sm leading-relaxed">
          {isNotFound
            ? "Este enlace no existe o ya expiró. Si acabas de completar tu diagnóstico, revisa tu correo para acceder a los resultados."
            : "Ocurrió un problema al leer tu diagnóstico. Por favor, contacta a soporte si el problema persiste."}
        </p>
      </div>
    </div>
  );
}
