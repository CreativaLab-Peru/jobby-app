export const getPromptToEvaluateCv = (
  text: string,
  cvType?: string | null,
  opportunityType?: string | null,
) => {
  const contextBlock = [
    cvType && `- CV Category: ${cvType}`,
    opportunityType && `- Target Opportunity: ${opportunityType}`,
  ]
    .filter(Boolean)
    .join("\n");

  return `
### ROLE
Expert Technical Recruiter, Career Coach, and CV Optimization Specialist.

### CONTEXT
${contextBlock || "No additional context provided."}

### TASK
Analyze the provided CV and generate:

1. A structural evaluation with scores per section.
2. Actionable recommendations.
3. **Improved text versions** for each section that can be directly applied to improve the CV in the language of the CV.
4. **Suggested additions** — new content the user should consider adding to boost their score.
All improvements MUST be tailored to the CV category and target opportunity type above.

### INPUT DATA (JSON)
${JSON.stringify(text)}

### OUTPUT FORMAT
Return a valid JSON object following this schema:
{
  "overallScore": number,
  "summary": "Spanish text, max 200 chars",
  "sectionScores": [
    { "sectionType": "SUMMARY | EXPERIENCE | EDUCATION | SKILLS | PROJECTS | VOLUNTEERING | CERTIFICATIONS | COMPLEMENTS | ACHIEVEMENTS | CONTACT", "score": number, "details": object }
  ],
  "recommendations": [
    { "sectionType": "string", "text": "Advice in Spanish", "severity": "LOW | MEDIUM | HIGH" }
  ],
  "improvedTexts": [
    {
      "sectionType": "string",
      "originalSnippet": "Brief excerpt of what the user currently has (Language of the cv, max 80 chars)",
      "improvedText": "The full improved version of this section content in the language of the cv. Must be ready to copy-paste.",
      "changeReason": "Short explanation in language of the cv of why this change improves the CV"
    }
  ],
  "suggestedAdditions": [
    {
      "sectionType": "string",
      "title": "Short title in Spanish",
      "suggestedText": "The content to add, written in Spanish, ready to copy-paste",
      "impact": "LOW | MEDIUM | HIGH",
      "reason": "Why adding this improves the CV (Spanish)"
    }
  ]
}

### STRICT CONSTRAINTS
1. ONLY return the JSON object. No prose, no markdown code blocks.
2. If a section is missing in the CV, OMIT it from "sectionScores" and "improvedTexts", but you CAN suggest it in "suggestedAdditions".
3. Use Spanish for ALL feedback, advice, improved texts, and suggestions.
4. "improvedTexts" must contain at least one entry for every section that scores below 80.
5. "suggestedAdditions" should recommend missing sections or content gaps. Max 5 items.
6. Ensure all strings are properly escaped to maintain valid JSON integrity.
7. NEVER include trailing commas.
`;
};
