"use server";

type GeminiResponse = {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }> | null;
};

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const getRetryAfterMs = (response: Response): number | null => {
  const retryAfter = response.headers.get("retry-after");
  if (!retryAfter) return null;
  const secs = Number(retryAfter);
  if (!Number.isNaN(secs) && secs >= 0) return secs * 1000;
  const dateMs = Date.parse(retryAfter);
  if (!Number.isNaN(dateMs)) return Math.max(0, dateMs - Date.now());
  return null;
};

const getRetryAfterMsFromBody = (bodyText: string): number | null => {
  if (!bodyText) return null;

  // Gemini often returns: "Please retry in 18.917059589s."
  const retryMatch = bodyText.match(/retry in\s+([0-9]+(?:\.[0-9]+)?)s/i);
  if (retryMatch) {
    const secs = Number(retryMatch[1]);
    if (!Number.isNaN(secs) && secs >= 0) return Math.ceil(secs * 1000);
  }

  try {
    const parsed = JSON.parse(bodyText) as any;
    const msg: unknown = parsed?.error?.message;
    if (typeof msg === "string") {
      const m = msg.match(/retry in\s+([0-9]+(?:\.[0-9]+)?)s/i);
      if (m) {
        const secs = Number(m[1]);
        if (!Number.isNaN(secs) && secs >= 0) return Math.ceil(secs * 1000);
      }
    }
  } catch {
    // ignore
  }

  return null;
};

async function fetchGeminiWithRetry(payload: unknown, options?: { timeoutMs?: number }) {
  const timeoutMs = options?.timeoutMs ?? 45_000;
  const maxAttempts = 4;

  let lastError: unknown;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch(GEMINI_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.ok) {
        return response;
      }

      const status = response.status;
      const bodyText = await response.text().catch(() => "");
      const bodySnippet = bodyText ? bodyText.slice(0, 2000) : "";

      const retryAfterMs = getRetryAfterMs(response) ?? getRetryAfterMsFromBody(bodyText);
      const retryable = status === 408 || status === 429 || (status >= 500 && status <= 599);

      if (!retryable || attempt === maxAttempts) {
        const msg = `Gemini request failed (status ${status}). ${bodySnippet ? `Body: ${bodySnippet}` : ""}`;
        throw new Error(msg);
      }

      const baseDelay = 500 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      const delay = (retryAfterMs ?? baseDelay) + jitter;
      await sleep(delay);
      continue;
    } catch (err) {
      clearTimeout(timeout);
      lastError = err;

      const isAbort = err instanceof Error && err.name === "AbortError";
      const retryable = isAbort || err instanceof TypeError; // network errors

      if (!retryable || attempt === maxAttempts) {
        throw err;
      }

      const baseDelay = 500 * Math.pow(2, attempt - 1);
      const jitter = Math.floor(Math.random() * 250);
      await sleep(baseDelay + jitter);
    }
  }

  throw lastError;
}

export type QueryGeminiProps = {
  prompt: string;
  type?: "JSON" | "TEXT";
};

export type QueryGeminiResponse<T> = { success: boolean; message: string; data?: T | null };

function escapeInnerQuotesInJsonStrings(jsonStr: string): string {
  let out = "";
  let inString = false;
  let escapeNext = false;

  const nextNonWhitespace = (startIndex: number): string | null => {
    for (let i = startIndex; i < jsonStr.length; i++) {
      const ch = jsonStr[i];
      if (!/\s/.test(ch)) return ch;
    }
    return null;
  };

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (escapeNext) {
      out += ch;
      escapeNext = false;
      continue;
    }

    if (ch === "\\") {
      out += ch;
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      if (!inString) {
        inString = true;
        out += ch;
        continue;
      }

      // si estamos en una cadena y encontramos una comilla doble
      // miramos el siguiente caracter no blancos
      const nnw = nextNonWhitespace(i + 1);
      if (nnw === ":" || nnw === "," || nnw === "}" || nnw === "]" || nnw === null) {
        inString = false;
        out += ch;
        continue;
      }

      // Otherwise it is an inner quote -> escape it.
      out += "\\\"";
      continue;
    }

    out += ch;
  }

  // Si esta truncado dentro de una cadena, cerrarla
  if (inString) out += '"';
  return out;
}

// Ayuda a limpiar JSON comunmente mal formado
function fixJsonString(jsonStr: string): string {
  // Quita caracteres de control no validos
  let result = jsonStr.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");
  // Quita comas finales
  result = result.replace(/,(\s*[}\]])/g, "$1");
  // Escapa comillas internas dentro de cadenas (fallo común de Gemini)
  result = escapeInnerQuotesInJsonStrings(result);
  // Quita comas finales nuevamente (después de posibles ediciones)
  result = result.replace(/,(\s*[}\]])/g, "$1");
  return result;
}

