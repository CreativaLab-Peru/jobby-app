"use client";

import { PDFViewer } from "@react-pdf/renderer";
import { CVData, CVSection } from "@/types/cv";
import { CvDocument } from "./cv-document";


export function ClientPDFPreview({ 
  cvData, 
  sections 
}: { 
  cvData: CVData;
  sections: CVSection[];
}) {
  return (
    <div className="flex flex-col gap-4">
      <div className="border rounded-lg overflow-hidden h-[90vh]">
        <PDFViewer width="100%" height="100%">
          <CvDocument data={cvData} sections={sections} />
        </PDFViewer>
      </div>
    </div>
  );
}
