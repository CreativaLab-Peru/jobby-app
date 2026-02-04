import {prisma} from "@/lib/prisma";
import {v4 as uuidv4} from "uuid";
import {CreditBalanceType, CvType, Language, OpportunityType} from "@prisma/client";
import {savePdf} from "@/features/upload-cv/actions/save-pdf";
import {NextResponse} from "next/server";
import {getCurrentUser} from "@/features/share/actions/get-current-user";
import {detectCv} from "@/features/cv/actions/verify-cv";
import {getTextFromPdfApi} from "@/utils/get-text-from-pdf-api";
import {getPromptToGetCv} from "@/features/cv/prompts/get-prompt-to-get-cv";
import {queryGemini} from "@/features/cv/queries/query-gemini";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;
    const title = formData.get("title") as string || file?.name;
    const cvType = (formData.get("cvType") as CvType) || CvType.TECHNOLOGY_ENGINEERING;
    const opportunityType = (formData.get("opportunityType") as OpportunityType) || OpportunityType.EMPLOYMENT;

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

    // Extract text from PDF and verify if it's a CV
    const textFromPdf = await getTextFromPdfApi(url);
    const result = detectCv(textFromPdf);
    if (!result.isCv) {
      return NextResponse.json(
        {success: false, message: "El archivo subido no parece ser un CV válido."},
        {status: 400}
      );
    }

    // Use AI to extract and structure CV data
    const prompt = getPromptToGetCv(textFromPdf);
    const aiResult = await queryGemini({ prompt, type: "JSON" });

    if (!aiResult.success) {
      return NextResponse.json(
        {success: false, message: "Error al procesar el contenido del CV"},
        {status: 500}
      );
    }

    const jsonData = aiResult.data;
    const textCv = JSON.stringify(jsonData, null, 2);

    // Validate and set opportunityType and cvType from AI extraction
    let extractedOpportunityType = jsonData.opportunityType || opportunityType;
    let extractedCvType = jsonData.cvType || cvType;

    if (!Object.values(OpportunityType).includes(extractedOpportunityType as OpportunityType)) {
      extractedOpportunityType = opportunityType;
    }

    if (!Object.values(CvType).includes(extractedCvType as CvType)) {
      extractedCvType = cvType;
    }

    // Create CV with extracted data and sections
    const cv = await prisma.cv.create({
      data: {
        userId: currentUser.id,
        language: Language.EN,
        opportunityType: extractedOpportunityType,
        cvType: extractedCvType,
        title,
        extractedJson: jsonData,
        fullTextSearch: textCv,
        attachments: {
          create: {
            filename: file.name,
            mimeType: file.type,
            url,
            size: file.size,
          },
        },
        sections: {
          create: Array.isArray(jsonData.sections) 
            ? jsonData.sections.map((section: any, index: number) => ({
                sectionType: section.sectionType,
                title: section.title ?? null,
                contentJson: section.contentJson ?? {},
                order: index,
              }))
            : [],
        },
      },
    });

    if (!cv) {
      return NextResponse.json(
        {success: false, message: "Error al crear nuevo cv"},
        {status: 400}
      );
    }

    // Consume MANAGE_CVS credits (creating CV)
    await prisma.userCreditBalance.update({
      where: {
        userId_type: {
          userId: currentUser.id,
          type: CreditBalanceType.MANAGE_CVS
        }
      },
      data: {
        amount: {
          decrement: 1,
        }
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
