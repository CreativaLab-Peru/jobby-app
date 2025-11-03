import { inngest } from "@/inngest/functions/client";
import { prisma } from "@/lib/prisma";
import { v4 as uuidv4 } from "uuid";
import { CvType, Language, OpportunityType } from "@prisma/client";
import { savePdf } from "@/features/upload-cv/actions/save-pdf";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/features/share/actions/get-current-user";
import { getLimitPlanOfCurrentUser } from "@/lib/shared/get-count-availables-attempts";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json({ success: false, message: "File is required" }, { status: 400 });
    }

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
    }

    const limitOfPlan = await getLimitPlanOfCurrentUser()
    const uploadCvsUsed = limitOfPlan.scoreAnalysis.used;
    const uploadCvLimit = limitOfPlan.scoreAnalysis.total;
    if (uploadCvsUsed >= uploadCvLimit) {
      return NextResponse.json(
        { success: false, message: "Upload CV limit reached" },
        { status: 403 }
      );
    }

    const userId = currentUser.id;

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `CV-${uuidv4()}-${file.name}`;
    const { error, url } = await savePdf(file, { buffer, fileName });
    if (error) {
      return NextResponse.json(
        { success: false, message: error },
        { status: 400 }
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

    // 3️⃣ Trigger Inngest workflow
    await inngest.send({
      name: "cv/uploaded",
      data: {
        cvId: cv.id,
        attachmentUrl: url,
      },
    });

    return Response.json({ success: true, cvId: cv.id });
  } catch (error) {
    console.error("Error uploading CV:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
