"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/page-header";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { routes } from "@/lib/routes";
import { AdminCvEvaluationPromptDetail } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompt-by-id";
import { deleteAdminCvEvaluationPrompt } from "@/features/cv/actions/admin/delete-admin-cv-evaluation-prompt";

interface AdminCvEvaluationPromptDetailScreenProps {
  prompt: AdminCvEvaluationPromptDetail;
}

export function AdminCvEvaluationPromptDetailScreen({ prompt }: AdminCvEvaluationPromptDetailScreenProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminCvEvaluationPrompt(prompt.id);
    if (result.success) {
      toast.success(result.message);
      setShowDeleteDialog(false);
      router.push(routes.app.admin.cvEvaluationPrompts.root);
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando prompt";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-4xl">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.root)}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver a Prompts
          </Button>

          <PageHeader
            title={prompt.beca}
            description={`Prompt creado el ${formatDate(prompt.createdAt, "d MMM, yyyy HH:mm")}`}
            actions={
              <div className="flex items-center gap-2">
                <Button
                  variant="accent"
                  onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.edit(prompt.id))}
                  className="rounded-lg font-bold text-xs h-9 shadow-sm"
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => setShowDeleteDialog(true)}
                  className="rounded-lg font-bold text-xs h-9"
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Eliminar
                </Button>
              </div>
            }
          />

          <Card className="rounded-2xl border border-border/60 p-6 space-y-4">
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Beca</div>
              <div className="text-sm font-semibold text-foreground mt-1">{prompt.beca}</div>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Prompt</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-4 text-xs text-foreground">
                {prompt.prompt}
              </pre>
            </div>
            <div>
              <div className="text-xs font-semibold text-muted-foreground">Metadata</div>
              <pre className="mt-2 whitespace-pre-wrap rounded-lg border border-border/60 bg-muted/20 p-4 text-xs text-foreground">
                {prompt.metadata ? JSON.stringify(prompt.metadata, null, 2) : "Sin metadata"}
              </pre>
            </div>
          </Card>

          <Card className="rounded-2xl border border-border/60 p-6">
            <div className="text-xs text-muted-foreground">ID</div>
            <div className="mt-1 font-mono text-xs text-foreground">{prompt.id}</div>
          </Card>
        </motion.div>
      </div>

      <ConfirmModal
        isOpen={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar prompt"
        description={
          <>
            Se eliminara permanentemente el prompt de <strong>{prompt.beca}</strong>.
          </>
        }
      />
    </main>
  );
}

