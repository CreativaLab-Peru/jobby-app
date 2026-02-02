import {inngest} from "@/inngest/functions/client";
import {prisma} from "@/lib/prisma";
import {v4 as uuidv4} from "uuid";
import {CreditBalanceType, CvType, Language, OpportunityType} from "@prisma/client";
import {savePdf} from "@/features/upload-cv/actions/save-pdf";
import {NextResponse} from "next/server";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {getTextFromPdfApi} from "@/utils/get-text-from-pdf-api";
import {detectCv} from "@/features/cv/actions/verify-cv";
import {getCurrentCreditLimits} from "@/features/credits/actions/get-current-credits-limits";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({success: false, message: "Archivo necesario"}, {status: 400});
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({success: false, message: "User not found"}, {status: 404});
    }

    // Verify credit limits
    const creditLimits = await getCurrentCreditLimits();
    if (creditLimits.aiActionsLimit <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No tienes intentos disponibles para subir CVs. Por favor, actualiza tu plan."
        },
        {status: 403}
      );
    }

    const userId = currentUser.id;

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

    // Extract text from PDF and verify if it's a CV
    const textFromPdf = await getTextFromPdfApi(url);
    const result = detectCv(textFromPdf);
    if (!result.isCv) {
      return NextResponse.json(
        {success: false, message: "El archivo subido no parece ser un CV válido."},
        {status: 400}
      );
    }

    const createdByJobId = uuidv4();
    const cv = await prisma.cv.create({
      data: {
        userId,
        language: Language.EN,
        opportunityType: OpportunityType.EMPLOYMENT,
        cvType: CvType.TECHNOLOGY_ENGINEERING,
        title: file.name,
        createdByJobId,
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

    await prisma.userCreditBalance.update({
      where: {
        userId_type: {
          userId: currentUser.id,
          type: CreditBalanceType.MANAGE_CVS
        }
      },
      data: {
        type: "AI_ACTIONS",
        amount: {
          decrement: 1,
        }
      },
    })

    await inngest.send({
      name: "cv/uploaded",
      data: {
        cvId: cv.id,
        attachmentUrl: url,
      },
    });

    return Response.json({success: true, cvId: cv.id});
  } catch (error) {
    console.error("Error uploading CV:", error);
    return NextResponse.json(
      {success: false, message: "Internal server error"},
      {status: 500}
    );
  }
}
