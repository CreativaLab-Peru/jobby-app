"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { CVData, CVSection } from "@/types/cv";
import { CvDocument } from "./cv-document";
import { CvDocumentEuropass } from "./cv-document-europass";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function ClientPDFPreview({
  cvData,
  sections,
  templateId = "harvard"
}: {
  cvData: CVData;
  sections: CVSection[];
  templateId?: string;
}) {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [generationError, setGenerationError] = useState<string | null>(null);
  const [containerWidth, setContainerWidth] = useState<number | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  const generatePdf = React.useCallback(async () => {
    setLoading(true);
    setGenerationError(null);

    try {
      const documentComponent = templateId === "europass"
        ? <CvDocumentEuropass data={cvData} sections={sections} />
        : <CvDocument data={cvData} sections={sections} />;

      const blob = await pdf(documentComponent).toBlob();
      setPdfBlob(blob);
    } catch (error) {
      console.error("Error generating PDF:", error);
      setPdfBlob(null);
      setGenerationError("No pudimos generar la vista previa. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  }, [cvData, sections, templateId]);

  useEffect(() => {
    generatePdf();
  }, [generatePdf]);

  // Medición inicial y observación de cambios
  React.useLayoutEffect(() => {
    if (!containerRef.current) return;

    const updateWidth = () => {
      if (containerRef.current) {
        // contentRect.width es el ancho interno (sin padding)
        const newWidth = containerRef.current.clientWidth - 32; // clientWidth menos el padding total aproximado
        setContainerWidth(Math.min(newWidth, 800));
      }
    };

    updateWidth();

    const observer = new ResizeObserver(() => {
      updateWidth();
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [loading]); // Re-ejecutar cuando loading cambia para que encuentre el ref

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[90vh] bg-muted/30 rounded-lg">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Generando vista previa...</p>
        </div>
      </div>
    );
  }

  if (generationError) {
    return (
      <div className="flex items-center justify-center h-[90vh] bg-muted/30 rounded-lg">
        <div className="flex flex-col items-center gap-3 text-center px-4">
          <p className="text-sm text-destructive font-semibold">{generationError}</p>
          <button
            type="button"
            onClick={generatePdf}
            className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="h-[50vh] sm:h-[90vh] overflow-auto rounded-lg bg-muted/20 p-2 sm:p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
    >
      <div className="flex flex-col items-center gap-4">
        {pdfBlob && containerWidth ? (
          <Document
            file={pdfBlob}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={
              <div className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Cargando documento...</span>
              </div>
            }
          >
            {Array.from(new Array(numPages), (_, index) => (
              <Page
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                className="shadow-lg mb-4"
                renderTextLayer={false}
                renderAnnotationLayer={false}
                width={containerWidth}
              />
            ))}
          </Document>
        ) : pdfBlob ? (
           <div className="flex flex-col items-center gap-2 py-12">
             <Loader2 className="w-8 h-8 animate-spin text-primary" />
             <p className="text-sm text-muted-foreground transition-opacity">Ajustando vista previa...</p>
           </div>
        ) : (
          <div className="flex flex-col items-center gap-2 py-12">
            <p className="text-sm text-muted-foreground">No hay vista previa disponible por el momento.</p>
            <button
              type="button"
              onClick={generatePdf}
              className="inline-flex items-center justify-center rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
