import type { SectionConfig } from "../../types";

export const managementBusinessInternship: SectionConfig = {
    sections: [
        "personal",
        "education",
        "projects",
        "skills",
        "certifications",
    ],

    examples: {
        // Personal
        "personal.summary":
            "Estudiante de Administración de Empresas con sólida base en análisis de negocios y gestión de proyectos. Experiencia en trabajo en equipo y resolución de problemas empresariales. Busco una pasantía para aplicar conocimientos teóricos en un entorno corporativo y contribuir al crecimiento organizacional.",

        // Education
        "education.title": 
                "Administración de Empresas",
        "education.institution":
                "Universidad Nacional Mayor de San Marcos",
        "education.location": 
                "Lima, Perú",
        "education.year": 
                "Esperado Julio 2026",
        "education.honors":
                "Tercio Superior, Miembro del Club de Emprendimiento",

        // Projects
        "projects.title": 
                "Análisis de Viabilidad para Startup de Delivery",
        "projects.description":
                "Desarrollé un plan de negocios completo incluyendo análisis FODA, proyecciones financieras y estrategias de marketing. Presenté propuestas de mejora operativa que redujeron costos proyectados en 15%.",
        "projects.technologies":
                "Excel, Power BI, Google Analytics, Canva",
        "projects.duration": 
                "4 meses (Ago 2024 - Nov 2024)",

        // Skills
        "skills.technical":
                "Microsoft Office (Excel avanzado, PowerPoint, Word), Power BI, Análisis financiero, Gestión de proyectos, Marketing digital, Google Workspace",
        "skills.soft":
                "Liderazgo, Trabajo en equipo, Resolución de problemas, Comunicación efectiva, Pensamiento estratégico, Adaptabilidad",
        "skills.languages":
                "Español (Nativo), Inglés (Intermedio - B2), Portugués (Básico)",

        // Certifications
        "certifications.name": 
                "Fundamentos de Gestión de Proyectos",
        "certifications.issuer": 
                "Google Career Certificates",
        "certifications.date": 
                "Septiembre 2024", 
    },
};
