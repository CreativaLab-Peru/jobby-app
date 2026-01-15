import { JsonValue } from "@prisma/client/runtime/library";

export const getPromptToEvaluateCv = (text: JsonValue) => {
  return `You are an expert career evaluator. Analyze this CV and return ONLY a valid JSON object.

CV Data:
${JSON.stringify(text, null, 2)}

Return this exact JSON structure (no markdown, no explanation, just raw JSON):
{
  "overallScore": <number 0-100>,
  "summary": "<brief feedback in Spanish, max 200 chars>",
  "sectionScores": [
    {"sectionType": "SUMMARY", "score": <0-100>, "details": {"clarity": <0-100>, "impact": <0-100>}},
    {"sectionType": "EXPERIENCE", "score": <0-100>, "details": {"relevance": <0-100>, "achievements": <0-100>}},
    {"sectionType": "EDUCATION", "score": <0-100>, "details": {"completeness": <0-100>}},
    {"sectionType": "SKILLS", "score": <0-100>, "details": {"relevance": <0-100>, "variety": <0-100>}}
  ],
  "recommendations": [
    {"sectionType": "EXPERIENCE", "text": "<advice in Spanish>", "severity": "HIGH"},
    {"sectionType": "SKILLS", "text": "<advice in Spanish>", "severity": "MEDIUM"}
  ]
}

CRITICAL RULES:
- Return ONLY the JSON object, nothing else
- sectionType must be one of: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, CERTIFICATIONS, LANGUAGES, CONTACT
- severity must be: LOW, MEDIUM, or HIGH
- All text fields in Spanish
- No trailing commas
- Valid JSON only`;
};
