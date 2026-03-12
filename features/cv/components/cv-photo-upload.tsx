"use client"

import { useRef, useState } from "react"
import { Camera, Trash2, Upload } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

interface CvPhotoUploadProps {
  value?: string   // base64 data URL
  onChange: (base64: string) => void
}

/** Redimensiona y comprime la imagen a máx 400×400 JPEG 75% usando canvas */
function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const objectUrl = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(objectUrl)
      const MAX = 400
      let { width, height } = img
      if (width > MAX || height > MAX) {
        if (width > height) {
          height = Math.round((height * MAX) / width)
          width = MAX
        } else {
          width = Math.round((width * MAX) / height)
          height = MAX
        }
      }
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext("2d")
      if (!ctx) return reject(new Error("Canvas no disponible"))
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL("image/jpeg", 0.75))
    }
    img.onerror = reject
    img.src = objectUrl
  })
}

export function CvPhotoUpload({ value, onChange }: CvPhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [preview, setPreview] = useState<string | undefined>(value)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      toast.error("Solo se permiten imágenes JPG, PNG o WebP")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("La imagen no puede superar 5MB")
      return
    }

    setIsProcessing(true)
    try {
      const base64 = await compressImage(file)
      setPreview(base64)
      onChange(base64)
      toast.success("Foto lista")
    } catch {
      toast.error("Error al procesar la imagen")
    } finally {
      setIsProcessing(false)
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
        {preview && !isProcessing && (
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
          JPG, PNG o WebP · máx. 5MB (se comprime automáticamente)<br />
          Recomendado: fondo neutro, encuadre formal
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          disabled={isProcessing}
          onClick={() => inputRef.current?.click()}
          className="w-fit"
        >
          {isProcessing ? (
            <>
              <span className="mr-2 h-3 w-3 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Procesando...
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
