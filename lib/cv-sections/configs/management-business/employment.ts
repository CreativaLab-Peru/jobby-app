import type { SectionConfig } from "../../types";
export const managementBusinessEmployment: SectionConfig = {
    sections: [
        "personal",
        "education",
        "experience",
        "achievements",
        "certifications",
        "skills",
    ],
    examples: {
        "personal.summary":
            "Profesional de negocios con más de 5 años de experiencia en gestión de proyectos y liderazgo de equipos. Habilidades destacadas en análisis financiero, planificación estratégica y optimización de procesos. Comprometido con el desarrollo sostenible y la innovación empresarial.",
        
        // Education
        "education.title":
                "Licenciatura en Administración de Empresas",
        "education.institution":
                "Universidad Nacional de San Antonio Abad del Cusco",
        "education.location":
                "Cusco, Perú",
        "education.year":
                "Graduación esperada en diciembre 2025",
        "education.honors":
                "Promedio: 3.3/4.0, Miembro del Club de Emprendimiento",

        // Experience
        "experience.company":
                "TechSolutions Mexico S.A. de C.V.",
        "experience.location":
                "Lima, Perú",
        "experience.position":
                "Analista de Gestión de Proyectos",
        "experience.duration":
                "Enero 2023 - Presente",
        "experience.responsibilities":
                "• Lideré la implementación de un nuevo sistema de gestión de proyectos que aumentó la eficiencia del equipo en un 25%.\n• Coordiné equipos multifuncionales para asegurar la entrega oportuna de proyectos clave.\n• Realicé análisis financieros detallados para evaluar la viabilidad de nuevos proyectos y optimizar recursos.",

        // Achievements
        "achievements.title":
                "Premio al Mejor Proyecto de Innovación Empresarial",
        "achievements.description":
                "Lideré un equipo de 5 personas para desarrollar un plan de negocios innovador que fue reconocido a nivel nacional por su enfoque sostenible y viabilidad económica.",
        "achievements.date":
                "Noviembre 2023",
        
        // Certifications
        "certifications.name":
                "Certificación en Gestión de Proyectos Profesional (PMP)",
        "certifications.issuer":
                "Project Management Institute",
        "certifications.date":
                "2022",
        
        // Skills
        "skills.technical": 
                "Gestión de proyectos, Análisis financiero, Planificación estratégica, Microsoft Office (Excel, PowerPoint, Word), ERP (SAP, Oracle)",
        "skills.soft": 
                "Liderazgo, Comunicación efectiva, Resolución de problemas, Trabajo en equipo, Pensamiento crítico",
    },
};