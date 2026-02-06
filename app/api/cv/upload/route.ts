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
import {getPromptToGetCv} from "@/features/cv/prompts/get-prompt-to-get-cv";
import {queryGemini} from "@/features/cv/queries/query-gemini";

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

    // Extract and structure CV data using AI (SYNCHRONOUSLY like create-from-pdf)
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

    // Validate extracted opportunityType and cvType
    let opportunityType = jsonData.opportunityType || OpportunityType.EMPLOYMENT;
    let cvType = jsonData.cvType || CvType.TECHNOLOGY_ENGINEERING;

    if (!Object.values(OpportunityType).includes(opportunityType as OpportunityType)) {
      opportunityType = OpportunityType.EMPLOYMENT;
    }

    if (!Object.values(CvType).includes(cvType as CvType)) {
      cvType = CvType.TECHNOLOGY_ENGINEERING;
    }

    const createdByJobId = uuidv4();
    // Create CV with extracted content and sections
    const cv = await prisma.cv.create({
      data: {
        userId,
        language: Language.EN,
        opportunityType,
        cvType,
        title: file.name,
        createdByJobId,
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

    // Consume credits safely using transaction and locking
    try {
      const { consumeCredits } = await import('@/features/credits/actions/consume-credits');
      await consumeCredits({
        userId: currentUser.id,
        type: CreditBalanceType.AI_ACTIONS,
        amount: 1,
        description: `CV upload: ${cv.id}`,
      });
    } catch (error) {
      // Si falla el consumo de créditos, eliminar el CV creado
      await prisma.cv.delete({ where: { id: cv.id } });
      return NextResponse.json(
        { success: false, message: "No tienes créditos disponibles" },
        { status: 403 }
      );
    }

    // Trigger evaluation and opportunity matching
    await inngest.send({
      name: "cv/ready-for-evaluation",
      data: { cvId: cv.id, userId: currentUser.id },
    });

    await inngest.send({
      name: "get.and.save.opportunities",
      data: { cvId: cv.id, userId: currentUser.id },
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
