"use client";

import {motion, AnimatePresence} from "framer-motion";
import {
  Sparkles,
  X,
  BarChart3,
  Code,
  Palette,
  TrendingUpIcon,
  Briefcase,
  Target,
  Users,
  BookOpen,
  Zap
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Badge} from "@/components/ui/badge";
import {formatDate} from "@/utils/format-date";
import {useEvaluationModalStore} from "../hooks/use-evaluation-modal-store";
import {CvType, OpportunityType} from "@prisma/client";

// Mapeos extraídos de tu contexto
const cvTypeIcons: Record<CvType, { icon: React.ReactNode; label: string; color: string }> = {
  [CvType.TECHNOLOGY_ENGINEERING]: {
    icon: <Code className="w-4 h-4"/>,
    label: "Tecnología e Ingeniería",
    color: "text-blue-500"
  },
  [CvType.DESIGN_CREATIVITY]: {
    icon: <Palette className="w-4 h-4"/>,
    label: "Diseño y Creatividad",
    color: "text-purple-500"
  },
  [CvType.MARKETING_STRATEGY]: {
    icon: <TrendingUpIcon className="w-4 h-4"/>,
    label: "Marketing y Estrategia",
    color: "text-orange-500"
  },
  [CvType.MANAGEMENT_BUSINESS]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Gestión y Negocios",
    color: "text-green-500"
  },
  [CvType.FINANCE_PROJECTS]: {
    icon: <Target className="w-4 h-4"/>,
    label: "Finanzas y Proyectos",
    color: "text-red-500"
  },
  [CvType.SOCIAL_MEDIA]: {
    icon: <Users className="w-4 h-4"/>,
    label: "Redes Sociales",
    color: "text-pink-500"
  },
  [CvType.EDUCATION]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Educación",
    color: "text-cyan-500"
  },
  [CvType.SCIENCE]: {icon: <Zap className="w-4 h-4"/>, label: "Ciencia", color: "text-yellow-500"},
};

const opportunityTypeIcons: Record<OpportunityType, {
  icon: React.ReactNode;
  label: string;
  color: string
}> = {
  [OpportunityType.EMPLOYMENT]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Empleo",
    color: "text-blue-500"
  },
  [OpportunityType.INTERNSHIP]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Pasantía",
    color: "text-green-500"
  },
  [OpportunityType.SCHOLARSHIP]: {
    icon: <Zap className="w-4 h-4"/>,
    label: "Beca",
    color: "text-yellow-500"
  },
  [OpportunityType.EXCHANGE_PROGRAM]: {
    icon: <Users className="w-4 h-4"/>,
    label: "Intercambio",
    color: "text-purple-500"
  },
  [OpportunityType.RESEARCH_FELLOWSHIP]: {
    icon: <Code className="w-4 h-4"/>,
    label: "Investigación",
    color: "text-indigo-500"
  },
  [OpportunityType.GRADUATE_PROGRAM]: {
    icon: <BookOpen className="w-4 h-4"/>,
    label: "Posgrado",
    color: "text-cyan-500"
  },
  [OpportunityType.FREELANCE]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Freelance",
    color: "text-orange-500"
  },
  [OpportunityType.FULL_TIME]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Tiempo Completo",
    color: "text-blue-600"
  },
  [OpportunityType.PART_TIME]: {
    icon: <Briefcase className="w-4 h-4"/>,
    label: "Tiempo Parcial",
    color: "text-blue-400"
  },
};

const getScoreTextColor = (score: number) => {
  if (score >= 80) return "text-primary";
  if (score >= 60) return "text-primary/50";
  return "text-accent";
};

const getScoreBadgeColor = (score: number) => {
  if (score >= 80) return "bg-primary/20 text-primary";
  if (score >= 60) return "bg-primary/20 text-primary/50";
  return "bg-accent/20 text-accent";
};

interface SelectCvModalProps {
  cvs: any[];
  onConfirm: (cvId: string) => Promise<void>;
}

