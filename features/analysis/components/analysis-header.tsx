import { TrendingUp } from "lucide-react"

export function AnalysisHeader() {
  return (
    <header className="text-center space-y-4">
      <div className="inline-flex p-3 rounded-2xl bg-primary/10 border border-primary/20 text-primary">
        <TrendingUp className="w-6 h-6" />
      </div>

      <div className="space-y-2">
        <h1 className="text-3xl font-black tracking-tight">
          Análisis de Perfil <span className="text-primary">IA</span>
        </h1>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          Métricas de mercado y optimización técnica basadas en modelos de reclutamiento avanzados.
        </p>
      </div>
    </header>
  )
}
