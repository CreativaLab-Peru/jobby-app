export function detectCv(text: string) {
  const t = text.toLowerCase();

  let score = 0;

  // --- 1. CV Sections (EN + ES) ---
  const cvSections = [
    // Spanish
    "experiencia", "experiencia laboral", "educación", "habilidades", "perfil",
    "resumen", "proyectos", "certificaciones", "formación",
    // English
    "experience", "work experience", "education", "skills", "profile",
    "summary", "projects", "certifications", "training"
  ];
  const sectionHits = cvSections.filter(s => t.includes(s)).length;
  score += Math.min(sectionHits / 3, 1) * 0.40;

  // --- 2. Professional Action Verbs (EN + ES) ---
  const professionalVerbs = [
    // Spanish
    "desarrollé", "implementé", "gestioné", "coordiné", "analicé", "dirigí",
    "logré", "optimicé", "fui responsable", "lideré",
    // English
    "developed", "implemented", "managed", "coordinated", "analyzed",
    "led", "achieved", "designed", "optimized", "responsible for"
  ];
  const verbHits = professionalVerbs.filter(v => t.includes(v)).length;
  score += Math.min(verbHits / 3, 1) * 0.20;

  // --- 3. Technical Skills (common EN/ES terms) ---
  const techSkills = [
    "python", "java", "javascript", "typescript", "sql", "mysql", "postgres",
    "react", "angular", "node", "docker", "kubernetes", "aws", "gcp", "azure",
    "linux", "go", "html", "css", "devops"
  ];
  const skillHits = techSkills.filter(s => t.includes(s)).length;
  score += Math.min(skillHits / 5, 1) * 0.20;

  // --- 4. Contact Info (works for EN + ES CVs) ---
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/;
  const phoneRegex = /\b(\+?\d[\d -]{7,}\d)\b/;

  let contactScore = 0;
  if (emailRegex.test(t)) contactScore += 0.07;
  if (phoneRegex.test(t)) contactScore += 0.03;

  score += contactScore;

  // --- 5. CV formatting (common in EN + ES resumes) ---
  const bulletPoints = (text.match(/[\n\r]\s*[-•*]/g) || []).length;
  score += Math.min(bulletPoints / 5, 1) * 0.10;

  // --- Final Result ---
  return {
    isCv: score >= 0.45,
    score: Number(score.toFixed(3)),
  };
}
