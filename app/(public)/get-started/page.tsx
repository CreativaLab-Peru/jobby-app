"use client"

import {useState, useCallback} from "react"
import { motion } from "framer-motion"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {Upload, FileText, CheckCircle, Lock, Rocket, BarChart3} from "lucide-react"
import {RegisterModal} from "@/features/user/components/register-modal";

export const dynamic = 'force-dynamic'

export default function UploadHomePage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [loading] = useState(false)
  const [openModal, setOpenModal] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
    }
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  return (
  <div className="bg-white relative h-full overflow-hidden">
      {/* Blobs decorativos */}
      <svg className="absolute top-0 left-0 w-64 h-64 opacity-20" viewBox="0 0 200 200">
        <path fill="#FF9F43" d="M40,-60C50,-45,60,-30,65,-12C70,6,70,28,60,45C50,62,30,75,10,70C-10,65,-30,40,-45,20C-60,0,-70,-20,-65,-40C-60,-60,-50,-80,-30,-85C-10,-90,10,-80,30,-75C50,-70,40,-60Z" transform="translate(100 100)" />
      </svg>
      <svg className="absolute bottom-0 right-0 w-72 h-72 opacity-15" viewBox="0 0 200 200">
        <path fill="#C26AFF" d="M50,-70C60,-55,70,-40,75,-20C80,0,75,20,65,35C55,50,35,60,15,65C-5,70,-25,70,-40,60C-55,50,-65,35,-70,15C-75,-5,-75,-25,-65,-40C-55,-55,-40,-65,-20,-70C0,-75,20,-75,40,-70C60,-65,50,-70Z" transform="translate(100 100)" />
      </svg>

      {/* Capa de degradado animado */}
      <div className="absolute inset-0 z-0 bg-animated"></div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-full mb-6"
            >
              <Upload className="w-8 h-8 text-white" />
            </motion.div>

            <h1 className="text-4xl font-bold text-gray-800 mb-4">Sube tu CV</h1>
            <p className="text-xl text-gray-600">Analiza y mejora tu CV existente con nuestra IA avanzada</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800">Selecciona tu archivo PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-orange-500 bg-orange-50"
                      : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-lg text-gray-600 mb-2">
                    {isDragActive ? "Suelta tu CV aquí..." : "Arrastra tu CV aquí o haz clic para seleccionar"}
                  </p>
                  <p className="text-sm text-gray-500">Solo archivos PDF (máximo 5MB)</p>
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-center p-6 bg-green-50 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 mr-3" />
                    <div>
                      <h3 className="font-semibold text-green-800">Archivo cargado exitosamente</h3>
                      <p className="text-green-600 flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1" />
                        {uploadedFile.name}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4">
                    <RegisterModal
                      isOpen={openModal}
                      onOpenChange={setOpenModal}
                      file={uploadedFile}
                    >
                      <Button
                        disabled={loading}
                        className="flex-1 h-12 text-lg bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 cursor-pointer"
                      >
                        Analizar CV
                      </Button>
                    </RegisterModal>
                    <Button variant="outline"
                            disabled={loading}
                            onClick={() => setUploadedFile(null)}
                            className="px-6 cursor-pointer">
                      Cambiar
                    </Button>
                  </div>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
        {/* Features Section */}
        <section className="max-w-6xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <BarChart3 className="w-10 h-10 text-purple-500" />
                  <h3 className="text-xl font-semibold text-gray-800">Análisis Detallado</h3>
                  <p className="text-gray-600 text-sm">
                    Obtén puntuaciones precisas y recomendaciones basadas en IA para mejorar tu CV.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <Rocket className="w-10 h-10 text-pink-500" />
                  <h3 className="text-xl font-semibold text-gray-800">Recomendaciones Profesionales</h3>
                  <p className="text-gray-600 text-sm">
                    Consejos prácticos para destacar entre los reclutadores.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Card className="bg-white/90 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <Lock className="w-10 h-10 text-red-500" />
                  <h3 className="text-xl font-semibold text-gray-800">Datos Seguros</h3>
                  <p className="text-gray-600 text-sm">
                    Tu información está protegida con los más altos estándares de seguridad y privacidad.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  )
}
