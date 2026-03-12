"use client"

import { useRef, useState } from "react"
import { Camera, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import { uploadCvPhoto } from "@/features/cv/actions/upload-cv-photo"

interface CvPhotoUploadProps {
  value?: string        // URL actual de la foto
  onChange: (url: string) => void
}

export function CvPhotoUpload({ value, onChange }: CvPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview local inmediato
    const localUrl = URL.createObjectURL(file)
    setPreview(localUrl)

    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const result = await uploadCvPhoto(formData)

      if (result.success && result.url) {
        onChange(result.url)
        setPreview(result.url)
        toast.success("Foto subida correctamente")
      } else {
        // Revertir preview si falló
        setPreview(value)
        toast.error(result.message ?? "Error al subir la foto")
      }
    } finally {
      setIsUploading(false)
      // Limpiar input para permitir re-seleccionar el mismo archivo
      if (inputRef.current) inputRef.current.value = ""
    }
  }

  const handleRemove = () => {
    setPreview(undefined)
    onChange("")
    if (inputRef.current) inputRef.current.value = ""
  }

  return (
    <div className="flex items-start gap-4">
      {/* Previsualización */}
      <div className="relative flex-shrink-0 w-24 h-24 rounded-xl border-2 border-dashed border-border bg-muted/30 flex items-center justify-center overflow-hidden">
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview}
            alt="Foto de perfil"
            className="w-full h-full object-cover"
          />
        ) : (
          <Camera className="w-8 h-8 text-muted-foreground" />
        )}
        {/* Botón eliminar */}
        {preview && !isUploading && (
          <button
            type="button"
            onClick={handleRemove}
            className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full flex items-center justify-center shadow-sm hover:scale-110 transition-transform"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* Controles */}
      <div className="flex flex-col gap-2 justify-center flex-1">
        <p className="text-xs text-muted-foreground">
          JPG, PNG o WebP · máx. 2MB<br />
          Recomendado: fondo neutro, encuadre formal
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isUploading}
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
              {preview ? "Cambiar foto" : "Subir foto"}
            </>
          )}
        </Button>
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/jpg,image/png,image/webp"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </div>
  )
}
