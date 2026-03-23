import { Card, CardContent } from "@/components/ui/card"
import { Lightbulb } from "lucide-react"

interface TipCardProps {
  description: string;      // Texto principal (ej: "Tu CV está optimizado para")
  highlightedText: string;  // Lo que irá en negrita (ej: "Desarrollador Frontend")
  footer?: string;          // Texto opcional que va después (ej: ". El análisis te ayudará.")
}

export function TipCard({ description, highlightedText, footer }: TipCardProps) {
  return (
    <Card className="shadow-card border-border bg-muted/50 overflow-hidden relative">
      {/* El gradiente de marca que ya tienes definido */}
      <div className="absolute left-0 top-0 bottom-0 w-1 ai-gradient" />

      <CardContent className="p-5">
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-primary" />
          <span className="text-xs uppercase tracking-wider opacity-70">Consejo</span>
        </h4>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {description}{" "}
          <span className="font-bold text-foreground">
            {highlightedText}
          </span>
          {footer && ` ${footer}`}
        </p>
      </CardContent>
    </Card>
  )
}
