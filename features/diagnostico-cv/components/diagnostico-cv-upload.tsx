"use client";

import { useState, useCallback } from "react";

interface DiagnosticoCvUploadProps {
  onUpload: (file: File) => Promise<void>;
  isLoading: boolean;
}

export function DiagnosticoCvUpload({ onUpload, isLoading }: DiagnosticoCvUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(file.type)) {
      setError("Solo se aceptan archivos PDF o Word (.doc, .docx)");
      return false;
    }

    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      setError("El archivo debe ser menor a 10MB");
      return false;
    }

    setError(null);
    return true;
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && validateFile(droppedFile)) {
      setFile(droppedFile);
    }
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && validateFile(selectedFile)) {
      setFile(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (file) {
      await onUpload(file);
    }
  };

  const isThinFile = file && file.size < 12 * 1024; // 12KB

  return (
    <div className="min-h-screen bg-[#080f0d] text-[#f4f0e6] font-sans flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          <div className="flex-1 h-1 bg-[#111f1b] rounded-full overflow-hidden">
            <div className="h-full bg-[#c8f562] w-3/4" />
          </div>
          <span className="text-[#8a9e93] text-sm">3 de 4</span>
        </div>

        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-serif font-bold mb-2" style={{ fontFamily: "'Fraunces', serif" }}>
            Sube tu CV
          </h2>
          <p className="text-[#8a9e93]">
            Lo usaremos para analizar tu perfil y encontrar las mejores becas
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors ${
            isDragging
              ? "border-[#c8f562] bg-[#c8f562]/5"
              : "border-[rgba(255,255,255,.08)] hover:border-[#c8f562]/50"
          }`}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          />

          {file ? (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-[#c8f562]/20 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c8f562]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[#f4f0e6] font-medium">{file.name}</p>
                <p className="text-[#8a9e93] text-sm">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div className="w-12 h-12 mx-auto bg-[#111f1b] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#8a9e93]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L166a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-[#f4f0e6]">
                  Arrastra tu CV aqui o <span className="text-[#c8f562]">busca en tu dispositivo</span>
                </p>
                <p className="text-[#8a9e93] text-sm mt-1">PDF o Word, max 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Thin CV Warning */}
        {isThinFile && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p className="text-yellow-500 text-sm font-medium">CV muy corto detectado</p>
                <p className="text-[#8a9e93] text-xs mt-1">
                  Tu CV parece muy corto. Para un analisis mas preciso, considera agregar mas informacion.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <p className="text-red-400 text-sm mt-4 text-center">{error}</p>
        )}

        {/* Upload Button */}
        <button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full mt-6 py-4 bg-[#c8f562] text-[#080f0d] rounded-xl font-bold text-lg hover:bg-[#a8d444] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
              Subiendo...
            </>
          ) : (
            "Analizar mi CV"
          )}
        </button>
      </div>
    </div>
  );
}
