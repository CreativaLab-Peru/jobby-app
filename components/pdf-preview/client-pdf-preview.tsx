"use client";

import { useState, useEffect } from "react";
import { pdf } from "@react-pdf/renderer";
import { Document, Page, pdfjs } from "react-pdf";
import { CVData, CVSection } from "@/types/cv";
import { CvDocument } from "./cv-document";
import { Loader2 } from "lucide-react";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

// Configurar worker de PDF.js
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function ClientPDFPreview({ 
  cvData, 
  sections 
}: { 
  cvData: CVData;
  sections: CVSection[];
}) {
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [numPages, setNumPages] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generatePdf = async () => {
      try {
        const blob = await pdf(<CvDocument data={cvData} sections={sections} />).toBlob();
        setPdfBlob(blob);
      } catch (error) {
        console.error("Error generating PDF:", error);
      } finally {
        setLoading(false);
      }
    };

    generatePdf();
  }, [cvData, sections]);

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

  return (
    <div className="h-[90vh] overflow-auto rounded-lg bg-muted/20 p-4 scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
      <div className="flex flex-col items-center gap-4">
        {pdfBlob && (
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
                width={800}
              />
            ))}
          </Document>
        )}
      </div>
    </div>
  );
}
