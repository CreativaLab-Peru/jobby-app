export const getPromptToEvaluateCv = (text: string) => {
  return `
### ROLE
Expert Technical Recruiter and Career Coach.

### TASK
Analyze the provided CV and generate a structural evaluation in JSON format.

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
  ]
}

### STRICT CONSTRAINTS
1. ONLY return the JSON object. No prose, no markdown code blocks ( \`\`\`json ).
2. If a section is missing in the CV, OMIT it from both "sectionScores" and "recommendations".
3. Use Spanish for all feedback and advice.
4. Ensure all strings are properly escaped to maintain valid JSON integrity.
5. NEVER include trailing commas.
`;
};
