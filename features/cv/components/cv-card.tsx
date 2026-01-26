"use client"

import { useState, useTransition } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { FileText, Eye, Edit, Trash2, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { formatDate } from "@/utils/format-date"
import { CvWithRelations } from "../actions/get-cv-for-current-user"
import { softDeleteCv } from "../actions/soft-delete-cv"
// TODO: Replace with another library or custom toast
// import { useToast } from "@/hooks/use-toast"
import { TitleAndForm } from "@/components/title-and-form"
import { updateCvTitle } from "@/features/cv/actions/update-title"

interface CVCardProps {
  cv: CvWithRelations
}

export function CVCard({ cv }: CVCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  // const { toast } = useToast()

  const handleEdit = () => router.push(`/cv/${cv.id}/edit`)
  const handleSeeDetail = () => router.push(`/cv/${cv.id}/preview`)

  const handleDelete = async () => {
    setIsDeleting(true)

    const result = await softDeleteCv(cv.id)

    if (result.success) {
      // toast({
      //   title: "CV ocultado",
      //   description:
      //     "El CV ha sido ocultado exitosamente. Ya no aparecerá en tu lista.",
      // })
      setShowDeleteDialog(false)
    } else {
      // toast({
      //   title: "Error",
      //   description: result.error || "No se pudo ocultar el CV",
      //   variant: "destructive",
      // })
    }

    setIsDeleting(false)
  }

  const handleChangeTitle = (newTitle: string) => {
    if (isPending) return

    startTransition(() => {
      updateCvTitle(cv.id, newTitle).then((result) => {
        if (result.success) {
          // toast({
          //   title: "Título actualizado",
          //   description:
          //     "El título del CV ha sido actualizado exitosamente.",
          // })
          router.refresh()
        } else {
          // toast({
          //   title: "Error",
          //   description:
          //     result.error || "No se pudo actualizar el título del CV",
          //   variant: "destructive",
          // })
        }
      })
    })
  }

  return (
    <Card className="group bg-gradient-to-br from-white via-blue-50 to-coral-50 dark:from-[#101624] dark:via-[#181b2a] dark:to-blue-950 border border-gray-100 dark:border-blue-900 shadow-xl hover:shadow-2xl transition-all duration-300 rounded-2xl">
      <CardHeader className="relative space-y-3">
        <div className="flex items-start justify-between">
          <FileText className="w-8 h-8 text-blue-500 dark:text-blue-300 transition-transform group-hover:scale-110 drop-shadow" />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10 dark:hover:text-red-400 dark:hover:bg-red-900/20"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <CardTitle className="text-lg font-black text-blue-700 dark:text-blue-200 group-hover:text-accent transition-colors">
          <TitleAndForm
            title={cv.title || "Sin título"}
            onSubmit={handleChangeTitle}
            isSubmitting={isPending}
          />
        </CardTitle>

        <CardDescription className="text-sm space-y-1">
          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-500 dark:text-blue-300">Tipo:</span>
            {cv?.cvType === "TECHNOLOGY_ENGINEERING" && (
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-bold">Tecnología e Ingeniería</span>
            )}
            {cv?.cvType === "DESIGN_CREATIVITY" && (
              <span className="px-2 py-0.5 rounded bg-pink-100 dark:bg-pink-900 text-pink-700 dark:text-pink-200 font-bold">Diseño y Creatividad</span>
            )}
            {cv?.cvType === "MARKETING_STRATEGY" && (
              <span className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-bold">Marketing y Estrategia</span>
            )}
            {cv?.cvType === "MANAGEMENT_BUSINESS" && (
              <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-bold">Gestión y Negocios</span>
            )}
            {cv?.cvType === "FINANCE_PROJECTS" && (
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold">Finanzas y Proyectos</span>
            )}
            {cv?.cvType === "SOCIAL_MEDIA" && (
              <span className="px-2 py-0.5 rounded bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-200 font-bold">Redes Sociales</span>
            )}
            {cv?.cvType === "EDUCATION" && (
              <span className="px-2 py-0.5 rounded bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-200 font-bold">Educación</span>
            )}
            {cv?.cvType === "SCIENCE" && (
              <span className="px-2 py-0.5 rounded bg-cyan-100 dark:bg-cyan-900 text-cyan-700 dark:text-cyan-200 font-bold">Ciencia</span>
            )}
            {!cv?.cvType && (
              <span className="italic text-muted-foreground dark:text-blue-300">No especificado</span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="font-bold text-blue-500 dark:text-blue-300">Estado:</span>
            {cv?.opportunityType === "INTERNSHIP" && (
              <span className="px-2 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 font-bold">Prácticas</span>
            )}
            {cv?.opportunityType === "SCHOLARSHIP" && (
              <span className="px-2 py-0.5 rounded bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-200 font-bold">Beca</span>
            )}
            {cv?.opportunityType === "EXCHANGE_PROGRAM" && (
              <span className="px-2 py-0.5 rounded bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-200 font-bold">Programa de intercambio</span>
            )}
            {cv?.opportunityType === "EMPLOYMENT" && (
              <span className="px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 font-bold">Empleo</span>
            )}
            {!cv?.opportunityType && (
              <span className="italic text-muted-foreground dark:text-blue-300">No especificado</span>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground dark:text-blue-200 space-y-1">
          <p>Creado: {formatDate(cv.createdAt, "dd/MM/yyyy")}</p>
          <p>Modificado: {formatDate(cv.updatedAt, "dd/MM/yyyy")}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 font-bold border-blue-300 dark:border-blue-700 text-blue-500 dark:text-blue-200 bg-blue-50 dark:bg-blue-900/40 shadow-glow hover:scale-105 transition-all"
            onClick={handleSeeDetail}
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1 font-bold border-accent text-accent bg-accent/10 dark:bg-accent/20 shadow-glow hover:scale-105 transition-all"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-1" />
            Editar
          </Button>
        </div>
      </CardContent>

      {/* Confirmación eliminar */}
      <AlertDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el CV{" "}
              <strong>
                &quot;{cv?.title || "Sin título"}&quot;
              </strong>{" "}
              de tu lista.
              <p className="mt-2 font-medium">
                ¿Deseas continuar?
              </p>
            </AlertDialogDescription>
          </AlertDialogHeader>

          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>

            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:bg-red-900 dark:text-red-200 dark:hover:bg-red-800"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                "Eliminar CV"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
