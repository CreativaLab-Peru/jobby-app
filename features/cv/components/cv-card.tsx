"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Eye, Edit, Trash2 } from "lucide-react"
import { useRouter } from "next/navigation";
import { formatDate } from "@/utils/format-date"
import { CvWithRelations } from "../actions/get-cv-for-current-user"


interface CVCardProps {
    cv: CvWithRelations
}

const statusMapper = {
    CREATED: "Creado",
    ANALYZED: "Analizado",
    REVISED: "Revisado",
    COMPLETED: "Completado",
    PUBLISHED: "Publicado",
    ARCHIVED: "Archivado",
}

export function CVCard({ cv }: CVCardProps) {
    const lastQueueJob = cv.queueJobs[cv.queueJobs.length - 1]
    const router = useRouter()

    const handleEdit = () => {
        router.push(`/cv/${cv.id}/edit`)
    }

    const handleSeeDetail = () => {
        router.push(`/cv/${cv.id}/preview`)
    }

    const handleDelete = () => {
        // Función vacía por ahora, se implementará después
        console.log('Borrar CV:', cv.id)
    }

    return (
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group">
            <CardHeader className="relative">
                <div className="flex items-start justify-between">
                    <FileText className="w-8 h-8 text-blue-500 group-hover:scale-110 transition-transform" />
                    <div className="flex items-center gap-2">
                        {/* <Badge
                            variant={lastQueueJob.status !== JobStatus.SUCCEEDED ? "default" : "secondary"}
                            className={lastQueueJob.status === JobStatus.SUCCEEDED ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
                        >
                            {lastQueueJob.status}
                        </Badge> */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-500 hover:text-red-600 hover:bg-red-50 cursor-pointer"
                            onClick={handleDelete}
                        >
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <CardTitle className="text-xl text-gray-800 group-hover:text-blue-600 transition-colors">
                    {cv?.title || <span className="text-gray-400">Sin título</span>}
                </CardTitle>
                <CardDescription>
                    <span className="font-bold">Tipo de Oportunidad:{" "}</span>
                    {cv?.cvType === "TECHNOLOGY_ENGINEERING" && "Tecnología e Ingeniería"}
                    {cv?.cvType === "DESIGN_CREATIVITY" && "Diseño y Creatividad"}
                    {cv?.cvType === "MARKETING_STRATEGY" && "Marketing y Estrategia"}
                    {cv?.cvType === "MANAGEMENT_BUSINESS" && "Gestión y Negocios"}
                    {cv?.cvType === "FINANCE_PROJECTS" && "Finanzas y Proyectos"}
                    {cv?.cvType === "SOCIAL_MEDIA" && "Redes Sociales"}
                    {cv?.cvType === "EDUCATION" && "Educación"}
                    {cv?.cvType === "SCIENCE" && "Ciencia"}
                    {!cv?.cvType && <span className="text-gray-400">No especificado</span>}
                    
                    <span className="mx-2">|</span>
                    
                    <span className="font-bold">Estado:{" "}</span>
                        {cv?.opportunityType === "INTERNSHIP" && "Prácticas"}
                        {cv?.opportunityType === "SCHOLARSHIP" && "Beca"}
                        {cv?.opportunityType === "EXCHANGE_PROGRAM" && "Programa de Intercambio"}
                        {cv?.opportunityType === "EMPLOYMENT" && "Empleo"}
                        {!cv?.opportunityType && <span className="text-gray-400">No especificado
                    </span>}
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
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        className="border-gray-200 hover:border-gray-300 hover:bg-gray-100 text-black flex-1 bg-transparent cursor-pointer"
                        onClick={handleEdit}
                    >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                    </Button>
                </div>
            </CardContent>
        </Card>
    )
}