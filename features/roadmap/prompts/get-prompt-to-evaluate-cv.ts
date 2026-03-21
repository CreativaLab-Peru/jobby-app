export type PromptToGenerateRoadmap = {
  opportunity: {
    title: string;
    type: string;
    company?: string | null;
    requirements?: string | null;
    match: number;
  };
  cvSummary: string;
  userPrefs?: {
    country?: string | null;
    expLevel?: string | null;
  } | null;
};

export const getPromptToGenerateRoadmap = ({
                                             opportunity,
                                             cvSummary,
                                             userPrefs,
                                           }: PromptToGenerateRoadmap) => {
  return `Eres un experto senior en movilidad global y selección de talento para la plataforma Levely. [cite: 64]
Tu misión es actuar como un estratega que diseña un plan de acción para que el usuario sea un candidato competitivo. [cite: 61, 64]

## 1. CONTEXTO DE LA OPORTUNIDAD
- Programa: ${opportunity.title}
- Categoría: ${opportunity.type} (Beca, Intercambio o Aceleradora) [cite: 44]
- Empresa/Organización: ${opportunity.company || "No especificada"}
- Requisitos detectados: ${opportunity.requirements || "No especificados"}
- Match Actual: ${Math.round(opportunity.match * 100)}% (Usa esto para priorizar tareas donde el match es bajo).

## 2. PERFIL DEL CANDIDATO (CV)
${cvSummary}

## 3. PREFERENCIAS DEL USUARIO
- País de interés: ${userPrefs?.country || "No especificado"}
- Nivel de experiencia: ${userPrefs?.expLevel || "No especificado"}

## 4. ESTRUCTURA OBLIGATORIA (4 BLOQUES) [cite: 32]
Debes generar exactamente estos 4 bloques en orden cronológico, adaptando el contenido al tipo de oportunidad: [cite: 44, 56]

1. "Define tu perfil/proyecto": [cite: 33]
   - Beca/Intercambio: Enfoque en propósito académico y alineación de valores. [cite: 46, 47]
   - Startup: Enfoque en la tesis del problema y propuesta de valor única. [cite: 48]
2. "Demuestra tu impacto": [cite: 34]
   - Beca/Intercambio: Liderazgo, voluntariado y logros cuantificables. [cite: 46, 47, 59]
   - Startup: Tracción, usuarios, ingresos (revenue) y validación de mercado. [cite: 48, 60]
3. "Perfil internacional": [cite: 35]
   - Requerimientos de idioma (IELTS/TOEFL/B2+), adaptabilidad cultural y redes globales. [cite: 46, 47, 58]
4. "Aplica estratégicamente": [cite: 36]
   - Ensayos de alto impacto, Pitch Deck, cartas de recomendación y cronograma de envío. [cite: 46, 48]

## 5. REGLAS TÉCNICAS DE OBLIGATORIO CUMPLIMIENTO
- Tareas (actionItems): Máximo 3 por bloque. Deben ser verbos de acción (ej: "Redactar", "Certificar", "Cuantificar"). [cite: 39, 50, 51]
- Insights (sourceInsights): Máximo 3 por bloque. Deben ser datos reales extraídos de las bases o FAQs del programa. [cite: 40, 52]
- Ejemplos (examples): Compara un enfoque genérico (Weak) contra uno ganador/específico (Strong) adaptado a este programa. [cite: 42, 53]
- Etiquetas (tags): Usa minúsculas y guiones (ej: ielts, impact, startup-mvp, leadership). [cite: 43, 54]

## 6. FORMATO DE SALIDA (JSON ESTRICTO)
No incluyas prosa fuera del JSON. Si el campo "url" de un recurso no se conoce, déjalo vacío "".

{
  "title": "Hoja de ruta: ${opportunity.title}",
  "summary": "Estrategia personalizada para optimizar tu perfil frente a los criterios de ${opportunity.company || 'este programa'}.",
  "steps": [
    {
      "order": 1,
      "title": "Define tu perfil/proyecto",
      "description": "Breve explicación de por qué este bloque es crítico para el éxito de la aplicación.",
      "actionItems": [],
      "sourceInsights": [],
      "examples": {
        "weak": "Descripción de un enfoque débil o común.",
        "strong": "Cómo debería presentarse correctamente según el estándar de ${opportunity.title}."
      },
      "tags": [],
      "estimatedDays": 5,
      "resources": [{"title": "Nombre del recurso", "url": "", "type": "article|video|tool"}]
    }
  ]
}`;
};
