"use client";

import {useState, useTransition} from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {FileText, Eye, Edit, Trash2, Loader2} from "lucide-react";
import {useRouter} from "next/navigation";
import {formatDate} from "@/utils/format-date";
import {CvWithRelations} from "../actions/get-cv-for-current-user";
import {softDeleteCv} from "../actions/soft-delete-cv";
import {useToast} from "@/hooks/use-toast";
import {TitleAndForm} from "@/components/title-and-form";
import {updateCvTitle} from "@/features/cv/actions/update-title";

interface CVCardProps {
  cv: CvWithRelations;
}

export function CVCard({cv}: CVCardProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();
  const {toast} = useToast();
  const [isPending, startTransition] = useTransition()

  const handleEdit = () => {
    router.push(`/cv/${cv.id}/edit`);
  };

  const handleSeeDetail = () => {
    router.push(`/cv/${cv.id}/preview`);
  };

  const handleDelete = async () => {
    setIsDeleting(true);

    const result = await softDeleteCv(cv.id);

    if (result.success) {
      toast({
        title: "CV ocultado",
        description: "El CV ha sido ocultado exitosamente. Ya no aparecerá en tu lista.",
      });
      setShowDeleteDialog(false);
    } else {
      toast({
        title: "Error",
        description: result.error || "No se pudo ocultar el CV",
        variant: "destructive",
      });
    }
    setIsDeleting(false);
  };

  const handleChangeTitle = async (newTitle: string) => {
    if (isPending) return
    startTransition(() => {
      updateCvTitle(cv.id, newTitle).then((result) => {
        if (result.success) {
          toast({
            title: "Título actualizado",
            description: "El título del CV ha sido actualizado exitosamente.",
          });
          router.refresh();
        } else {
          toast({
            title: "Error",
            description: result.error || "No se pudo actualizar el título del CV",
            variant: "destructive",
          });
        }
      })
    })
  }

  return (
    <Card
      className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
      <CardHeader className="relative">
        <div className="flex items-start justify-between">
          <FileText className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform"/>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
              onClick={() => setShowDeleteDialog(true)}
            >
              <Trash2 className="w-4 h-4"/>
            </Button>
          </div>
        </div>
        <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
          <TitleAndForm title={cv.title || 'Sin título'} onSubmit={handleChangeTitle}
                        isSubmitting={false}/>
        </CardTitle>
        <CardDescription>
          <span className="font-bold">Tipo de Oportunidad: </span>
          {cv?.cvType === "TECHNOLOGY_ENGINEERING" && "Tecnología e Ingeniería"}
          {cv?.cvType === "DESIGN_CREATIVITY" && "Diseño y Creatividad"}
          {cv?.cvType === "MARKETING_STRATEGY" && "Marketing y Estrategia"}
          {cv?.cvType === "MANAGEMENT_BUSINESS" && "Gestión y Negocios"}
          {cv?.cvType === "FINANCE_PROJECTS" && "Finanzas y Proyectos"}
          {cv?.cvType === "SOCIAL_MEDIA" && "Redes Sociales"}
          {cv?.cvType === "EDUCATION" && "Educación"}
          {cv?.cvType === "SCIENCE" && "Ciencia"}
          {!cv?.cvType && (
            <span className="text-gray-400">No especificado</span>
          )}

          <span className="mx-2">|</span>

          <span className="font-bold">Estado: </span>
          {cv?.opportunityType === "INTERNSHIP" && "Prácticas"}
          {cv?.opportunityType === "SCHOLARSHIP" && "Beca"}
          {cv?.opportunityType === "EXCHANGE_PROGRAM" &&
            "Programa de Intercambio"}
          {cv?.opportunityType === "EMPLOYMENT" && "Empleo"}
          {!cv?.opportunityType && (
            <span className="text-gray-400">No especificado</span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 text-sm text-gray-600 mb-4">
          <p>Creado: {formatDate(cv.createdAt, "dd/MM/yyyy")}</p>
          <p>Modificado: {formatDate(cv.updatedAt, "dd/MM/yyyy")}</p>
        </div>
        <div className=" flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-black flex-1 bg-transparent cursor-pointer"
            onClick={handleSeeDetail}
          >
            <Eye className="w-4 h-4 mr-1"/>
            Ver
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-black flex-1 bg-transparent cursor-pointer"
            onClick={handleEdit}
          >
            <Edit className="w-4 h-4 mr-1"/>
            Editar
          </Button>
        </div>
      </CardContent>

      {/* Dialog de confirmación para eliminar CV */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará el CV &quot;{cv?.title || 'Sin título'}&quot; de tu lista de
              forma permanente. {' '}
              <p className="font-bold">¿Deseas continuar?</p>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin"/>
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
  );
}
