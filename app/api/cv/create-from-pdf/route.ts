import {prisma} from "@/lib/prisma";
import {v4 as uuidv4} from "uuid";
import {CreditBalanceType, CvType, Language, OpportunityType} from "@prisma/client";
import {savePdf} from "@/features/upload-cv/actions/save-pdf";
import {NextResponse} from "next/server";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {detectCv} from "@/features/cv/actions/verify-cv";
import {getTextFromPdfApi} from "@/utils/get-text-from-pdf-api";
import {inngest} from "@/inngest/functions/client";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const title = formData.get("title") as string || file?.name;
    const cvType = (formData.get("cvType") as CvType) || CvType.TECHNOLOGY_ENGINEERING;
    const opportunityType = (formData.get("opportunityType") as OpportunityType) || OpportunityType.EMPLOYMENT;
    const templateId = (formData.get("templateId") as string) || "harvard";
    if (!file) {
      return NextResponse.json({success: false, message: "Archivo necesario"}, {status: 400});
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({success: false, message: "User not found"}, {status: 404});
    }

    // Verify credit limits for MANAGE_CVS (creating CV)
    const creditBalance = await prisma.userCreditBalance.findUnique({
      where: {
        userId_type: {
          userId: currentUser.id,
          type: CreditBalanceType.MANAGE_CVS
        }
      },
    });

    if (!creditBalance || creditBalance.amount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes créditos disponibles para crear CVs. Por favor, actualiza tu plan."
        },
        {status: 403}
      );
    }

    // Save PDF file
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `CV-${uuidv4()}-${file.name}`;
    const {error, url} = await savePdf(file, {buffer, fileName});
    if (error) {
      return NextResponse.json(
        {success: false, message: error},
        {status: 400}
      );
    }

    // Quick validation: extract text and verify it looks like a CV
    const textFromPdf = await getTextFromPdfApi(url);
    const result = detectCv(textFromPdf);
    if (!result.isCv) {
      return NextResponse.json(
        {success: false, message: "El archivo subido no parece ser un CV válido."},
        {status: 400}
      );
    }

    // Create CV shell (processing will happen in the background via inngest)
    const cv = await prisma.cv.create({
      data: {
        userId: currentUser.id,
        language: Language.ES,
        opportunityType,
        cvType,
        title,
        templateId,
        attachments: {
          create: {
            filename: file.name,
            mimeType: file.type,
            url,
            size: file.size,
          },
        },
      },
    });

    if (!cv) {
      return NextResponse.json(
        {success: false, message: "Error al crear nuevo cv"},
        {status: 400}
      );
    }
    // Dispatch to inngest for async processing (extraction, sections, evaluation, opportunities)
    await inngest.send({
      name: "cv/uploaded",
      data: {
        cvId: cv.id,
        attachmentUrl: url,
        userId: currentUser.id,
      },
    });

    return Response.json({success: true, cvId: cv.id});
  } catch (error) {
    console.error("Error creating CV from PDF:", error);
    return NextResponse.json(
      {success: false, message: "Internal server error"},
      {status: 500}
    );
  }
}
