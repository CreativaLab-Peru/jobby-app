"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import { toast } from "sonner";
import { JobStatus } from "@prisma/client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PageHeader } from "@/components/shared/page-header";
import { AdminEvaluationDetail } from "@/features/cv/actions/admin/get-admin-evaluation-by-id";
import { updateAdminEvaluation } from "@/features/cv/actions/admin/update-admin-evaluation";
import { routes } from "@/lib/routes";

const STATUS_OPTIONS: { value: JobStatus; label: string }[] = [
  { value: "PENDING", label: "Pendiente" },
  { value: "IN_PROGRESS", label: "En progreso" },
  { value: "SUCCEEDED", label: "Exitosa" },
  { value: "FAILED", label: "Fallida" },
  { value: "CANCELLED", label: "Cancelada" },
];

interface AdminEvaluationFormProps {
  evaluation: AdminEvaluationDetail;
}

export function AdminEvaluationForm({ evaluation }: AdminEvaluationFormProps) {
  const [status, setStatus] = useState<JobStatus>(evaluation.status as JobStatus);
  const [overallScore, setOverallScore] = useState<string>(
    evaluation.overallScore !== null && evaluation.overallScore !== undefined
      ? String(Math.round(evaluation.overallScore))
      : ""
  );
  const [summary, setSummary] = useState(evaluation.summary || "");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const cvTitle = evaluation.cv?.title || "CV Sin titulo";
  const user = evaluation.cv?.user;
  const userLabel = user ? `${user.name} (${user.email})` : "Sin usuario";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const scoreValue = overallScore.trim() === "" ? null : parseFloat(overallScore);
    if (scoreValue !== null && (isNaN(scoreValue) || scoreValue < 0 || scoreValue > 100)) {
      toast.error("El puntaje debe ser un numero entre 0 y 100");
      setIsLoading(false);
      return;
    }

    const result = await updateAdminEvaluation(evaluation.id, {
      status,
      overallScore: scoreValue,
      summary: summary.trim() || null,
    });

    if (result.success) {
      toast.success(result.message);
      router.push(routes.app.admin.evaluations.detail(evaluation.id));
      router.refresh();
    } else {
      const errorMsg = (result as { error: string }).error || "Error actualizando evaluacion";
      toast.error(errorMsg);
    }

    setIsLoading(false);
  };

  return (
    <main className="min-h-[90vh] p-4 md:p-8">
      <div className="mx-auto max-w-2xl">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          <Button
            variant="ghost"
            onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))}
            className="gap-2 text-muted-foreground hover:text-foreground -ml-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver al detalle
          </Button>

          <PageHeader
            title="Editar Evaluacion"
            description={`Editando evaluacion de "${cvTitle}" - ${userLabel}`}
          />

          {/* Info Card */}
          <Card className="rounded-2xl border border-border/60 p-4">
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span>CV: <span className="font-medium text-foreground">{cvTitle}</span></span>
              <span>Usuario: <span className="font-medium text-foreground">{userLabel}</span></span>
              <span>Secciones evaluadas: <span className="font-medium text-foreground">{evaluation.scores.length}</span></span>
              <span>Recomendaciones: <span className="font-medium text-foreground">{evaluation.recommendations.length}</span></span>
            </div>
          </Card>

          {/* Edit Form */}
          <Card className="rounded-2xl border border-border/60 p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-semibold">
                  Estado
                </Label>
                <Select
                  value={status}
                  onValueChange={(v) => setStatus(v as JobStatus)}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar estado" />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUS_OPTIONS.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="score" className="text-sm font-semibold">
                  Puntaje general (0-100)
                </Label>
                <Input
                  id="score"
                  type="number"
                  min={0}
                  max={100}
                  step={1}
                  value={overallScore}
                  onChange={(e) => setOverallScore(e.target.value)}
                  placeholder="Ej: 75"
                  disabled={isLoading}
                />
                <p className="text-xs text-muted-foreground">
                  Dejar vacio si la evaluacion no tiene puntaje.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="summary" className="text-sm font-semibold">
                  Resumen
                </Label>
                <Textarea
                  id="summary"
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Resumen de la evaluacion..."
                  rows={4}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center justify-end gap-3 border-t border-border/40 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(routes.app.admin.evaluations.detail(evaluation.id))}
                  disabled={isLoading}
                  className="rounded-lg font-bold"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="rounded-lg font-bold shadow-sm"
                >
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="mr-2 h-4 w-4" />
                  )}
                  Guardar cambios
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </main>
  );
}