export function SelectCvModal({
                                cvs,
                                onConfirm
                              }: SelectCvModalProps) {
  const {isOpen, onClose, selectedCvId, setSelectedCvId, isAnalyzing} = useEvaluationModalStore();

  const handleConfirm = async () => {
    if (!selectedCvId) return;
    await onConfirm(selectedCvId);
  };
  console.log("CVs en modal:", cvs);

  return (
    <AnimatePresence>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <motion.div
            initial={{opacity: 0, scale: 0.95, y: 20}}
            animate={{opacity: 1, scale: 1, y: 0}}
            exit={{opacity: 0, scale: 0.95, y: 20}}
            className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-hidden flex flex-col border border-border"
          >
            {/* Header */}
            <div className="sticky top-0 p-6 border-b bg-background z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-2xl font-bold text-foreground tracking-tight">Selecciona un
                    CV</h2>
                  <p className="text-sm text-muted-foreground mt-1">Elige el CV que deseas
                    analizar</p>
                  <div
                    className="flex items-center gap-1.5 mt-2 text-xs font-medium text-muted-foreground">
                    <Sparkles className="w-3.5 h-3.5 text-primary"/>
                    <span>Esto consumirá un crédito de <span
                      className="font-bold text-foreground uppercase tracking-wider">Acciones IA</span></span>
                  </div>
                </div>
                <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full">
                  <X className="w-5 h-5"/>
                </Button>
              </div>
            </div>

            {/* List */}
            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {cvs.length === 0 ? (
                <div className="text-center py-12">
                  <BarChart3 className="w-12 h-12 text-muted mx-auto mb-3 opacity-20"/>
                  <p className="text-muted-foreground font-medium italic">No hay CVs disponibles</p>
                </div>
              ) : (
                cvs.map((cv) => {
                  const isSelected = selectedCvId === cv.id;
                  const analysis = cv.evaluations?.[0];
                  const score = analysis?.overallScore || 0;

                  return (
                    <motion.button
                      key={cv.id}
                      whileHover={{scale: 1.01}}
                      whileTap={{scale: 0.99}}
                      onClick={() => setSelectedCvId(cv.id)}
                      className={`w-full text-left p-5 rounded-xl border-2 transition-all group ${
                        isSelected
                          ? "border-primary bg-primary/5 shadow-md"
                          : "border-border hover:border-primary/40 hover:bg-muted/30"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-3">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isSelected ? "border-primary bg-primary" : "border-muted-foreground"
                              }`}>
                              {isSelected && <div className="w-1.5 h-1.5 bg-white rounded-full"/>}
                            </div>
                            <h3
                              className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                              {cv.title || "CV Sin título"}
                            </h3>
                          </div>

                          <div className="ml-8 space-y-2">
                            <p className="text-xs text-muted-foreground font-medium">
                              {analysis
                                ? `Último análisis: ${formatDate(analysis.createdAt, "dd/MM/yyyy")}`
                                : "Pendiente de análisis"}
                            </p>

                            <div className="flex flex-wrap gap-3">
                              {cv.opportunityType && (
                                <div className="flex items-center gap-1.5">
                                  <span className={opportunityTypeIcons[cv.opportunityType].color}>
                                    {opportunityTypeIcons[cv.opportunityType].icon}
                                  </span>
                                  <span
                                    className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                    {opportunityTypeIcons[cv.opportunityType].label}
                                  </span>
                                </div>
                              )}
                              {cv.cvType && (
                                <div className="flex items-center gap-1.5">
                                  <span className={cvTypeIcons[cv.cvType].color}>
                                    {cvTypeIcons[cv.cvType].icon}
                                  </span>
                                  <span
                                    className="text-[10px] font-black uppercase tracking-tighter text-muted-foreground">
                                    {cvTypeIcons[cv.cvType].label}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>

                        {analysis && (
                          <div className="flex flex-col items-end gap-1">
                            <div className={`text-3xl font-black ${getScoreTextColor(score)}`}>
                              {score}%
                            </div>
                            <Badge
                              className={`${getScoreBadgeColor(score)} border-none text-[10px] font-bold uppercase`}>
                              {score >= 80 ? "Excelente" : score >= 60 ? "Bueno" : "Mejorable"}
                            </Badge>
                          </div>
                        )}
                      </div>
                    </motion.button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="p-6 border-t bg-muted/20 flex gap-3 justify-end">
              <Button variant="outline" onClick={onClose}
                      className="font-bold tracking-widest text-xs uppercase h-11 px-6">
                Cerrar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={!selectedCvId || isAnalyzing}
                className="bg-primary text-primary-foreground font-black tracking-widest text-xs uppercase h-11 px-8 shadow-lg shadow-primary/20"
              >
                {isAnalyzing ? (
                  <div className="flex items-center gap-2">
                    <div
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                    <span>Analizando...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <BarChart3 className="w-4 h-4"/>
                    <span>Iniciar Análisis</span>
                  </div>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
