import {serve} from "inngest/next";
import {inngest} from "@/inngest/functions/client";
import {evaluateCv} from "@/inngest/functions/evaluate-cv";
import {uploadNewCv} from "@/inngest/functions/upload-new-cv";
import {testOnProd} from "@/inngest/functions/test";
import {sendMagicLinkToEmail} from "@/inngest/functions/send-magic-link-to-email";
import {getAndSaveOpportunities} from "@/inngest/functions/get-and-save-opportunities";
import {generateRoadmap} from "@/inngest/functions/generate-roadmap";

// Create an API that serves zero functions
export const {GET, POST, PUT} = serve({
  client: inngest,
  functions: [
    evaluateCv,
    uploadNewCv,
    testOnProd,
    sendMagicLinkToEmail,
    getAndSaveOpportunities,
    generateRoadmap,
  ],
});
