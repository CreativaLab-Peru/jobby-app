"use client";

import {useState} from "react";
import {motion} from "framer-motion";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Badge} from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Plus,
  X,
  Briefcase,
  Code,
  Palette,
  TrendingUpIcon,
  Users,
  BookOpen,
  Zap,
  Target,
  Sparkles
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {useRouter} from "next/navigation";
import {formatDate} from "@/utils/format-date";
import {CvWithRelations} from "@/features/cv/actions/get-cv-for-current-user";
import {categoryMap} from "@/features/analysis/data/category-map";
import {CvType, OpportunityType} from "@prisma/client";

interface ScoresListPageProps {
  cvs: CvWithRelations[];
  disabledButton?: boolean;
}

// Helper para colores según score usando tema
const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-secondary";
  return "text-accent";
};

const getScoreBadgeColor = (score: number) => {
  if (score >= 80) return "bg-primary/20 text-primary";
  if (score >= 60) return "bg-secondary/20 text-secondary";
  return "bg-accent/20 text-accent";
};

// Mapeo de CvType a icono y label
const cvTypeIcons: Record<CvType, { icon: React.ReactNode; label: string; color: string }> = {
  [CvType.TECHNOLOGY_ENGINEERING]: {
    icon: <Code className="w-4 h-4"/>,
    label: "Tecnología e Ingeniería",
    color: "text-blue-500",
  },
  [CvType.DESIGN_CREATIVITY]: {
    icon: <Palette className="w-4 h-4"/>,
    label: "Diseño y Creatividad",
    color: "text-purple-500",
  },
  [CvType.MARKETING_STRATEGY]: {
    icon: <TrendingUpIcon className="w-4 h-4"/>,
    label: "Marketing y Estrategia",
    color: "text-orange-500",
  },
  [CvType.MANAGEMENT_BUSINESS]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Gestión y Negocios",
    color: "text-green-500",
  },
  [CvType.FINANCE_PROJECTS]: {
    icon: <Target className="w-4 h-4"/>,
    label: "Finanzas y Proyectos",
    color: "text-red-500",
  },
  [CvType.SOCIAL_MEDIA]: {
    icon: <Users className="w-4 h-4"/>,
    label: "Redes Sociales y Contenido",
    color: "text-pink-500",
  },
  [CvType.EDUCATION]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Educación y Desarrollo",
    color: "text-cyan-500",
  },
  [CvType.SCIENCE]: {
    icon: <Zap className="w-4 h-4"/>,
    label: "Ciencia e Innovación",
    color: "text-yellow-500",
  },
};

// Mapeo de OpportunityType a icono y label
const opportunityTypeIcons: Record<OpportunityType, {
  icon: React.ReactNode;
  label: string;
  color: string
}> = {
  [OpportunityType.EMPLOYMENT]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Empleo",
    color: "text-blue-500",
  },
  [OpportunityType.INTERNSHIP]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Pasantía",
    color: "text-green-500",
  },
  [OpportunityType.SCHOLARSHIP]: {
    icon: <Zap className="w-4 h-4"/>,
    label: "Beca",
    color: "text-yellow-500",
  },
  [OpportunityType.EXCHANGE_PROGRAM]: {
    icon: <Users className="w-4 h-4"/>,
    label: "Intercambio",
    color: "text-purple-500",
  },
  [OpportunityType.RESEARCH_FELLOWSHIP]: {
    icon: <Code className="w-4 h-4"/>,
    label: "Investigación",
    color: "text-indigo-500",
  },
  [OpportunityType.GRADUATE_PROGRAM]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Posgrado",
    color: "text-cyan-500",
  },
  [OpportunityType.FREELANCE]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Freelance",
    color: "text-orange-500",
  },
  [OpportunityType.FULL_TIME]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Tiempo Completo",
    color: "text-blue-600",
  },
  [OpportunityType.PART_TIME]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Tiempo Parcial",
    color: "text-blue-400",
  },
};


