"use client"

import { useState, useCallback } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileText, CheckCircle } from "lucide-react"
import axios from "axios"

export default function UploadCVPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
  })

  const submit = async (file: File) => {
    try {
      setLoading(true)
      const formData = new FormData()
      formData.append("pdf", file)

      const response = await axios.post("/api/cv/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })

      if (response.data.success === false) {
        setLoading(false)
        setError(response.data.message || "Algo salió mal al subir el archivo.")
        return
      }

      const data = response.data as { cvId: string }
      router.push(`/process/${data.cvId}`)
      setUploadedFile(null)
      setError(null)
      localStorage.removeItem("uploaded-cv")
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleAnalyze = async () => {
    if (!uploadedFile) return
    localStorage.setItem("uploaded-cv", uploadedFile.name)
    await submit(uploadedFile)
  }

  return (
    <div className="h-full bg-gradient-to-br from-background/50 via-background to-background/10">
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-2xl mx-auto"
        >
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 ai-gradient rounded-full mb-6"
            >
              <Upload className="w-8 h-8 text-background" />
            </motion.div>

            <h1 className="text-4xl font-bold text-foreground mb-4">Sube tu CV</h1>
            <p className="font-medium text-muted-foreground">Analiza y mejora tu CV existente con nuestra IA avanzada</p>
          </div>

          <Card className="shadow-xl border-0 bg-background/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-foreground">Selecciona tu archivo PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/10"
                      : "border-muted hover:border-primary hover:bg-primary/10"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-lg text-muted-foreground mb-2">
                    {isDragActive ? "Suelta tu CV aquí..." : "Arrastra tu CV aquí o haz clic para seleccionar"}
                  </p>
                  <p className="text-sm text-muted-foreground">Solo archivos PDF (máximo 10MB)</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center p-6 bg-primary/10 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-primary mr-3" />
                    <div>
                      <h3 className="font-semibold text-primary">Archivo cargado exitosamente</h3>
                      <p className="text-muted-foreground flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1" />
                        {uploadedFile.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <Button
                      disabled={loading}
                      onClick={handleAnalyze}
                      className="flex-1 h-12 text-lg ai-gradient cursor-pointer"
                    >
                      Analizar CV
                    </Button>
                    <Button
                      variant="outline"
                      disabled={loading}
                      onClick={() => setUploadedFile(null)}
                      className="px-6 cursor-pointer text-muted-foreground hover:text-foreground"
                    >
                      Cambiar
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center mt-8"
          >
            <Button
              variant="outline"
              disabled={loading}
              onClick={() => router.push("/cv")}
              className="text-muted-foreground hover:text-foreground cursor-pointer"
            >
              ← Volver a opciones
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
