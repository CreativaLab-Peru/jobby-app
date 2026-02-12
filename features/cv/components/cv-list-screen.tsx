"use client";

import {AnimatePresence, motion} from "framer-motion";
import {ChevronDown, FileText, Loader2, Plus, Upload} from "lucide-react";
import { Button } from "@/components/ui/button";

import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { useCvModalStore } from "../hooks/use-cv-modal-store";
import {PageHeader} from "@/components/shared/page-header";
import {CreateCVModal} from "@/features/cv/components/create-cv-modal";
import {UploadCVModal} from "@/features/cv/components/upload-cv-modal";
import {CVCard} from "@/features/cv/components/cv-card";
import {CvWithRelations, getCvForCurrentUser} from "@/features/cv/actions/get-cv-for-current-user";
import {useState, useTransition} from "react";

interface CvListProps {
  initialCvs: CvWithRelations[];
  canCreate: boolean;
  hasMoreProp?: boolean;
  totalCount?: number;
}

export function CvListScreen({ initialCvs, canCreate, hasMoreProp = false, totalCount = 0 }: CvListProps) {
  const { onOpenCreate, onOpenUpload } = useCvModalStore();

  const [cvs, setCvs] = useState<CvWithRelations[]>(initialCvs);
  const [hasMore, setHasMore] = useState(hasMoreProp); // Asumiendo batch inicial de 10
  const [isPending, startTransition] = useTransition();

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getCvForCurrentUser(cvs.length, 10);
      if (result) {
        setCvs((prev) => [...prev, ...result.cvs]);
        setHasMore(result.hasMore);
      }
    });
  };

  const actions = (
    <>
      <Button
        variant="secondary" // Usamos el token secondary para acciones complementarias
        onClick={onOpenUpload}
        className="rounded-lg font-bold text-xs h-9 border border-border/40"
      >
        <Upload className="mr-2 h-3.5 w-3.5" />
        Subir CV
      </Button>

      <Button
        variant="accent" // Por defecto usa el color 'primary' del sistema
        disabled={!canCreate}
        onClick={onOpenCreate}
        className="rounded-lg font-bold text-xs h-9 shadow-sm"
      >
        <Plus className="mr-2 h-4 w-4" />
        Crear nuevo CV
      </Button>

      {/* Modales para crear y subir CV */}
      <CreateCVModal />
      <UploadCVModal />
    </>
  );

  return (
    <main className="min-h-screen p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Mis CVs"
            description="Gestiona y visualiza todos tus currículums optimizados."
            actions={actions}
          />

          {initialCvs.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                <AnimatePresence mode="popLayout">
                  {cvs.map((cv, index) => (
                    <motion.div
                      key={cv.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3, delay: (index % 10) * 0.05 }}
                    >
                      <CVCard cv={cv} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Botón "Load More" con ingeniería visual */}
              {hasMore && (
                <div className="flex justify-center mt-12 pb-12">
                  <Button
                    variant="secondary"
                    disabled={isPending}
                    onClick={handleLoadMore}
                    className="rounded-full px-8 h-12 font-bold border-border/40 bg-background hover:bg-secondary/50 transition-all shadow-sm"
                  >
                    {isPending ? (
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    ) : (
                      <ChevronDown className="h-5 w-5 mr-2" />
                    )}
                    {isPending ? "Cargando..." : "Mostrar más currículums"}
                    {totalCount > 0 && (
                      <span className="ml-2 text-sm text-accent">
                        ({cvs.length} de {totalCount})
                      </span>
                    )}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={FileText}
                title="No tienes CVs creados"
                description="Comienza creando tu primer currículum y deja que la IA optimice tu perfil profesional."
                action={
                  <Button
                    variant="default" // Usa el color primary
                    onClick={onOpenCreate}
                    disabled={!canCreate}
                    className="rounded-lg font-bold shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear mi primer CV
                  </Button>
                }
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
