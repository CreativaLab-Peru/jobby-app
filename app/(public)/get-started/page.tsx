"use client"

import {useState, useCallback, useTransition} from "react"
import {motion} from "framer-motion"
import {useDropzone} from "react-dropzone"
import {useRouter} from "next/navigation"
import {Button} from "@/components/ui/button"
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card"
import {Upload, FileText, CheckCircle, Lock, Rocket, BarChart3} from "lucide-react"
import {useAnalysisStore} from "@/hooks/use-analysis-store";
import {createTmpUser} from "@/features/home/actions/create-tmp-user";
import {Label} from "@/components/ui/label";
import {Input} from "@/components/ui/input";
import {toast} from "sonner";
import {getCurrentUser} from "@/features/share/actions/get-current-user";

export const dynamic = 'force-dynamic'

export default function UploadHomePage() {
  const router = useRouter();
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [email, setEmail] = useState('')
  const [loading] = useState(false);

  const {setFileData} = useAnalysisStore();

  const [isPending, startTransition] = useTransition();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0]
    if (file && file.type === "application/pdf") {
      setUploadedFile(file)
    }
  }, [router])

  const handleAnalyze = () => {
    if (uploadedFile) {
      // Creamos una URL temporal para el PDF
      const url = URL.createObjectURL(uploadedFile);

      startTransition(async ()=> {
        // If user is already logged in, redirect to dashboard
        const currentUser = await getCurrentUser();
        if (currentUser) {
          router.push('/dashboard')
          toast.success("Ya estas logueado, redirigiendo...");
          return;
        }

        // If not, create a temporary user and save the file data
        const result = await createTmpUser(email)
        if (!result.success) {
          toast.error(result?.error || "Error al subir tu cv.");
          return;
        }
        const userId = result.user.id;
        setFileData(url, uploadedFile.name, userId!)
        toast.success("Correo enviado correctamente!");
        router.push("/get-started/analysis");
      })

      // router.push('/login')
    }
  };

  const {getRootProps, getInputProps, isDragActive} = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
    },
    maxFiles: 1,
  })

  return (
    <div className="relative h-full overflow-hidden">
      {/* Blobs decorativos */}
      <svg className="absolute top-0 left-0 w-64 h-64 opacity-20" viewBox="0 0 200 200">
        <path fill="#fff68c"
              d="M40,-60C50,-45,60,-30,65,-12C70,6,70,28,60,45C50,62,30,75,10,70C-10,65,-30,40,-45,20C-60,0,-70,-20,-65,-40C-60,-60,-50,-80,-30,-85C-10,-90,10,-80,30,-75C50,-70,40,-60Z"
              transform="translate(100 100)"/>
      </svg>
      <svg className="absolute bottom-0 right-0 w-72 h-72 opacity-15" viewBox="0 0 200 200">
        <path fill="#fff68c"
              d="M50,-70C60,-55,70,-40,75,-20C80,0,75,20,65,35C55,50,35,60,15,65C-5,70,-25,70,-40,60C-55,50,-65,35,-70,15C-75,-5,-75,-25,-65,-40C-55,-55,-40,-65,-20,-70C0,-75,20,-75,40,-70C60,-65,50,-70Z"
              transform="translate(100 100)"/>
      </svg>

      {/* Capa de degradado animado */}
      <div className="absolute inset-0 z-0 bg-animated"></div>

      <div className="container mx-auto px-4 py-8">
        <motion.div initial={{opacity: 0, y: 20}} animate={{opacity: 1, y: 0}}
                    className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <motion.div
              initial={{scale: 0}}
              animate={{scale: 1}}
              transition={{delay: 0.2, type: "spring", stiffness: 200}}
              className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-full mb-6"
            >
              <Upload className="w-8 h-8 text-white"/>
            </motion.div>

            <h1 className="text-4xl font-bold mb-4">Sube tu CV</h1>
            <p className="text-xl">Analiza y mejora tu CV existente con nuestra IA avanzada</p>
          </div>

          <Card className="shadow-xl border-0 bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-center text-2xl text-gray-800 dark:text-gray-100">
                Selecciona tu archivo PDF</CardTitle>
            </CardHeader>
            <CardContent>
              {!uploadedFile ? (
                <div
                  {...getRootProps()}
                  className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                    isDragActive
                      ? "border-primary bg-primary/50"
                      : "border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500"
                  }`}
                >
                  <input {...getInputProps()} />
                  <Upload className="w-16 h-16 text-gray-400 mx-auto mb-4"/>
                  <p className="text-lg mb-2">
                    {isDragActive ? "Suelta tu CV aquí..." : "Arrastra tu CV aquí o haz clic para seleccionar"}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Solo archivos PDF (máximo
                    5MB)</p>
                </div>
              ) : (
                <motion.div
                  initial={{opacity: 0, scale: 0.9}}
                  animate={{opacity: 1, scale: 1}}
                  className="space-y-6"
                >
                  <div
                    className="flex items-center justify-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
                    <CheckCircle className="w-8 h-8 text-green-500 dark:text-green-300 mr-3"/>
                    <div>
                      <h3 className="font-semibold text-green-800 dark:text-green-200">Archivo
                        cargado exitosamente</h3>
                      <p className="text-green-600 dark:text-green-300 flex items-center mt-1">
                        <FileText className="w-4 h-4 mr-1"/>
                        {uploadedFile.name}
                      </p>
                    </div>
                  </div>
                  <div className="">
                    <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      Ingresa tu correo electrónico
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="usuario@gmail.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-4">
                    <Button
                      disabled={loading || !email}
                      variant={'default'}
                      className={'w-full'}
                      onClick={handleAnalyze}
                    >
                      Analizar CV
                    </Button>
                    <Button variant="outline"
                            disabled={loading}
                            onClick={() => setUploadedFile(null)}
                    >
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
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.2}}
            >
              <Card
                className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <BarChart3 className="w-10 h-10 text-purple-500 dark:text-purple-300"/>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Análisis
                    Detallado</h3>
                  <p className="text-gray-600 text-sm">
                    Obtén puntuaciones precisas y recomendaciones basadas en IA para mejorar tu CV.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.3}}
            >
              <Card
                className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <Rocket className="w-10 h-10 text-pink-500 dark:text-pink-300"/>
                  <h3
                    className="text-xl font-semibold text-gray-800 dark:text-gray-100">Recomendaciones
                    Profesionales</h3>
                  <p className="text-gray-600 text-sm">
                    Consejos prácticos para destacar entre los reclutadores.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              className="text-center"
              initial={{opacity: 0, y: 20}}
              animate={{opacity: 1, y: 0}}
              transition={{delay: 0.4}}
            >
              <Card
                className="bg-white/90 dark:bg-gray-800/60 backdrop-blur-sm shadow-lg border-0 p-6">
                <CardContent className="flex flex-col items-center space-y-3">
                  <Lock className="w-10 h-10 text-red-500 dark:text-red-300"/>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Datos
                    Seguros</h3>
                  <p className="text-gray-600 text-sm">
                    Tu información está protegida con los más altos estándares de seguridad y
                    privacidad.
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
