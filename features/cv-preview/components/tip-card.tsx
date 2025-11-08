import { Card, CardContent } from "@/components/ui/card"

interface TipCardProps {
  opportunityType: string
}

export function TipCard({ opportunityType }: TipCardProps) {
  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-yellow-50 to-orange-50">
      <CardContent className="p-6">
        <h4 className="font-semibold text-gray-800 mb-2">💡 Consejo</h4>
        <p className="text-sm text-gray-600">
          Tu CV está optimizado para {" "}
          <span className="font-bold">
            {opportunityType === "INTERNSHIP" && "Prácticas"}
            {opportunityType === "SCHOLARSHIP" && "Becas"}
            {opportunityType === "EXCHANGE_PROGRAM" && "Programas de Intercambio"}
            {opportunityType === "EMPLOYMENT" && "Empleos"}
            {!opportunityType && <span className="text-gray-400">No especificado</span>}
          </span>. El análisis te mostrará cómo mejorarlo aún más.
        </p>
      </CardContent>
    </Card>
  )
}