function balanceJson(jsonStr: string): string {
  let inString = false;
  let escapeNext = false;
  let openBraces = 0;
  let openBrackets = 0;

  for (let i = 0; i < jsonStr.length; i++) {
    const ch = jsonStr[i];

    if (escapeNext) {
      escapeNext = false;
      continue;
    }

    if (ch === '\\') {
      escapeNext = true;
      continue;
    }

    if (ch === '"') {
      inString = !inString;
      continue;
    }

    if (inString) continue;

    if (ch === '{') openBraces++;
    if (ch === '}') openBraces = Math.max(0, openBraces - 1);
    if (ch === '[') openBrackets++;
    if (ch === ']') openBrackets = Math.max(0, openBrackets - 1);
  }

  let out = jsonStr;
  // Si esta truncado dentro de una cadena, cerrarla
  if (inString) {
    out += '"';
  }
  // Cierra arreglos primero, luego objetos
  out += ']'.repeat(openBrackets);
  out += '}'.repeat(openBraces);
  return out;
}

export async function queryGemini<T = any>(
  body: QueryGeminiProps
): Promise<QueryGeminiResponse<T>> {
  if (!GEMINI_API_KEY) {
    return { success: false, message: "GEMINI_API_KEY is not set.", data: null };
  }

  try {
    const payload = {
      contents: [{ parts: [{ text: body.prompt }] }],
      generationConfig: {
        maxOutputTokens: 8192,
        temperature: 0.2,
        ...(body.type === "JSON" ? { responseMimeType: "application/json" } : {}),
      },
    };

    let response: Response;
    try {
      response = await fetchGeminiWithRetry(payload, { timeoutMs: 45_000 });
    } catch (err) {
      return {
        success: false,
        message: `Failed to fetch response from Gemini. ${err instanceof Error ? err.message : ""}`,
        data: null,
      };
    }

    const data = (await response.json()) as GeminiResponse;
    const responseText = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    if (!responseText) {
      return {
        success: false,
        message: "Empty Gemini response.",
        data: null,
      };
    }

    if (body.type === "TEXT") {
      return {
        success: true,
        data: responseText as T,
        message: "Success",
      };
    }

    // Intenta encontrar y parsear JSON de la respuesta
    // Primero, intenta encontrar marcadores de bloque JSON
    let jsonString = responseText;
    
    // Quita bloques de código markdown si están presentes
    const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    } else {
      // Intenta extraer el objeto JSON más cuidadosamente
      // Encuentra la primera { y la última } para obtener el JSON completo
      const firstBrace = responseText.indexOf('{');
      const lastBrace = responseText.lastIndexOf('}');
      
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        jsonString = responseText.substring(firstBrace, lastBrace + 1);
      }
    }

    if (!jsonString || (!jsonString.startsWith('{') && !jsonString.startsWith('['))) {
      return {
        success: false,
        message: "No valid JSON found in response.",
        data: null,
      };
    }

    // Intenta corregir problemas comunes de JSON de respuestas LLM
    try {
      // Quita comas finales antes de los corchetes de cierre
      jsonString = jsonString.replace(/,(\s*[\}\]])/g, '$1');
      
      // Usa un enfoque más robusto para corregir JSON
      jsonString = balanceJson(fixJsonString(jsonString));
      
      console.log("Final JSON to parse:", jsonString.substring(0, 200));
      const jsonResponse = JSON.parse(jsonString) as T;

      return {
        success: true,
        data: jsonResponse,
        message: "Success",
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Full response text:", responseText);
      console.error("Extracted JSON string:", jsonString);
      console.error("Attempted to parse:", jsonString.substring(0, 500));
      
      // Segundo intento con limpieza más agresiva
      try {
        let cleanedJson = balanceJson(fixJsonString(jsonString));
        
        console.error("Cleaned JSON attempt:", cleanedJson.substring(0, 500));
        const jsonResponse = JSON.parse(cleanedJson) as T;
        console.log("Successfully parsed with aggressive cleanup");
        
        return {
          success: true,
          data: jsonResponse,
          message: "Success (with cleanup)",
        };
      } catch (secondError) {
        console.error("Second parse attempt failed:", secondError);
        return {
          success: false,
          message: `Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}. Original error position: line 1 column 511`,
          data: null,
        };
      }
    }
  } catch (error) {
    console.error("Failed to extract CV data:", error);
    return {
      success: false,
      message: "An error occurred while extracting CV data.",
      data: null,
    };
  }
}
