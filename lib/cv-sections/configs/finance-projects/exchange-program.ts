import type { SectionConfig } from "../../types";

export const financeProjectsExchangeProgram: SectionConfig = {
  sections: [
    "personal",
    "projects",
    "experience",
    "volunteering",
    "education",
    "achievements",
    "skills",
  ],
  examples: {
    // Personal - Summary
    "personal.summary":
      "Estudiante de Finanzas con interés en análisis de datos y gestión de inversiones. Participación en proyectos académicos de simulación financiera y análisis de mercado. Habilidades en herramientas como Excel, Python y R para la toma de decisiones basadas en datos.",
    
      // Projects
    "projects.title": "Análisis de Portafolio de Inversiones con Python",
    "projects.description":
      "Desarrollé un modelo de optimización de portafolio utilizando técnicas de análisis cuantitativo y programación en Python. Implementé algoritmos de media-varianza para maximizar el retorno ajustado al riesgo, utilizando datos históricos de mercado. El proyecto incluyó visualizaciones interactivas para facilitar la interpretación de resultados.",
    "projects.technologies":
      "Python, Pandas, NumPy, Matplotlib, Seaborn, Jupyter Notebook",
    "projects.duration": "6 meses (Febrero 2024 - Julio 2024)",
    // Experience
    "experience.company": "FinTech Solutions S.A.",
    "experience.location": "Lima, Perú",
    "experience.position": "Analista de Datos (Prácticas)",
    "experience.duration": "Agosto 2023 - Diciembre 2023",
    "experience.responsibilities":
      "• Realicé análisis de datos para la identificación de tendencias en el mercado financiero utilizando Python y SQL.\n• Colaboré en la elaboración de informes de rendimiento de inversiones para clientes.\n• Participé en la automatización de procesos de recopilación de datos, reduciendo el tiempo de entrega en un 30%.",

    // Volunteering
    "volunteering.organization": "Asociación de Estudiantes de Finanzas",
    "volunteering.location": "Cusco, Perú",
    "volunteering.position": "Coordinador de Eventos",
    "volunteering.duration": "Marzo 2023 - Presente",
    "volunteering.responsibilities":
      "• Organicé seminarios y talleres sobre finanzas personales y análisis de inversiones para estudiantes universitarios.\n• Gestioné un equipo de 10 voluntarios para la planificación y ejecución de eventos.\n• Colaboré con profesionales del sector financiero para brindar charlas y mentorías a los miembros de la asociación.",
    
      // Education
    "education.title": "Licenciatura en Finanzas",
    "education.institution":
      "Universidad Nacional de San Antonio Abad del Cusco",
    "education.location": "Cusco, Perú",
    "education.year": "Esperado Diciembre 2026",
    "education.honors":
      "Promedio ponderado: 16.2/20, Miembro activo del Club de Inversiones",
    
      // Achievements
    "achievements.title":
      "Ganador del Concurso de Análisis de Mercado Financiero",
    "achievements.description":
      "Lideré un equipo de 4 estudiantes para desarrollar un análisis exhaustivo del mercado bursátil peruano, utilizando técnicas cuantitativas y cualitativas. Presentamos nuestras conclusiones ante un panel de expertos y fuimos reconocidos por la profundidad del análisis y la viabilidad de nuestras recomendaciones de inversión.",
    "achievements.date": "Noviembre 2023",
    
    // Skills
    "skills.technical":
      "Excel avanzado, Python (Pandas, NumPy, Matplotlib), R, SQL, Análisis financiero, Modelos cuantitativos, Visualización de datos",
    "skills.soft":
      "Pensamiento crítico, Trabajo en equipo, Comunicación efectiva, Gestión del tiempo, Adaptabilidad",
    "skills.languages":
      "Español (Nativo), Inglés (Intermedio - B1)",
  },
};
