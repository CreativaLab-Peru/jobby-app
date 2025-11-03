import { put } from "@vercel/blob";
import { LogAction, LogLevel } from "@prisma/client";
import { logsService } from "@/features/share/services/logs-service";

interface SavePdfParams {
  buffer: Buffer;
  fileName: string;
}
interface SavePdfResult {
  url: string | null;
  error: string | null;
}

export const savePdf = async (
  file: File,
  { buffer, fileName }: SavePdfParams
): Promise<SavePdfResult> => {
  try {
    // 📝 Log: starting process
    await logsService.createLog({
      action: LogAction.FILE_UPLOAD,
      level: LogLevel.INFO,
      message: "Starting PDF upload process",
      entity: "PDF_FILE",
      entityId: fileName,
      metadata: {
        fileName,
        fileSize: file.size,
        mimeType: file.type
      }
    });

    // 📦 Optional: limit file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      await logsService.createLog({
        action: LogAction.FILE_UPLOAD,
        level: LogLevel.WARNING,
        message: "PDF file rejected because it exceeded size limit",
        entity: "PDF_FILE",
        entityId: fileName,
        metadata: {
          fileName,
          fileSize: file.size,
          maxAllowed: "5MB"
        }
      });

      return { url: null, error: "File too large. Max allowed is 5MB." }
    }

    const { url } = await put(fileName, buffer, {
      access: "public",
    });

    // ✅ Log success
    await logsService.createLog({
      action: LogAction.FILE_UPLOAD,
      level: LogLevel.INFO,
      message: "PDF file uploaded successfully",
      entity: "PDF_FILE",
      entityId: fileName,
      metadata: {
        fileName,
        uploadedUrl: url.toString()
      }
    });

    return {
      url: url.toString(),
      error: null,
    }

  } catch (error: any) {
    console.error("[ERROR_SAVE_PDF]", error);

    await logsService.createLog({
      action: LogAction.FILE_UPLOAD,
      level: LogLevel.ERROR,
      message: "Failed to upload PDF file",
      entity: "PDF_FILE",
      entityId: fileName,
      metadata: {
        fileName,
        error: error instanceof Error ? error.message : "Unknown error",
      }
    });

    return {
      url: null,
      error: error instanceof Error
        ? error.message
        : "Unknown error occurred while saving PDF."
    }
  }
};
