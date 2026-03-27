import { CvSectionType } from "@prisma/client";

export const getPromptToGetCv = (cvText: string, targetSections?: CvSectionType[]) => {
  // Preparamos la restricción de secciones si existe
  const sectionConstraint = targetSections && targetSections.length > 0
    ? `IMPORTANT: ONLY extract and return the following sections: [${targetSections.join(", ")}]. Ignore any other information not related to these sections.`
    : "Extract all relevant sections found in the text.";

  return `
You are an **AI academic advisor and CV evaluator**.
Your task is to extract and structure information from the CV text provided below.

**GOAL:** ${sectionConstraint}

**CRITICAL INSTRUCTIONS:**
- Return ONLY a valid JSON object, no markdown blocks, no explanations.
- Ensure ALL strings are properly escaped (use \\" for quotes inside strings).
- Do NOT include trailing commas after the last element in arrays or objects.
- Every array element must be separated by commas.
- Do not include actual newlines in strings, use spaces instead.
- Double-check that the JSON is valid before returning.

---

### Input (raw CV text)
${cvText}

---

### Output JSON schema
You must return **only one valid JSON object** following this structure:

{
  "opportunityType": "one of: INTERNSHIP | SCHOLARSHIP | EXCHANGE_PROGRAM | EMPLOYMENT | STARTUP",
  "language": "one of: EN, ES",
  "cvType": "one of: TECHNOLOGY_ENGINEERING | DESIGN_CREATIVITY | MARKETING_STRATEGY | MANAGEMENT_BUSINESS | FINANCE_PROJECTS | SOCIAL_MEDIA | EDUCATION | SCIENCE",
  "sections": [
    {
      "sectionType": "SUMMARY" | "EXPERIENCE" | "EDUCATION" | "SKILLS" | "PROJECTS" | "VOLUNTEERING" | "CERTIFICATIONS" | "LANGUAGES" | "CONTACT" | "COMPLEMENTS" | "ACHIEVEMENTS" | "INTERESTS",
      "title": "string | null",
      "contentJson": {} // Object or Array of objects depending on the sectionType
    }
  ]
}

---

### Detailed extraction rules

1. **Section Selection**:
   ${targetSections && targetSections.length > 0
    ? `You MUST return exactly these sections: [${targetSections.join(", ")}]. If a requested section is not found in the text, return it with an empty contentJson object or array.`
    : "If a section doesn't exist in the CV, omit it entirely."}

2. **sectionType** must match exactly: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, VOLUNTEERING, CERTIFICATIONS, LANGUAGES, CONTACT, COMPLEMENTS, ACHIEVEMENTS, INTERESTS.

3. **contentJson** structures:
   - EXPERIENCE → [{ position, company, location, duration, responsibilities(string) }]
   - EDUCATION → [{ level, title, institution, location, year, honors? }]
   - SKILLS → { soft: string[], languages: string[], technical: string[] }
   - PROJECTS → [{ title?, duration, description, technologies? }]
   - CERTIFICATIONS → [{ name, issuer?, year? }]
   - LANGUAGES → [{ language, proficiency }]
   - CONTACT → { fullName?, email?, phone?, linkedin?, address?, summary? }
   - SUMMARY → { text }
   - VOLUNTEERING → [{ organization?, position?, duration?, responsibilities? }]

4. Dates: Use ISO format "YYYY-MM" (e.g., "2023-05"). Use "Present" if applicable.

5. Formatting: Escape special characters. Replace newlines with spaces.

6. Validation: Ensure every opening brace has a closing one and strings are properly quoted.

---

### Example output
{"opportunityType":"EMPLOYMENT","language":"ES","cvType":"TECHNOLOGY_ENGINEERING","sections":[{"sectionType":"SUMMARY","title":"Resumen Profesional","contentJson":{"text":"Ingeniero de Software con experiencia en React."}}]}
`;
};
