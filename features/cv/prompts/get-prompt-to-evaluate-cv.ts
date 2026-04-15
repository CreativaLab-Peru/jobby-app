import type { EvaluateCvSectionsPayload } from "@/features/cv/helpers/types";

export const getPromptToEvaluateCv = (
  sections: EvaluateCvSectionsPayload,
  cvType?: string | null,
  opportunityType?: string | null,
  lang?: "ES" | "EN",
  beca?: string | null,
  customInstructions?: string | null,
) => {
  const contextBlock = [
    cvType && `- CV Category: ${cvType}`,
    opportunityType && `- Target Opportunity: ${opportunityType}`,
    beca && `- Beca Focus: ${beca}`,
    `- CV Language: ${lang === "EN" ? "English" : "Spanish"}`,
  ]
    .filter(Boolean)
    .join("\n");

  const customBlock = customInstructions
    ? `\n### CUSTOM INSTRUCTIONS\n${customInstructions}\n`
    : "";

  return `
### ROLE
Expert Technical Recruiter, Career Coach, and CV Optimization Specialist.

### CONTEXT
${contextBlock || "No additional context provided."}
${customBlock}
### TASK
Analyze the provided CV and generate:

1. A structural evaluation with scores per section.
2. Actionable recommendations.
3. **Improved text versions** for each section that can be directly applied to improve the CV in the language of the CV.
4. **Suggested additions** — new content the user should consider adding to boost their score.
All improvements MUST be tailored to the CV category and target opportunity type above.

### INPUT DATA (JSON)
${JSON.stringify(sections)}

### OUTPUT FORMAT
Return a valid JSON object following this schema:
{
  "overallScore": number,
  "summary": "Spanish text, max 200 chars",
  "sectionScores": [
    { "sectionType": one of them "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | COMPLEMENTS | ACHIEVEMENTS | CONTACT", "score": number, "details": object }
  ],
  "recommendations": [
    { "sectionType": one of them "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | COMPLEMENTS | ACHIEVEMENTS | CONTACT", "text": "Advice in Spanish", "severity": "LOW | MEDIUM | HIGH" }
  ],
  "improvedTexts": [
    {
      "sectionType": one of them "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | COMPLEMENTS | ACHIEVEMENTS | CONTACT",
      "originalSnippet": "Brief excerpt of what the user currently has  ${lang} (max 80 chars)",
      "improvedText": The full improved version of this section content IN ${lang === "EN" ? "ENGLISH" : "SPANISH"}. Must be ready to copy-paste.(not json, plain text only, no markdown),
      "changeReason": "Short explanation in SPANISH why this change improves the CV"
    }
  ],
  "suggestedAdditions": [
    {
      "sectionType": one of them "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | COMPLEMENTS | ACHIEVEMENTS | CONTACT",
      "title": "Short title in Spanish",
      "suggestedText": "The content to add, written IN ${lang === "EN" ? "ENGLISH" : "SPANISH"}, ready to copy-paste (not json, plain text only, no markdown)",
      "impact": "LOW | MEDIUM | HIGH",
      "reason": "Why adding this improves the CV in SPANISH"
    }
  ]
}

### STRICT CONSTRAINTS
1. ONLY return the JSON object. No prose, no markdown code blocks.
2. If a section is missing in the CV, OMIT it from "sectionScores" and "improvedTexts", but you CAN suggest it in "suggestedAdditions".
3. 3. LANGUAGE SEPARATION (CRITICAL):
   - **Spanish**: Use for "summary", "recommendations.text", "changeReason", "suggestedAdditions.title", and "suggestedAdditions.reason".
   - **${lang === "EN" ? "English" : "Spanish"}**: Use ONLY for "improvedText" and "suggestedText". These will be copied directly into a ${lang} CV.
4. "improvedTexts" must contain at least one entry for every section that scores below 80.
5. "suggestedAdditions" should recommend missing sections or content gaps. Max 5 items.
6. Ensure all strings are properly escaped to maintain valid JSON integrity.
7. NEVER include trailing commas.
8. NO MARKDOWN ALLOWED in any string field: do not use headings (#), bullets (-, *, 1.), triple-backtick code fences, inline-code formatting, links in markdown format, bold/italic markdown markers, or blockquotes (>).
`;
};
