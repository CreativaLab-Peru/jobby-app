import type { SectionConfig } from "../../types";

export const technologyEngineeringScholarship: SectionConfig = {
  sections: [
    "personal",
    "education",
    "projects",
    "achievements",
    "skills",
  ],

  examples: {
    // Personal - Summary
    "personal.summary":
      "Estudiante de Ingeniería de Sistemas con promedio ponderado de 16.5/20 y gran interés en inteligencia artificial y machine learning. Busco una beca de estudios para profundizar en investigación aplicada y contribuir al desarrollo de soluciones tecnológicas que generen impacto social y académico.",

    // Education
    "education.title": "Ingeniería de Sistemas e Informática",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Julio 2026",
    "education.honors":
      "Tercio Superior (Top 10%), Mejor Promedio en curso de Algoritmos Avanzados, Beca de Excelencia Académica 2023",

    // Projects
    "projects.title": "Sistema de Predicción de Deserción Estudiantil con ML",
    "projects.description":
      "Desarrollé un modelo predictivo usando algoritmos de machine learning (Random Forest, XGBoost) para identificar estudiantes en riesgo de deserción académica. Procesé datos históricos de 5,000+ estudiantes y logré una precisión del 87%. El proyecto fue presentado en el congreso estudiantil de investigación y recibió mención honrosa.",
    "projects.technologies":
      "Python, Scikit-learn, Pandas, NumPy, Jupyter Notebook, TensorFlow, Matplotlib",
    "projects.duration": "6 meses (Marzo 2024 - Agosto 2024)",

    // Achievements
    "achievements.title": "Ganador de Beca de Excelencia Académica PRONABEC",
    "achievements.description":
      "Seleccionado entre más de 5,000 postulantes a nivel nacional para recibir beca completa de estudios universitarios basada en mérito académico y liderazgo estudiantil. Mantuve promedio superior a 16/20 durante todos los ciclos académicos y participé activamente en organizaciones estudiantiles de tecnología.",
    "achievements.date": "Enero 2023",

    // Skills
    "skills.technical":
      "Python, Java, C++, JavaScript, Machine Learning, Deep Learning, TensorFlow, PyTorch, Scikit-learn, SQL, Git, LaTeX, Jupyter",
    "skills.soft":
      "Pensamiento crítico, Investigación académica, Escritura científica, Análisis de datos, Autodidacta, Perseverancia, Liderazgo estudiantil",
    "skills.languages":
      "Español (Nativo), Inglés (Avanzado - B2/C1), Alemán (Básico - A2)",
  },
};
