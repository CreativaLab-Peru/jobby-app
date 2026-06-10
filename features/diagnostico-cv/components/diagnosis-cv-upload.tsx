"use client";

import { useState, useCallback } from "react";

interface DiagnosisCvUploadProps {
  onUpload: (file: File) => Promise<void>;
  /** Called when the user wants to go back to the onboarding step */
  onBack: () => void;
  isLoading: boolean;
  error?: string | null;
}

export function DiagnosisCvUpload({ onUpload, onBack, isLoading, error }: DiagnosisCvUploadProps) {
  const [file, setFile]                     = useState<File | null>(null);
  const [isDragging, setIsDragging]         = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateFile = (f: File): boolean => {
    const validTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];

    if (!validTypes.includes(f.type)) {
      setValidationError("Solo se aceptan archivos PDF o Word (.doc, .docx)");
      return false;
    }
    if (f.size > 10 * 1024 * 1024) {
      setValidationError("El archivo debe ser menor a 10MB");
      return false;
    }

    setValidationError(null);
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
    if (!file || isLoading) return;
    await onUpload(file);
  };

  const isThinFile = file && file.size < 12 * 1024;
  const displayError = validationError ?? error;

  return (
    <div
      className="min-h-screen bg-[#0a0f0c] text-[#f0ede4] flex items-center justify-center p-6"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <div className="w-full max-w-md">

        {/* Progress — step 2 of 3 */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex-1 h-1 bg-[#111a16] rounded-full overflow-hidden">
            <div className="h-full bg-[#c9f563] transition-all" style={{ width: "66%" }} />
          </div>
          <span className="text-[rgba(240,237,228,.4)] text-[13px]">2 de 3</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <h2
            className="text-[28px] font-black leading-[1.1] tracking-[-0.5px] mb-2"
            style={{ fontFamily: "'Fraunces', serif" }}
          >
            Sube tu CV
          </h2>
          <p className="text-[14px] text-[rgba(240,237,228,.45)] leading-relaxed">
            Lo usaremos para analizar tu perfil y encontrar las mejores becas.
          </p>
        </div>

        {/* Dropzone */}
        <div
          onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={[
            "relative border-2 border-dashed rounded-2xl p-8 text-center transition-colors",
            isDragging
              ? "border-[#c9f563] bg-[#c9f563]/5"
              : "border-white/[.08] hover:border-[#c9f563]/40",
          ].join(" ")}
        >
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            disabled={isLoading}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
          />

          {file ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#c9f563]/15 rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[#c9f563]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-[#f0ede4] font-medium text-[14px]">{file.name}</p>
                <p className="text-[rgba(240,237,228,.4)] text-[13px]">{(file.size / 1024).toFixed(1)} KB</p>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <div className="w-12 h-12 bg-[#111a16] rounded-xl flex items-center justify-center">
                <svg className="w-6 h-6 text-[rgba(240,237,228,.35)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
              </div>
              <div>
                <p className="text-[14px] text-[#f0ede4]">
                  Arrastra tu CV aquí o{" "}
                  <span className="text-[#c9f563]">busca en tu dispositivo</span>
                </p>
                <p className="text-[rgba(240,237,228,.35)] text-[13px] mt-1">PDF o Word, máx. 10MB</p>
              </div>
            </div>
          )}
        </div>

        {/* Thin CV warning */}
        {isThinFile && (
          <div className="mt-4 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl flex items-start gap-3">
            <svg className="w-4 h-4 text-yellow-500 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <div>
              <p className="text-yellow-500 text-[13px] font-medium">CV muy corto detectado</p>
              <p className="text-[rgba(240,237,228,.4)] text-[12px] mt-0.5">
                Tu CV parece muy corto. Para un análisis más preciso, considera agregar más información.
              </p>
            </div>
          </div>
        )}

        {/* Error */}
        {displayError && (
          <div className="mt-4 p-3.5 bg-[rgba(226,75,74,.08)] border border-[rgba(226,75,74,.25)] rounded-xl flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[#e24b4a] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth={2} />
              <path strokeLinecap="round" strokeWidth={2} d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-[#e24b4a] text-[13px]">{displayError}</p>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={onBack}
            disabled={isLoading}
            className="flex-1 py-3.5 border border-[rgba(255,255,255,.08)] rounded-xl font-medium text-[15px] hover:border-[#c9f563]/30 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Atrás
          </button>

          <button
            onClick={handleUpload}
            disabled={!file || isLoading}
            className="flex-1 py-3.5 bg-[#c9f563] text-[#0a0f0c] rounded-xl font-semibold text-[15px] hover:bg-[#b8e050] transition-colors disabled:opacity-45 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" strokeOpacity={0.25} strokeWidth={2.5} />
                  <path d="M21 12a9 9 0 00-9-9" strokeWidth={2.5} />
                </svg>
                Subiendo...
              </>
            ) : (
              "Analizar mi CV"
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