export function ScoresListPage({cvs, disabledButton}: ScoresListPageProps) {
  const [showCVModal, setShowCVModal] = useState(false);
  const [selectedCVId, setSelectedCVId] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const router = useRouter();

  // Filtrar solo CVs con análisis para la lista principal
  const scoresWithAnalysis = cvs.filter(cv => cv.evaluations && cv.evaluations.length > 0);

  const handleSelectCV = async () => {
    if (!selectedCVId) return;
    setShowCVModal(false);

    // Iniciar el análisis (sea nuevo o re-análisis)
    setIsAnalyzing(true);
    try {
      const response = await fetch("/api/cv/analysis", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cvId: selectedCVId}),
      });

      if (response.ok) {
        // Navegar a la página de progreso del análisis
        router.push(`/process/${selectedCVId}`);
      } else {
        const error = await response.json();
        console.error("Error starting analysis:", error);
        alert(error.message || "Error al iniciar el análisis del CV");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al iniciar el análisis del CV");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleUploadCV = () => {
    if (disabledButton) return;
    router.push("/cv/upload");
  };

  return (
    <div className="p-6 h-full flex flex-col items-center justify-center">
      <div className="max-w-6xl w-full mx-auto">
        <motion.div
          initial={{opacity: 0, y: 20}}
          animate={{opacity: 1, y: 0}}
          transition={{duration: 0.6}}
        >
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-levely-blue dark:text-levely-green text-3xl font-bold">
                Scores de CVs
              </h1>
              <p className="text-muted-foreground mt-2">
                Analiza el rendimiento y mejora tus currículums
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                className="bg-levely-blue text-white dark:bg-levely-green dark:text-levely-dark w-full sm:w-auto"
                disabled={disabledButton || cvs.length === 0}
                onClick={() => setShowCVModal(true)}
              >
                <Plus className="w-4 h-4 mr-2"/>
                <span>Seleccionar CV</span>
              </Button>

              <Button
                className="bg-levely-blue text-white dark:bg-levely-green dark:text-levely-dark w-full sm:w-auto"
                disabled={disabledButton}
                onClick={handleUploadCV}
              >
                <Plus className="w-4 h-4 mr-2"/>
                <span>Subir CV</span>
              </Button>
            </div>
          </div>

          {/* Scores List */}
          <div className="space-y-6">
            {scoresWithAnalysis.map((score, index) => (
              <motion.div
                key={score.id}
                initial={{opacity: 0, y: 20}}
                animate={{opacity: 1, y: 0}}
                transition={{duration: 0.4, delay: index * 0.1}}
              >
                <Card
                  className="bg-background/90 backdrop-blur-sm border-0 shadow-lg overflow-hidden">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                        <div className="space-y-1">
                          <CardTitle
                            className="text-xl sm:text-2xl text-foreground flex items-center gap-3">
                            {score.title || "CV Analizado"}
                            {/* trend logic could be added here if needed, keeping it simple as per original */}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {score.evaluations[0]?.createdAt
                              ? `Analizado el ${formatDate(score.evaluations[0].createdAt, "dd/MM/yyyy")}`
                              : "Sin análisis todavía"}
                          </CardDescription>
                        </div>

                        <div className="pt-2 sm:pt-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-fit cursor-pointer text-levely-blue dark:text-levely-green hover:text-levely-blue/70 dark:hover:text-levely-green/70 border-2 border-levely-blue/40 dark:border-levely-green/40 hover:border-levely-blue/40 dark:hover:border-levely-green/40 transition-colors duration-200 font-semibold"
                            onClick={() => router.push(`/evaluations/${score.evaluations[0]?.id}`)}
                          >
                            Ver detalles
                          </Button>
                        </div>
                      </div>

                      <div
                        className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1 bg-muted/30 sm:bg-transparent p-3 sm:p-0 rounded-lg sm:rounded-none">
                        {score.evaluations && score.evaluations.length > 0 ? (
                          <>
                            <div
                              className={`text-4xl sm:text-3xl font-bold ${getScoreTextColor(score.evaluations[0]?.overallScore || 0)}`}
                            >
                              {score.evaluations[0]?.overallScore || 0}%
                            </div>
                            <Badge
                              className={`${getScoreBadgeColor(score.evaluations[0]?.overallScore || 0)} font-bold`}
                            >
                              {score.evaluations[0]?.overallScore >= 80
                                ? "Excelente"
                                : score.evaluations[0]?.overallScore >= 60
                                  ? "Bueno"
                                  : "Necesita Mejora"}
                            </Badge>
                          </>
                        ) : (
                          <div className="text-center">
                            <div className="text-lg font-semibold text-muted-foreground mb-1">
                              Sin análisis previo
                            </div>
                            <p className="text-sm text-muted-foreground/70">Aun no fue analizado</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 sm:p-6 pt-2 sm:pt-2">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Categories Scores */}
                      <div>
                        <h4
                          className="font-semibold text-levely-blue dark:text-levely-green mb-4 flex items-center gap-2">
                          <BarChart3 className="w-4 h-4 text-levely-blue dark:text-levely-green"/>
                          Puntuación por Categorías
                        </h4>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                          {score.evaluations[0]?.scores.map((section) => (
                            <div key={section.id} className="group">
                              <div className="flex justify-between text-sm mb-1.5">
                                <span
                                  className="text-foreground/80 font-medium group-hover:text-primary transition-colors">
                                  {categoryMap[section.sectionType as keyof typeof categoryMap] ||
                                    section.sectionType}
                                </span>
                                <span
                                  className={`font-semibold ${getScoreTextColor(section.score)}`}
                                >
                                  {section.score}%
                                </span>
                              </div>

                              <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${section.score}%`,
                                    background: "linear-gradient(90deg, #3b82f6 0%, #22c55e 100%)",
                                  }}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Recommendations */}
                      <div className="bg-muted/20 p-4 rounded-xl border border-border/50">
                        <h4
                          className="font-semibold text-levely-blue dark:text-levely-green mb-4 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-levely-blue dark:text-levely-green"/>
                          Recomendaciones de Mejora
                        </h4>
                        <ul className="space-y-3">
                          {score.evaluations[0]?.recommendations.slice(0, 3).map((rec, idx) => (
                            <li key={idx} className="flex items-start gap-3 text-sm text-balance">
                              <div
                                className="w-1.5 h-1.5 bg-primary/80 rounded-full mt-2 flex-shrink-0"/>
                              <span className="text-muted-foreground leading-relaxed">
                                {rec.text}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {scoresWithAnalysis.length === 0 && (
            <motion.div
              initial={{opacity: 0}}
              animate={{opacity: 1}}
              className="text-center py-12"
            >
              <BarChart3 className="w-16 h-16 text-muted mx-auto mb-4"/>
              <h3 className="text-xl font-semibold text-muted mb-2">No hay scores disponibles</h3>
              <p className="text-muted/80">Crea y analiza tus CVs para ver los scores aquí</p>
            </motion.div>
          )}

          {/* CV Selection Modal */}
          {showCVModal && (
            <div
              className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
              <motion.div
                initial={{opacity: 0, scale: 0.95, y: 20}}
                animate={{opacity: 1, scale: 1, y: 0}}
                exit={{opacity: 0, scale: 0.95, y: 20}}
                transition={{duration: 0.3}}
                className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col border border-border"
              >
                {/* Modal Header */}
                <div
                  className="sticky top-0 flex items-center justify-between p-6 border-b bg-gradient-to-r from-background to-background/95">
                  <div>
                    <h2 className="text-2xl font-bold text-foreground">
                      Selecciona un CV
                    </h2>

                    <p className="text-sm text-muted-foreground mt-1">
                      Elige el CV que deseas analizar
                    </p>

                    <p className="text-sm text-muted-foreground mt-1">
                      <span className="inline-flex items-center gap-1">
                        *Esto consumirá un crédito de{" "}
                        <span className="font-bold">Acciones IA</span>
                        <Sparkles className="w-4 h-4"/>
                      </span>
                    </p>
                  </div>
                </div>


                {/* CVs List */}
                <div className="flex-1 overflow-y-auto p-6">
                  {cvs.length === 0 ? (
                    <div className="text-center py-8">
                      <BarChart3 className="w-12 h-12 text-muted mx-auto mb-3 opacity-50"/>
                      <p className="text-muted-foreground">No hay CVs disponibles</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cvs.map((cv) => {
                        const isSelected = selectedCVId === cv.id;
                        const hasAnalysis = cv.evaluations && cv.evaluations.length > 0;
                        const score = cv.evaluations?.[0]?.overallScore || 0;

                        return (
                          <motion.button
                            key={cv.id}
                            whileHover={{scale: 1.01}}
                            whileTap={{scale: 0.99}}
                            onClick={() => setSelectedCVId(cv.id)}
                            className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group ${
                              isSelected
                                ? "border-levely-blue dark:border-levely-green bg-levely-blue/5 dark:bg-levely-green/5 shadow-md"
                                : "border-border hover:border-levely-blue/50 dark:hover:border-levely-green/50 hover:bg-muted/30"
                            }`}
                          >
                            <div className="flex items-start justify-between gap-4">
                              {/* CV Info */}
                              <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-3">
                                  <div
                                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                      isSelected
                                        ? "border-levely-blue dark:border-levely-green bg-levely-blue dark:bg-levely-green"
                                        : "border-muted-foreground"
                                    }`}
                                  >
                                    {isSelected && (
                                      <div className="w-2 h-2 bg-white rounded-full"/>
                                    )}
                                  </div>
                                  <h3
                                    className="font-bold text-foreground text-lg group-hover:text-levely-blue dark:group-hover:text-levely-green transition-colors">
                                    {cv.title || "CV Sin título"}
                                  </h3>
                                </div>

                                {/* Tipo de oportunidad e Información */}
                                <div className="ml-8 space-y-2">
                                  <p className="text-sm text-muted-foreground">
                                    {cv.evaluations && cv.evaluations.length > 0
                                      ? `Análisis previo: ${formatDate(cv.evaluations[0].createdAt, "dd/MM/yyyy")}`
                                      : "Sin análisis previo"}
                                  </p>

                                  {/* Iconos de Tipo de Oportunidad y Perfil Profesional */}
                                  <div className="flex flex-wrap gap-4">
                                    {cv.opportunityType && (
                                      <div className="flex items-center gap-2">
                                        <span
                                          className={opportunityTypeIcons[cv.opportunityType].color}>
                                          {opportunityTypeIcons[cv.opportunityType].icon}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                          {opportunityTypeIcons[cv.opportunityType].label}
                                        </span>
                                      </div>
                                    )}

                                    {cv.cvType && (
                                      <div className="flex items-center gap-2">
                                        <span className={cvTypeIcons[cv.cvType].color}>
                                          {cvTypeIcons[cv.cvType].icon}
                                        </span>
                                        <span className="text-xs font-medium text-muted-foreground">
                                          {cvTypeIcons[cv.cvType].label}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              </div>

                              {/* Score Badge */}
                              {hasAnalysis && (
                                <div className="flex flex-col items-end gap-1">
                                  <div className={`text-3xl font-bold ${getScoreTextColor(score)}`}>
                                    {score}%
                                  </div>
                                  <Badge
                                    className={`${getScoreBadgeColor(score)} font-semibold text-xs`}
                                  >
                                    {score >= 80 ? "Excelente" : score >= 60 ? "Bueno" : "Necesita Mejora"}
                                  </Badge>
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Modal Footer - Buttons */}
                <div className="sticky bottom-0 flex gap-3 p-6 border-t bg-background justify-end">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setShowCVModal(false);
                      setSelectedCVId(null);
                    }}
                    className="border-2 hover:bg-muted"
                  >
                    <X className="w-4 h-4 mr-2"/>
                    <span>CERRAR</span>
                  </Button>

                  <Button
                    onClick={handleSelectCV}
                    disabled={!selectedCVId || isAnalyzing}
                    className="bg-levely-blue text-white dark:bg-levely-green dark:text-levely-dark disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90 transition-opacity font-semibold"
                  >
                    {isAnalyzing ? (
                      <>
                        <div
                          className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                        <span>ANALIZANDO...</span>
                      </>
                    ) : (
                      <>
                        <BarChart3 className="w-4 h-4 mr-2"/>
                        <span>ANALIZAR</span>
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
