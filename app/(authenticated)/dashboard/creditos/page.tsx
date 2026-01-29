"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Sparkles, Radar, Users, ArrowRight, CreditCard } from "lucide-react";


export default function Creditos() {
  // TODO: Obtener los datos de planes y usuario desde props, context o fetch en el layout superior
  // Por ahora, se usan valores mock para starterPlan, proPlan y currentPlan
  const starterPlan = { name: "Starter", price: 9.90, max_cvs: 3, max_opportunities: 5 };
  const proPlan = { name: "Pro", price: 19.90, max_cvs: 10, max_opportunities: 10 };
  // Simulación: null si el usuario no tiene plan activo
  // const currentPlan = starterPlan; // Si tiene Starter
  // const currentPlan = proPlan; // Si tiene Pro
  const currentPlan = null; // Si NO tiene plan activo

  return (
    <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold mb-2">Mejora tu Plan</h1>
          <p className="text-muted-foreground">
            No es suscripción. No se renueva automáticamente. Pagas solo cuando lo necesitas.
          </p>
        </div>

        {/* Plan Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Starter Plan */}
          <div className={`relative bg-card border rounded-2xl p-6 transition-all ${
            currentPlan?.name === "Starter" ? "border-lime shadow-lg" : "border-border hover:border-lime/30"
          }`}>
            {/* El badge de 'Plan Actual' solo si el usuario tiene ese plan, pero el botón siempre aparece */}
            {currentPlan && currentPlan.name === "Starter" && (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-lime-foreground">
                Plan Actual
              </Badge>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-1">Starter</h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold">S/ {starterPlan?.price?.toFixed(2) || "9.90"}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Pago único</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Hasta {starterPlan?.max_cvs || 3} CVs guardados</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Análisis y feedback de CV</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Máximo {starterPlan?.max_opportunities || 5} oportunidades personalizadas</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Score de empleabilidad</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-4 h-4 shrink-0" />
                <span className="line-through">Radar Pro de oportunidades</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="w-4 h-4 shrink-0" />
                <span className="line-through">Comunidad activa</span>
              </li>
            </ul>

            <Button 
              variant="outline" 
              className="w-full"
              disabled={currentPlan && currentPlan.name === "Starter"}
            >
              {currentPlan && currentPlan.name === "Starter" ? "Plan Actual" : "Comprar Starter"}
            </Button>
          </div>

          {/* Pro Plan */}
          <div className={`relative bg-card border rounded-2xl p-6 transition-all ${
            currentPlan?.name === "Pro" ? "border-lime shadow-lg" : "border-lime/50 hover:border-lime"
          }`}>
            {currentPlan && currentPlan.name === "Pro" ? (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-lime text-lime-foreground">
                Plan Actual
              </Badge>
            ) : (
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-coral text-white">
                Recomendado
              </Badge>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold mb-1 flex items-center justify-center gap-2">
                Pro
                <Sparkles className="h-5 w-5 text-lime" />
              </h3>
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-extrabold">S/ {proPlan?.price?.toFixed(2) || "19.90"}</span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">Pago único</p>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Hasta {proPlan?.max_cvs || 10} CVs guardados</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Análisis, feedback y re-análisis</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Hasta {proPlan?.max_opportunities || 10} oportunidades personalizadas</span>
              </li>
              <li className="flex items-center gap-3 text-sm">
                <Check className="h-4 w-4 text-lime shrink-0" />
                <span>Recomendaciones por cada CV optimizado</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <Radar className="h-4 w-4 text-lime shrink-0" />
                <span>Radar Pro de oportunidades</span>
              </li>
              <li className="flex items-center gap-3 text-sm font-medium">
                <Users className="h-4 w-4 text-lime shrink-0" />
                <span>Comunidad activa</span>
              </li>
            </ul>

            <Button 
              variant="accent" 
              className="w-full"
              disabled={currentPlan && currentPlan.name === "Pro"}
            >
              {currentPlan && currentPlan.name === "Pro" ? (
                "Plan Actual"
              ) : (
                <>
                  Desbloquear Pro
                  <ArrowRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-secondary/50 border border-border rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <CreditCard className="h-5 w-5 text-muted-foreground" />
            <span className="font-medium">Pago seguro</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Al hacer clic en comprar serás redirigido a nuestra pasarela de pago segura.
            <br />
            Aceptamos tarjetas de crédito/débito y otros métodos de pago locales.
          </p>
        </div>
    </div>
  );
}
