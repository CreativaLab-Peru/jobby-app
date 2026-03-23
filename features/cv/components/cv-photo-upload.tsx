"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, Check, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { uploadCvPhoto } from "@/features/cv/actions/upload-cv-photo"
import { getCvPhotos } from "@/features/cv/actions/get-cv-photos"
import { deleteCvPhoto } from "@/features/cv/actions/delete-cv-photo"

const MAX_PHOTOS = 6

interface CvPhotoUploadProps {
  value?: string        // URL de Cloudinary de la foto seleccionada
  onChange: (url: string) => void
}

type Photo = { id: string; url: string }

export function CvPhotoUpload({ value, onChange }: CvPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [photos, setPhotos] = useState<Photo[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Cargar fotos del usuario al montar
  useEffect(() => {
    getCvPhotos().then((res) => {
      if ("photos" in res) setPhotos(res.photos)
      setLoading(false)
    })
  }, [])

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!["image/jpeg", "image/jpg", "image/png", "image/webp"].includes(file.type)) {
      toast.error("Solo se permiten imágenes JPG, PNG o WebP")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5MB")
      return
    }

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const res = await uploadCvPhoto(formData)

      if ("error" in res) {
        toast.error(res.error)
        return
      }

      const newPhoto = { id: res.photo.id, url: res.photo.url }
      setPhotos((prev) => [newPhoto, ...prev])
      onChange(newPhoto.url)
      toast.success("Foto subida correctamente")
    } catch {
      toast.error("Error al subir la foto")
    } finally {
      setIsUploading(false)
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleDelete = async (photo: Photo) => {
    setDeletingId(photo.id)
    try {
      const res = await deleteCvPhoto(photo.id)
      if ("error" in res) {
        toast.error(res.error)
        return
      }
      setPhotos((prev) => prev.filter((p) => p.id !== photo.id))
      // Si era la seleccionada, limpiar
      if (value === photo.url) onChange("")
      toast.success("Foto eliminada")
    } catch {
      toast.error("Error al eliminar la foto")
    } finally {
      setDeletingId(null)
    }
  }

  const atLimit = photos.length >= MAX_PHOTOS

  return (
    <div className="flex flex-col gap-3">
      {/* Encabezado con contador */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">
          Selecciona una foto existente o sube una nueva
        </p>
        <span className={`text-xs font-medium ${atLimit ? "text-destructive" : "text-muted-foreground"}`}>
          {photos.length} / {MAX_PHOTOS}
        </span>
      </div>

      {/* Galería de fotos */}
      {loading ? (
        <div className="grid grid-cols-3 gap-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="aspect-square rounded-lg bg-muted animate-pulse" />
          ))}
        </div>
      ) : photos.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-6 rounded-lg border-2 border-dashed border-border text-muted-foreground gap-2">
          <Camera className="w-8 h-8" />
          <p className="text-xs">Aún no tienes fotos subidas</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {photos.map((photo) => {
            const isSelected = value === photo.url
            const isDeleting = deletingId === photo.id
            return (
              <div
                key={photo.id}
                className={`relative aspect-square rounded-lg overflow-hidden border-2 cursor-pointer transition-all ${
                  isSelected ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/50"
                }`}
                onClick={() => !isDeleting && onChange(isSelected ? "" : photo.url)}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.url} alt="Foto CV" className="w-full h-full object-cover" />

                {/* Overlay seleccionado */}
                {isSelected && (
                  <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                    <div className="bg-primary text-primary-foreground rounded-full p-1">
                      <Check className="w-3 h-3" />
                    </div>
                  </div>
                )}

                {/* Overlay cargando */}
                {isDeleting && (
                  <div className="absolute inset-0 bg-background/70 flex items-center justify-center">
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  </div>
                )}

                {/* Botón eliminar */}
                {!isDeleting && (
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleDelete(photo) }}
                    className="absolute top-1 right-1 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 hover:opacity-100 shadow transition-opacity"
                    aria-label="Eliminar foto"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Botón subir */}
      <div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading || atLimit}
          onClick={() => inputRef.current?.click()}
          className="w-fit"
        >
          {isUploading ? (
            <>
              <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              {atLimit ? `Límite de ${MAX_PHOTOS} fotos alcanzado` : "Subir nueva foto"}
            </>
          )}
        </Button>
        {!atLimit && (
          <p className="text-xs text-muted-foreground mt-1">
            JPG, PNG o WebP · máx. 5MB · fondo neutro, encuadre formal
          </p>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  )
}
