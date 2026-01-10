"use client"

import { Eye } from "lucide-react"
import { CVData, CVSection } from "@/types/cv"

interface CVPreviewProps {
  data: CVData
  sections: CVSection[]
}

export function CVPreview({ data, sections }: CVPreviewProps) {
  // Estilos comunes para consistencia
  const sectionTitleClasses = "text-left text-[11px] font-bold text-black mb-1.5 uppercase border-b border-black/80 tracking-tight"
  const itemTitleClasses = "text-[10.5px] font-bold text-black"
  const bodyTextClasses = "text-[10px] text-black/90 leading-snug"

  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    achievements: () =>
      data.achievements?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Logros y Reconocimientos</h2>
          <ul className="list-disc ml-4 space-y-0.5">
            {data.achievements.items.map((achievement, index) => (
              <li key={achievement.id || index} className={bodyTextClasses}>
                <span className="font-bold">{achievement.title}:</span> {achievement.description}
              </li>
            ))}
          </ul>
        </div>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Licencias y Certificaciones</h2>
          <div className={`${bodyTextClasses} space-y-0.5`}>
            {data.certifications.items.map((cert, index) => (
              <div key={cert.id || index} className="line-clamp-1">
                • {cert.name} — {cert.issuer} ({new Date(cert.date).toLocaleDateString("es-ES", { year: "numeric" })})
              </div>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Educación</h2>
          {data.education.items.map((edu, index) => (
            <div key={edu.id || index} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{edu.institution}</h3>
                <span className="text-[9px] font-medium ml-2">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className={`${bodyTextClasses} italic`}>{edu.title}</p>
                <span className="text-[9px] italic ml-2">{edu.year}</span>
              </div>
              {edu.honors && <p className={`${bodyTextClasses} mt-0.5`}>• {edu.honors}</p>}
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Proyectos Académicos</h2>
          {data.projects.items.map((project, index) => (
            <div key={project.id || index} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{project.title}</h3>
                <span className="text-[9px] italic ml-2">{project.duration}</span>
              </div>
              <p className={`${bodyTextClasses} text-justify mt-0.5`}>{project.description}</p>
              {project.technologies && (
                <p className={`${bodyTextClasses} mt-0.5 font-medium`}>
                  Tecnologías: <span className="font-normal">{project.technologies}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Voluntariado</h2>
          {data.volunteering.items.map((vol, index) => (
            <div key={vol.id || index} className="mb-2 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{vol.organization}</h3>
                <span className="text-[9px] font-bold ml-2">{vol.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={`${bodyTextClasses} italic uppercase text-[9px]`}>{vol.position}</p>
                <span className="text-[9px] italic ml-2">{vol.duration}</span>
              </div>
              <ul className="list-disc ml-4">
                {vol.responsibilities?.split("\n").map((line, idx) => (
                  <li key={idx} className={bodyTextClasses}>{line.replace(/^[-–•]\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    experience: () =>
      data.experience?.items?.length ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Experiencia Laboral</h2>
          {data.experience.items.map((exp, index) => (
            <div key={exp.id || index} className="mb-3 last:mb-0">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{exp.company}</h3>
                <span className="text-[9px] font-bold ml-2 uppercase">{exp.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={`${bodyTextClasses} italic font-medium`}>{exp.position}</p>
                <span className="text-[9px] italic ml-2">{exp.duration}</span>
              </div>
              <ul className="list-disc ml-4 space-y-0.5">
                {exp.responsibilities?.split("\n").map((line, idx) => (
                  <li key={idx} className={bodyTextClasses}>{line.replace(/^[-–•]\s*/, "")}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      data.skills && (
        data.skills.technical.length > 0 ||
        data.skills.soft.length > 0 ||
        data.skills.languages.length > 0
      ) ? (
        <div className="mb-4">
          <h2 className={sectionTitleClasses}>Habilidades</h2>
          <div className={`${bodyTextClasses} space-y-0.5`}>
            {data.skills.languages?.length > 0 && (
              <p><strong>Idiomas:</strong> {data.skills.languages.join(", ")}</p>
            )}
            {data.skills.technical?.length > 0 && (
              <p><strong>Técnicas:</strong> {data.skills.technical.join(", ")}</p>
            )}
            {data.skills.soft?.length > 0 && (
              <p><strong>Blandas:</strong> {data.skills.soft.join(", ")}</p>
            )}
          </div>
        </div>
      ) : null,
  }

  return (
    // CAMBIO: Mantener fondo blanco absoluto pero con bordes definidos por el sistema
    <div className="bg-white p-[1in] min-h-[11in] shadow-inner text-black selection:bg-primary/20"
         style={{ fontFamily: "'Inter', 'Arial', sans-serif" }}>

      {/* Header Name */}
      {data.personal?.fullName && (
        <div className="mb-3">
          <h1 className="text-2xl font-black text-black tracking-tighter uppercase text-center leading-none">
            {data.personal.fullName}
          </h1>
        </div>
      )}

      {/* Contact Info - Usando el color PRIMARY para links */}
      {data.personal && (
        <div className="mb-4">
          <p className="text-[9px] text-black text-center flex flex-wrap justify-center gap-x-2 gap-y-1 font-medium">
            {data.personal.address && <span>{data.personal.address}</span>}
            {data.personal.phone && <span>• {data.personal.phone}</span>}
            {data.personal.email && <span>• {data.personal.email}</span>}
            {data.personal.linkedin && (
              <>
                <span>•</span>
                <a
                  href={data.personal.linkedin.startsWith('http') ? data.personal.linkedin : `https://${data.personal.linkedin}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary hover:underline font-bold"
                >
                  LinkedIn
                </a>
              </>
            )}
          </p>
          <div className="h-[1.5px] bg-black mt-3 w-full" />
        </div>
      )}

      {/* Summary */}
      {data.personal?.summary && (
        <div className="mb-5">
          <p className="text-[10px] leading-relaxed text-justify text-black/80 antialiased font-medium italic">
            {data.personal.summary}
          </p>
        </div>
      )}

      {/* Sections */}
      <div className="space-y-1">
        {sections.map((section) => {
          const renderer = sectionRenderers[section.id];
          if (!renderer) return null;
          return <div key={section.id}>{renderer()}</div>;
        })}
      </div>

      {/* Empty state - Refactorizado con tus variables */}
      {!data.personal?.fullName && (
        <div className="flex flex-col items-center justify-center py-32 text-muted-foreground">
          <div className="p-4 rounded-full bg-muted mb-4">
            <Eye className="w-10 h-10 opacity-20" />
          </div>
          <p className="text-sm font-medium">Completa tu información personal</p>
          <p className="text-xs opacity-60 italic">La vista previa aparecerá aquí</p>
        </div>
      )}
    </div>
  )
}
