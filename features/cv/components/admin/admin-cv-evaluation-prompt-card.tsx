"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {Copy, Edit, Eye, Trash2} from "lucide-react";
import { toast } from "sonner";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmModal } from "@/components/shared/confirm-modal";
import { formatDate } from "@/utils/format-date";
import { routes } from "@/lib/routes";
import { AdminCvEvaluationPromptItem } from "@/features/cv/actions/admin/get-admin-cv-evaluation-prompts";
import { deleteAdminCvEvaluationPrompt } from "@/features/cv/actions/admin/delete-admin-cv-evaluation-prompt";

interface AdminCvEvaluationPromptCardProps {
  prompt: AdminCvEvaluationPromptItem;
}

const truncateText = (text: string, max = 220) => {
  if (text.length <= max) return text;
  return `${text.slice(0, max)}…`;
};

export function AdminCvEvaluationPromptCard({ prompt }: AdminCvEvaluationPromptCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    setIsDeleting(true);
    const result = await deleteAdminCvEvaluationPrompt(prompt.id);
    if (result.success) {
      toast.success(result.message);
      setShowDelete(false);
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error eliminando prompt";
      toast.error(errorMsg);
    }
    setIsDeleting(false);
  };

  const copyOnboardingLink = async (becaSlug: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_URL || "https://joinlevely.com";
    const link = `${baseUrl}/onboarding/talents?beca=${becaSlug}`;

    try {
      await navigator.clipboard.writeText(link);
      toast.success("Enlace de onboarding copiado", {
        description: `Beca: ${becaSlug}`,
      });
    } catch (err) {
      toast.error("No se pudo copiar el enlace");
    }
  };

  return (
    <>
      <Card className="rounded-2xl border border-border/60 p-5 space-y-4">
        <div>
          <div className="text-sm font-semibold text-foreground">{prompt.beca}</div>
          <div className="text-xs text-muted-foreground mt-1">{truncateText(prompt.prompt)}</div>
        </div>

        <div className="text-[11px] text-muted-foreground">Creado: {formatDate(prompt.createdAt, "d MMM, yyyy")}</div>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => copyOnboardingLink(prompt.beca)}
          >
            <Copy className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="h-8 text-xs"
            onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.detail(prompt.id))}
          >
            <Eye className="mr-2 h-3.5 w-3.5" />
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => router.push(routes.app.admin.cvEvaluationPrompts.edit(prompt.id))}
          >
            <Edit className="mr-2 h-3.5 w-3.5" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            className="h-8 text-xs"
            onClick={() => setShowDelete(true)}
          >
            <Trash2 className="mr-2 h-3.5 w-3.5" />
            Eliminar
          </Button>
        </div>
      </Card>

      <ConfirmModal
        isOpen={showDelete}
        onOpenChange={setShowDelete}
        onConfirm={handleDelete}
        loading={isDeleting}
        title="Eliminar prompt"
        description={
          <>
            Se eliminara permanentemente el prompt de <strong>{prompt.beca}</strong>.
          </>
        }
      />
    </>
  );
}

