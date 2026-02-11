import { Card, CardContent } from "@/components/ui/card"

interface TipCardProps {
  opportunityType: string
}

export function TipCard({ opportunityType }: TipCardProps) {
  return (
    <Card className="shadow-card border-border bg-muted/50 overflow-hidden relative">
      {/* Decoración sutil: Un toque del gradiente de marca en el borde izquierdo */}
      <div className="absolute left-0 top-0 bottom-0 w-1 ai-gradient" />

      <CardContent className="p-6">
        {/* Usamos foreground para el texto principal para asegurar contraste */}
        <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
          <span>💡</span> Consejo
        </h4>

        {/* Usamos muted-foreground para el texto secundario */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          Tu CV está optimizado para{" "}
          <span className="font-bold text-foreground">
            {opportunityType === "INTERNSHIP" && "Pasantía"}
            {opportunityType === "SCHOLARSHIP" && "Beca"}
            {opportunityType === "EXCHANGE_PROGRAM" && "Intercambio"}
            {opportunityType === "EMPLOYMENT" && "Empleo"}
            {!opportunityType && <span className="text-muted italic">No especificado</span>}
          </span>. El análisis te mostrará cómo mejorarlo aún más.
        </p>
      </CardContent>
    </Card>
  )
}
