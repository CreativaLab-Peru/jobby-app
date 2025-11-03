import { serve } from "inngest/next";
import { inngest } from "../../../inngest/functions/client";
import { evaluateCv } from "@/inngest/functions/evaluate-cv";
import { processUploadedCv } from "@/inngest/functions/process-uploaded-cv";
import { testOnProd } from "@/inngest/functions/test";
import { sendWelcomeEmail } from "@/inngest/functions/send-welcome-email";
import { sendVerifyEmail } from "@/inngest/functions/send-verify-email";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    evaluateCv,
    processUploadedCv,
    testOnProd,
    sendWelcomeEmail,
    sendVerifyEmail
  ],
});