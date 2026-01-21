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

export type QueryGeminiProps = {
  prompt: string;
  type?: "JSON" | "TEXT";
};

export type QueryGeminiResponse<T> = { success: boolean; message: string; data?: T | null };

export async function queryGemini<T = any>(
  body: QueryGeminiProps
): Promise<QueryGeminiResponse<T>> {
  if (!GEMINI_API_KEY) {
    return { success: false, message: "GEMINI_API_KEY is not set.", data: null };
  }

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-goog-api-key": GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: body.prompt }] }],
        generationConfig: {
          maxOutputTokens: 4096,
          temperature: 0.6,
        },
      }),
    });

    if (!response.ok) {
      return { success: false, message: "Failed to fetch response from Gemini.", data: null };
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

    // Try to find and parse JSON from the response
    // First, try to find JSON block markers
    let jsonString = responseText;
    
    // Remove markdown code blocks if present
    const codeBlockMatch = responseText.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (codeBlockMatch) {
      jsonString = codeBlockMatch[1].trim();
    } else {
      // Try to extract JSON object
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        jsonString = jsonMatch[0];
      }
    }

    if (!jsonString || (!jsonString.startsWith('{') && !jsonString.startsWith('['))) {
      return {
        success: false,
        message: "No valid JSON found in response.",
        data: null,
      };
    }

    // Try to fix common JSON issues from LLM responses
    try {
      // Remove trailing commas before closing brackets
      jsonString = jsonString.replace(/,(\s*[\}\]])/g, '$1');
      
      const jsonResponse = JSON.parse(jsonString) as T;

      return {
        success: true,
        data: jsonResponse,
        message: "Success",
      };
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Attempted to parse:", jsonString.substring(0, 500));
      return {
        success: false,
        message: `Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`,
        data: null,
      };
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
