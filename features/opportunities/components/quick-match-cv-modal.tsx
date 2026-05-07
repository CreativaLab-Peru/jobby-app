"use client";

import {motion, AnimatePresence} from "framer-motion";
import * as React from "react";
import {
  X,
  BarChart3,
  Code,
  Palette,
  TrendingUpIcon,
  Briefcase,
  Target,
  Users,
  BookOpen,
  Zap,
  AlertCircle,
  Rocket
} from "lucide-react";
import {Button} from "@/components/ui/button";
import {formatDate} from "@/utils/format-date";
import {useQuickMatchModalStore} from "../hooks/use-quick-match-modal-store";
import {CvType, OpportunityType} from "@prisma/client";
import {CvWithRelations} from "@/features/cv/actions/get-cv-for-current-user";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {useCreditsStore} from "@/store/use-credits-store";
import {QuickMatchLoading} from "./quick-match-loading";

interface CreditLimits {
  manageCvsLimit: number;
  aiActionsLimit: number;
  opportunitiesActionsLimit: number;
}

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
  [CvType.SCIENCE]: {
    icon: <Zap className="w-4 h-4"/>,
    label: "Ciencia",
    color: "text-yellow-500"
  },
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
  [OpportunityType.STARTUP]: {
    icon: <Users className="w-4 h-4"/>,
    label: "Aceleradora",
    color: "text-pink-500"
  },
};

interface QuickMatchCvModalProps {
  cvs: CvWithRelations[];
  credits: CreditLimits;
}

export function QuickMatchCvModal({
                                    cvs,
                                    credits
                                  }: QuickMatchCvModalProps) {
  const {
    isOpen,
    onClose,
    selectedCvId,
    setSelectedCvId,
    isMatching,
    setIsMatching
  } = useQuickMatchModalStore();
  const {refreshCredits} = useCreditsStore();
  const router = useRouter();

  const hasCredits = credits.opportunitiesActionsLimit > 0;

  const handleMatch = async () => {
    if (!selectedCvId) return;

    if (!hasCredits) {
      toast.error("No tienes créditos disponibles para hacer match de oportunidades");
      return;
    }

    setIsMatching(true);

    try {
      const response = await fetch("/api/opportunities/quick-match", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({cvId: selectedCvId}),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        if (response.status === 409) {
          toast.info(data?.message || "El match ya está en proceso para esta ruta.");
          onClose();
          router.push("/my-opportunities?match=processing");
          return;
        }

        toast.error(data?.message || "Error al iniciar el match de oportunidades");
        return;
      }

      // Refresh credits after match
      await refreshCredits();

      toast.success("¡Match procesando!");
      router.push(`/opportunities/cv/${selectedCvId}/analysis`);
      onClose();
    } catch (error) {
      console.error("Error al hacer match:", error);
      toast.error("Error al iniciar el match de oportunidades");
    } finally {
      setIsMatching(false);
    }
  };

  return (
    <>
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
                    <h2 className="text-2xl font-bold text-foreground tracking-tight">
                      Selecciona un CV
                    </h2>
                    <p className="text-sm text-muted-foreground mt-1">
                      Elige el CV para hacer match con oportunidades
                    </p>

                    {/* Credits Info */}
                    <div className="mt-4 p-3 rounded-lg bg-muted/40 border border-border">
                      <div className="flex items-center gap-2 mb-2">
                        <Zap className="w-4 h-4 text-primary"/>
                        <span className="text-xs font-bold uppercase text-foreground">
                          Créditos de Match
                        </span>
                      </div>
                      {hasCredits ? (
                        <div className="space-y-1.5">
                          <p className="text-sm text-muted-foreground">
                            Tienes <span
                            className="font-bold text-foreground">{credits.opportunitiesActionsLimit}</span> crédito(s)
                            disponibles
                          </p>
                          <p className="text-xs text-muted-foreground italic">
                            Se deducirá 1 crédito solo si se encuentran oportunidades válidas
                          </p>
                        </div>
                      ) : (
                        <div className="flex items-start gap-2">
                          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5"/>
                          <p className="text-xs text-destructive font-medium">
                            No tienes créditos de match disponibles. Compra créditos para continuar.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="rounded-full"
                  >
                    <X className="w-5 h-5"/>
                  </Button>
                </div>
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto p-6 space-y-3">
                {cvs.length === 0 ? (
                  <div className="text-center py-12">
                    <BarChart3 className="w-12 h-12 text-muted mx-auto mb-3 opacity-20"/>
                    <p className="text-muted-foreground font-medium italic">
                      No hay CVs disponibles
                    </p>
                  </div>
                ) : (
                  cvs.map((cv) => {
                    const isSelected = selectedCvId === cv.id;

                    return (
                      <motion.button
                        key={cv.id}
                        whileHover={{scale: 1.01}}
                        whileTap={{scale: 0.99}}
                        onClick={() => setSelectedCvId(cv.id)}
                        disabled={!hasCredits}
                        className={`w-full text-left p-5 rounded-xl border-2 transition-all group disabled:opacity-50 disabled:cursor-not-allowed ${
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
                                  isSelected
                                    ? "border-primary bg-primary"
                                    : "border-muted-foreground"
                                }`}
                              >
                                {isSelected && (
                                  <div className="w-1.5 h-1.5 bg-white rounded-full"/>
                                )}
                              </div>
                              <h3
                                className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
                                {cv.title || "CV Sin título"}
                              </h3>
                            </div>

                            <div className="ml-8 space-y-2">
                              <p className="text-xs text-muted-foreground font-medium">
                                Creado: {formatDate(cv.createdAt, "dd/MM/yyyy")}
                              </p>

                              <div className="flex flex-wrap gap-3">
                                {cv.opportunityType && (
                                  <div className="flex items-center gap-1.5">
                                    <span
                                      className={opportunityTypeIcons[cv.opportunityType].color}
                                    >
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
                        </div>
                      </motion.button>
                    );
                  })
                )}
              </div>

              {/* Footer */}
              <div className="p-6 border-t bg-muted/20 flex gap-3 justify-end">
                <Button
                  variant="outline"
                  onClick={onClose}
                  className="font-bold tracking-widest text-xs uppercase h-11 px-6"
                >
                  Cerrar
                </Button>
                <Button
                  onClick={handleMatch}
                  disabled={!selectedCvId || isMatching || !hasCredits}
                  className="bg-primary text-primary-foreground font-black tracking-widest text-xs uppercase h-11 px-8 shadow-lg shadow-primary/20"
                >
                  {isMatching ? (
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"/>
                      <span>Recuperando info...</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Rocket className="w-4 h-4"/>
                      <span>Hacer Match</span>
                    </div>
                  )}
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
