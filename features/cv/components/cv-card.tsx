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
    <Card className="group bg-card border shadow-sm hover:shadow-md transition-all duration-300">
      <CardHeader className="relative space-y-3">
        <div className="flex items-start justify-between">
          <FileText className="w-8 h-8 text-primary transition-transform group-hover:scale-110" />

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => setShowDeleteDialog(true)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>

        <CardTitle className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors">
          <TitleAndForm
            title={cv.title || "Sin título"}
            onSubmit={handleChangeTitle}
            isSubmitting={isPending}
          />
        </CardTitle>

        <CardDescription className="text-sm text-muted-foreground space-y-1">
          <div>
            <span className="font-medium text-foreground">
              Tipo de oportunidad:
            </span>{" "}
            {cv?.cvType === "TECHNOLOGY_ENGINEERING" &&
              "Tecnología e Ingeniería"}
            {cv?.cvType === "DESIGN_CREATIVITY" && "Diseño y Creatividad"}
            {cv?.cvType === "MARKETING_STRATEGY" && "Marketing y Estrategia"}
            {cv?.cvType === "MANAGEMENT_BUSINESS" && "Gestión y Negocios"}
            {cv?.cvType === "FINANCE_PROJECTS" && "Finanzas y Proyectos"}
            {cv?.cvType === "SOCIAL_MEDIA" && "Redes Sociales"}
            {cv?.cvType === "EDUCATION" && "Educación"}
            {cv?.cvType === "SCIENCE" && "Ciencia"}
            {!cv?.cvType && (
              <span className="italic text-muted-foreground">
                No especificado
              </span>
            )}
          </div>

          <div>
            <span className="font-medium text-foreground">Estado:</span>{" "}
            {cv?.opportunityType === "INTERNSHIP" && "Prácticas"}
            {cv?.opportunityType === "SCHOLARSHIP" && "Beca"}
            {cv?.opportunityType === "EXCHANGE_PROGRAM" &&
              "Programa de intercambio"}
            {cv?.opportunityType === "EMPLOYMENT" && "Empleo"}
            {!cv?.opportunityType && (
              <span className="italic text-muted-foreground">
                No especificado
              </span>
            )}
          </div>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="text-sm text-muted-foreground space-y-1">
          <p>Creado: {formatDate(cv.createdAt, "dd/MM/yyyy")}</p>
          <p>Modificado: {formatDate(cv.updatedAt, "dd/MM/yyyy")}</p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={handleSeeDetail}
          >
            <Eye className="w-4 h-4 mr-1" />
            Ver
          </Button>

          <Button
            variant="outline"
            size="sm"
            className="flex-1"
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
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
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
