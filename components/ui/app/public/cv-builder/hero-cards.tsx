import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp,
  Lightbulb,
  Target,
  Briefcase,
  GraduationCap,
  Building2,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  Rocket,
} from "lucide-react";

export function HeroCards() {
  return (
    <div className="relative w-full max-w-lg mx-auto">
      {/* Background glow effects */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-levely-green/30 rounded-full blur-3xl" />
      <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-purple-400/20 rounded-full blur-3xl" />

      {/* Main cards container with staggered layout */}
      <div className="relative space-y-4">
        {/* Employability Score Card - Main featured card */}
        <Card className="relative bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-xl shadow-slate-200/50 dark:shadow-slate-900/50 overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-levely-green/20 to-transparent" />
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-lime-600" />
                  Score de empleabilidad
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold bg-gradient-to-r from-slate-900 to-slate-600 dark:from-white dark:to-slate-300 bg-clip-text text-transparent">
                    92%
                  </span>
                  <span className="text-sm font-medium text-lime-600 flex items-center gap-1">
                    <TrendingUp className="w-3 h-3" />
                    +12%
                  </span>
                </div>
                <Progress value={92} className="h-2 bg-slate-100 dark:bg-slate-800" />
              </div>
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-levely-green to-levely-green/60 flex items-center justify-center shadow-lg shadow-levely-green/30">
                  <Sparkles className="w-8 h-8 text-levely-dark" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Two cards side by side */}
        <div className="grid grid-cols-2 gap-4">
          {/* AI CV Insights Card */}
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg shadow-purple-100/50 dark:shadow-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-purple-600 dark:text-purple-400 mb-3">
                <Lightbulb className="w-4 h-4" />
                AI Insights
              </div>
              <div className="space-y-2">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span>Añade métricas de impacto</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span>Optimiza keywords ATS</span>
                </div>
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <CheckCircle2 className="w-3.5 h-3.5 text-lime-600 mt-0.5 flex-shrink-0" />
                  <span>Mejora tu resumen</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Opportunity Matches Card */}
          <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg shadow-blue-100/50 dark:shadow-slate-900/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 text-sm font-medium text-blue-600 dark:text-blue-400 mb-3">
                <Target className="w-4 h-4" />
                Oportunidades
              </div>
              <div className="grid grid-cols-3 gap-2">
                <div className="text-center">
                  <Briefcase className="w-4 h-4 mx-auto text-orange-500 mb-1" />
                  <div className="text-lg font-bold text-foreground">12</div>
                  <div className="text-[10px] text-muted-foreground">Empleos</div>
                </div>
                <div className="text-center">
                  <GraduationCap className="w-4 h-4 mx-auto text-purple-500 mb-1" />
                  <div className="text-lg font-bold text-foreground">3</div>
                  <div className="text-[10px] text-muted-foreground">Becas</div>
                </div>
                <div className="text-center">
                  <Building2 className="w-4 h-4 mx-auto text-blue-500 mb-1" />
                  <div className="text-lg font-bold text-foreground">8</div>
                  <div className="text-[10px] text-muted-foreground">Pasantías</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Roadmap Card */}
        <Card className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-sm border-0 shadow-lg shadow-orange-100/50 dark:shadow-slate-900/50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm font-medium text-orange-600 dark:text-orange-400 mb-4">
              <Rocket className="w-4 h-4" />
              Roadmap de Carrera
            </div>
            <div className="flex items-center justify-between">
              {/* Step 1 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-levely-green/20 flex items-center justify-center mb-2">
                  <CheckCircle2 className="w-5 h-5 text-lime-600" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center">
                  CV
                  <br />
                  Optimizado
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground/40" />

              {/* Step 2 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center mb-2">
                  <Target className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center">
                  Aplicar a<br />
                  Empleos
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground/40" />

              {/* Step 3 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mb-2">
                  <Briefcase className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center">
                  Entrevistas
                  <br />
                  Preparadas
                </span>
              </div>

              <ArrowRight className="w-4 h-4 text-muted-foreground/40" />

              {/* Step 4 */}
              <div className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mb-2">
                  <Rocket className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <span className="text-[10px] text-muted-foreground text-center">
                  Carrera
                  <br />
                  Lanzada
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Floating badge */}
      <div className="absolute -bottom-2 -right-2 px-4 py-2 rounded-full bg-levely-green text-levely-dark text-sm font-semibold shadow-lg shadow-levely-green/30 flex items-center gap-2">
        <Sparkles className="w-4 h-4" />
        IA Activa
      </div>
    </div>
  );
}
