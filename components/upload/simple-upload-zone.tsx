"use client"
import { useDropzone } from "react-dropzone"
import { Upload, Sparkles, FilePlus } from "lucide-react"

interface Props {
  onFileSelected: (file: File) => void;
  isPending?: boolean;
}

export const SimpleUploadZone = ({ onFileSelected, isPending }: Props) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => files[0] && onFileSelected(files[0]),
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    disabled: isPending
  });

  return (
    <div className="space-y-6 w-full p-2">
      {/* Zona de Subida */}
      <div
        {...getRootProps()}
        className={`group relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 cursor-pointer
          ${isDragActive ? "border-primary bg-primary/10" : "border-border hover:border-primary/40 hover:bg-primary/5"}`}
      >
        <input {...getInputProps()} />

        {/* Beneficios Gratuitos (Floating Badges) */}
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 flex gap-2">
          <span className="bg-primary/10 text-primary text-[10px] font-bold px-3 py-1 rounded-full border border-primary/20 flex items-center gap-1 backdrop-blur-sm">
            <Sparkles className="w-3 h-3" /> +1 CRÉDITO IA
          </span>
          <span className="bg-secondary text-secondary-foreground text-[10px] font-bold px-3 py-1 rounded-full border border-border flex items-center gap-1 backdrop-blur-sm">
            <FilePlus className="w-3 h-3" /> CV GRATIS
          </span>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-500">
            <Upload className="w-8 h-8 text-primary" />
          </div>

          <h3 className="text-xl font-bold text-foreground">Analiza tu CV ahora</h3>
          <p className="text-muted-foreground mt-2 text-sm">
            Sube tu PDF para recibir feedback instantáneo
          </p>

          <div className="mt-4 flex items-center gap-4 text-[11px] text-muted-foreground/60 uppercase tracking-widest">
            <span>Máximo 5MB</span>
            <span className="w-1 h-1 bg-border rounded-full" />
            <span>Formato PDF</span>
          </div>
        </div>
      </div>
    </div>
  );
};
