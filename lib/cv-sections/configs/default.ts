import { OpportunityType } from "@prisma/client"
import type { SectionConfig } from "../types"

/**
 * Configuración por defecto para CvTypes que aún no han sido configurados
 * Usa la lógica actual del sistema
 */
export const getDefaultConfig = (opportunityType: OpportunityType): SectionConfig => {
  // Para INTERNSHIP, SCHOLARSHIP, EXCHANGE_PROGRAM: incluir projects y achievements
  if (
    opportunityType === OpportunityType.INTERNSHIP ||
    opportunityType === OpportunityType.SCHOLARSHIP ||
    opportunityType === OpportunityType.EXCHANGE_PROGRAM
  ) {
    return {
      sections: ["personal", "projects", "experience", "education", "achievements", "skills"],
      examples: {
        "personal.summary":
          "Estudiante de Ingeniería en Sistemas con pasión por el desarrollo web y la inteligencia artificial. Busco oportunidades de intercambio académico para expandir mis conocimientos en tecnologías emergentes y contribuir a proyectos innovadores.",
        "projects.title": "Sistema de Gestión de Inventario con IA",
        "projects.description":
          "Desarrollé una aplicación web que utiliza machine learning para predecir demanda de productos, reduciendo el desperdicio en un 25%. Implementé algoritmos de clasificación y una interfaz intuitiva para usuarios no técnicos.",
        "projects.technologies": "Python, TensorFlow, React, PostgreSQL, Docker",
        "projects.duration": "6 meses (Ago 2023 - Ene 2024)",
        "experience.company": "TechSolutions México S.A. de C.V.",
        "experience.location": "Lima, Perú",
        "experience.position": "Desarrollador Frontend Junior",
        "experience.duration": "Enero 2023 - Presente",
        "experience.responsibilities":
          "• Desarrollé 15+ componentes reutilizables en React, mejorando la eficiencia del equipo en 30%.\n• Colaboré con diseñadores UX para implementar interfaces responsivas.\n• Optimicé el rendimiento de aplicaciones web, reduciendo tiempos de carga en 40%.",
        "education.title": "Ingeniería Informática y de Sistemas",
        "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
        "education.location": "Cusco, Perú",
        "education.year": "Jul 2024",
        "education.honors": "Tercio Superior de la promoción",
        "achievements.title": "Primer lugar en Hackathon Nacional de Innovación Tecnológica",
        "achievements.description":
          "Lideré un equipo de 4 personas para desarrollar una solución de movilidad urbana sostenible. Competimos contra 150 equipos de todo el país y fuimos reconocidos por la innovación y viabilidad de nuestra propuesta.",
        "achievements.date": "Marzo 2024",
        "volunteering.organization": "Organización de Desarrollo Comunitario",
        "volunteering.location": "Lima, Perú",
        "volunteering.position": "Voluntario Coordinador",
        "volunteering.duration": "Enero 2023 - Presente",
        "volunteering.responsibilities":
          "• Coordiné actividades de desarrollo comunitario para 100+ beneficiarios.\n• Organicé talleres educativos y eventos de recaudación de fondos.\n• Colaboré con equipos multidisciplinarios para implementar proyectos sociales.",
        "skills.technical": "JavaScript, Python, React, Node.js, SQL, Git",
        "skills.soft": "Liderazgo, Comunicación efectiva, Trabajo en equipo, Resolución de problemas",
        "skills.languages": "Español (Nativo), Inglés (Avanzado), Francés (Intermedio)",
      }
    }
  }

  // Para trabajos (FULL_TIME, PART_TIME, FREELANCE, etc.): incluir certifications
  return {
    sections: ["personal", "experience", "education", "certifications", "skills"],
    examples: {
      "personal.summary":
        "Profesional con experiencia en desarrollo web y gestión de proyectos tecnológicos. Busco contribuir con mis habilidades técnicas y experiencia en entornos colaborativos e innovadores.",
      "experience.company": "TechSolutions México S.A. de C.V.",
      "experience.location": "Lima, Perú",
      "experience.position": "Desarrollador Frontend Junior",
      "experience.duration": "Enero 2023 - Presente",
      "experience.responsibilities":
        "• Desarrollé 15+ componentes reutilizables en React, mejorando la eficiencia del equipo en 30%.\n• Colaboré con diseñadores UX para implementar interfaces responsivas.\n• Optimicé el rendimiento de aplicaciones web, reduciendo tiempos de carga en 40%.",
      "education.title": "Ingeniería Informática y de Sistemas",
      "education.institution": "Universidad Nacional de San Antonio Abad del Cusco",
      "education.location": "Cusco, Perú",
      "education.year": "Jul 2024",
      "education.honors": "Tercio Superior de la promoción",
      "certifications.name": "AWS Certified Cloud Practitioner",
      "certifications.issuer": "Amazon Web Services",
      "certifications.date": "Junio 2024",
      "skills.technical": "JavaScript, Python, React, Node.js, SQL, Git",
      "skills.soft": "Liderazgo, Comunicación efectiva, Trabajo en equipo, Resolución de problemas",
      "skills.languages": "Español (Nativo), Inglés (Avanzado), Francés (Intermedio)",
    }
  }
}
