// TODO: This method is not compatible with Edge Runtime due to the use of Buffer. No use.
import pdf from "pdf-parse";

export async function getTextFromPdf(pdfFile: File): Promise<string> {
  const arrayBuffer = await pdfFile.arrayBuffer();

  // Usa un polyfill de Buffer si estás en Edge Runtime
  const buffer = Buffer.from(arrayBuffer); // Esto falla en Edge

  const data = await pdf(buffer);
  return data.text || "";
}
