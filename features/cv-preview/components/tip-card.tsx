import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"
import {OPPORTUNITY_MAP} from "@/const"; // Importamos el icono

interface TipCardProps {
  opportunityType: string
}

export function TipCard({ opportunityType }: TipCardProps) {
  const opportunityMapped = OPPORTUNITY_MAP[opportunityType] || "No especificado";
  return (
    <Card className="shadow-card border-border bg-muted/50 overflow-hidden relative">
      {/* Decoración sutil: Un toque del gradiente de marca en el borde izquierdo */}
      <div className="absolute left-0 top-0 bottom-0 w-1 ai-gradient" />

      <CardContent className="p-6">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          Consejo
        </h4>

        <p className="text-sm text-muted-foreground leading-relaxed">
          Tu CV está optimizado para{" "}
          <span className="font-bold text-foreground">
            {opportunityMapped}
          </span>. El análisis te mostrará cómo mejorarlo aún más.
        </p>
      </CardContent>
    </Card>
  )
}
