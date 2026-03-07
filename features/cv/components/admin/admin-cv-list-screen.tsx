"use client";

import { useState, useTransition } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FileText, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { LoadMoreButton } from "@/components/shared/load-more-button";
import { PageHeader } from "@/components/shared/page-header";
import { AdminCvCard } from "@/features/cv/components/admin/admin-cv-card";
import { AdminCreateCvModal } from "@/features/cv/components/admin/admin-create-cv-modal";
import { AdminCvWithRelations, getAdminCvs } from "@/features/cv/actions/admin/get-admin-cvs";

interface AdminCvListScreenProps {
  initialCvs: AdminCvWithRelations[];
  hasMoreProp?: boolean;
  totalCount?: number;
}

export function AdminCvListScreen({
  initialCvs,
  hasMoreProp = false,
  totalCount = 0,
}: AdminCvListScreenProps) {
  const [cvs, setCvs] = useState<AdminCvWithRelations[]>(initialCvs);
  const [hasMore, setHasMore] = useState(hasMoreProp);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleLoadMore = () => {
    startTransition(async () => {
      const result = await getAdminCvs(cvs.length, 10);
      if (result.success) {
        setCvs((prev) => [...prev, ...result.data.cvs]);
        setHasMore(result.data.hasMore);
      } else {
        toast.error(result.error || "Error cargando mas CVs");
      }
    });
  };

  return (
    <main className="min-h-[90-vh] p-4 md:p-8">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <PageHeader
            title="Administracion de CVs"
            description="Gestiona los CVs de todos los usuarios."
            actions={
              <Button
                variant="accent"
                onClick={() => setIsCreateOpen(true)}
                className="rounded-lg font-bold text-xs h-9 shadow-sm"
              >
                <Plus className="mr-2 h-4 w-4" />
                Crear CV
              </Button>
            }
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
                      <AdminCvCard cv={cv} />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              <LoadMoreButton
                handleLoadMore={handleLoadMore}
                hasMore={hasMore}
                isPending={isPending}
                currentCount={cvs.length}
                totalCount={totalCount}
                label="Mostrar mas CVs"
              />
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-border/60 bg-secondary/10 dark:bg-secondary/5">
              <EmptyPlaceholder
                icon={FileText}
                title="No hay CVs disponibles"
                description="Crea el primer CV para un usuario."
                action={
                  <Button
                    variant="default"
                    onClick={() => setIsCreateOpen(true)}
                    className="rounded-lg font-bold shadow-sm"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Crear CV
                  </Button>
                }
              />
            </div>
          )}
        </motion.div>
      </div>

      <AdminCreateCvModal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreated={(cvId) => {
          setIsCreateOpen(false);
          router.push(`/admin/cv/${cvId}/edit`);
        }}
      />
    </main>
  );
}
