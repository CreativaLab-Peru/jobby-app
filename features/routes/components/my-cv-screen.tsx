"use client";

import { motion } from "framer-motion";
import { FileText, Plus, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { CVCard } from "@/features/cv/components/cv-card";
import { CvWithRelations } from "@/features/routes/actions/get-cv-for-active-route";
import { useCvModalStore } from "@/features/cv/hooks/use-cv-modal-store";
import { CreateCVModal } from "@/features/cv/components/create-cv-modal";
import { UploadCVModal } from "@/features/cv/components/upload-cv-modal";

interface MyCvScreenProps {
  cv: CvWithRelations | null;
  canCreate: boolean;
  routeHasCv: boolean;
}

export default function MyCvScreen({ cv, canCreate, routeHasCv }: MyCvScreenProps) {
  const { onOpenCreate, onOpenUpload } = useCvModalStore();

  // const actions = (
  //   <>
  //     {!routeHasCv && (
  //       <>
  //         <Button
  //           variant="secondary"
  //           disabled={!canCreate}
  //           onClick={onOpenUpload}
  //           className="rounded-lg font-bold text-xs h-9 border border-border/40"
  //         >
  //           <Upload className="mr-2 h-3.5 w-3.5" />
  //           Subir CV
  //         </Button>
  //         <Button
  //           variant="accent"
  //           disabled={!canCreate}
  //           onClick={onOpenCreate}
  //           className="rounded-lg font-bold text-xs h-9 shadow-sm"
  //         >
  //           <Plus className="mr-2 h-4 w-4" />
  //           Crear CV
  //         </Button>
  //       </>
  //     )}
  //     <CreateCVModal />
  //     <UploadCVModal reset={() => { }} />
  //   </>
  // );

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Mi CV"
            description="El currículum vinculado a tu ruta activa."
          // actions={actions}
          />

          {cv ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                <CVCard cv={cv} />
              </motion.div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={FileText}
                title="Tu ruta aún no tiene un CV"
                description="Crea o sube un CV para comenzar tu ruta profesional. Se vinculará automáticamente."
              // action={
              //   <div className="flex items-center gap-3">
              //     <Button
              //       variant="outline"
              //       onClick={onOpenUpload}
              //       disabled={!canCreate}
              //       className="rounded-lg font-bold shadow-sm"
              //     >
              //       <Upload className="mr-2 h-4 w-4" />
              //       Subir CV
              //     </Button>
              //     <Button
              //       variant="default"
              //       onClick={onOpenCreate}
              //       disabled={!canCreate}
              //       className="rounded-lg font-bold shadow-sm"
              //     >
              //       <Plus className="mr-2 h-4 w-4" />
              //       Crear CV
              //     </Button>
              //   </div>
              // }
              />
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}

