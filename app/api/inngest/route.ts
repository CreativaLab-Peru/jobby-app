import {serve} from "inngest/next";
import {inngest} from "@/inngest/functions/client";
import {evaluateCv} from "@/inngest/functions/evaluate-cv";
import {uploadNewCv} from "@/inngest/functions/upload-new-cv";
import {testOnProd} from "@/inngest/functions/test";
import {sendMagicLinkToEmail} from "@/inngest/functions/send-magic-link-to-email";
import {getAndSaveOpportunities} from "@/inngest/functions/get-and-save-opportunities";
import {generateRoadmap} from "@/inngest/functions/generate-roadmap";
import {processTempCvEvaluation} from "@/inngest/functions/process-temp-cv-evaluation";
import {processTempCvMigration} from "@/inngest/functions/process-temp-cv-migration";
import {sendDiagnosticAccessEmail} from "@/inngest/functions/send-diagnostic-access-email";
import {sendDiagnosticResultsEmail} from "@/inngest/functions/send-diagnostic-results-email";
import {evaluateDiagnosticCv} from "@/inngest/functions/evaluate-diagnostic-cv";

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
    processTempCvEvaluation,
    processTempCvMigration,
    sendDiagnosticAccessEmail,
    sendDiagnosticResultsEmail,
    evaluateDiagnosticCv,
  ],
});
