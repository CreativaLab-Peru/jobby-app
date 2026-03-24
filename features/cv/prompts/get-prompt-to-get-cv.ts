export const getPromptToGetCv = (cvText: string) => {
  return `
You are an **AI academic advisor and CV evaluator**.
Your task is to extract and structure all relevant information from the CV text provided below.

**CRITICAL INSTRUCTIONS:**
- Return ONLY a valid JSON object, no markdown blocks, no explanations.
- Ensure ALL strings are properly escaped (use \\" for quotes inside strings).
- Do NOT include trailing commas after the last element in arrays or objects.
- Every array element must be separated by commas.
- If text contains quotes, escape them properly.
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
      "contentJson": [
        {
          // Key-value pairs describing each entry in this section
        }
      ]
    }
  ]
}

---

### Detailed extraction rules

1. **sectionType** must match exactly one of the following values:
   one of: SUMMARY, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, VOLUNTEERING, CERTIFICATIONS, LANGUAGES, CONTACT, COMPLEMENTS, ACHIEVEMENTS, INTERESTS.

2. **title** should be the section's title as written in the CV (e.g., "Professional Experience", "Academic Background", "Skills").

3. **contentJson** should contain **structured objects** describing the specific details found in each section (Object or List of objects):
   - EXPERIENCE → [{ position, company, location, duration, responsibilities(type string) }]
   - EDUCATION → [{ level, title, institution, location, year, honors? }]
   - SKILLS → { soft: string[], languages: string[], technical: string[] }
   - PROJECTS → [{ title?, duration, description, technologies? }]
   - CERTIFICATIONS → [{ name, issuer?, year?, date? }]
   - LANGUAGES → [{ language, proficiency }]
   - CONTACT → { fullName?, email?, phone?, linkedin?, address?, summary? }
   - SUMMARY → { text }
   - VOLUNTEERING → [{ organization?, location?, position?, duration?, responsabilities? }]
   - ACHIEVEMENTS → [{ title?, description?, date? }]

4. Dates must be in ISO format "YYYY-MM" when available.

5. If a section doesn't exist in the CV, **omit it entirely** (don't return empty arrays).

6. Ensure that all extracted text is clear, properly capitalized, and concise.

7. Return **ONLY valid JSON** — without markdown code blocks, explanations, or comments.

8. **IMPORTANT**: Escape special characters in strings properly. Replace actual newlines with spaces.
9. **VALIDATION**: Before returning, mentally validate: every opening brace/bracket has a closing one, all strings are quoted, array elements are separated by commas.

---

### Example output (return exactly this format)
{"opportunityType":"EMPLOYMENT","language":"EN","cvType":"TECHNOLOGY_ENGINEERING","sections":[{"sectionType":"SUMMARY","title":"Professional Summary","contentJson":{"text":"Computer Science graduate with experience in backend development."}},{"sectionType":"EXPERIENCE","title":"Experience","contentJson":[{"company":"TechCorp","position":"Software Engineer","startDate":"2023-01","endDate":"Present","description":"Developed scalable APIs."}]}]}
`;
};
