import { TrendingUp } from "lucide-react"

export function AnalysisHeader() {
  return (
    <header className="flex items-center gap-3">
      <div className="p-2 rounded-xl bg-primary/10 text-primary">
        <TrendingUp className="w-5 h-5" />
      </div>
      <div>
        <h1 className="text-xl font-bold tracking-tight">
          Análisis de Perfil <span className="text-primary">IA</span>
        </h1>
        <p className="text-xs text-muted-foreground">
          Métricas y optimización basadas en modelos de reclutamiento.
        </p>
      </div>
    </header>
  )
}
