import { getCvById } from "@/features/cv/actions/get-cv-by-id";
import { redirect } from "next/navigation";
import { transformCVToDTO } from "@/features/cv/dto/transform-cv.dto";
import { CVData } from "@/types/cv";
import { PdfPreviewWrapper } from "../../../components/pdf-preview/pdf-preview-wrapper";
import {getSections} from "@/features/cv/helpers";;

export default async function TestPage() {
  const cv = await getCvById("aa42272f-46e6-42c8-8eb9-2ac4549801cb");
  if (!cv) return redirect("/404");

  const cvData: CVData = transformCVToDTO(cv);
  const sections = getSections(cv.opportunityType, cv.cvType);

  return (
    <div className="flex flex-col gap-4 p-6">
      <h1 className="text-xl font-semibold">CV Preview</h1>
      <PdfPreviewWrapper
        cvData={cvData}
        sections={sections}
      />
    </div>
  );
}
