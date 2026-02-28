"use client"

import { Eye } from "lucide-react"
import { CVData, CVSection } from "@/types/cv"
import { linkedinHref, linkedinDisplay } from "@/lib/utils"

interface CVPreviewProps {
  data: CVData
  sections: CVSection[]
}

export function CVPreview({ data, sections }: CVPreviewProps) {
  // Estilos comunes para consistencia con cv-document.tsx
  const sectionTitleClasses = "text-[12px] font-bold uppercase mb-1.5"
  const sectionDividerClasses = "border-b border-black mb-2"
  const itemTitleClasses = "text-[11px] font-bold text-[#111]"
  const bodyTextClasses = "text-[10.5px] text-[#111] leading-[1.35]"

  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    achievements: () =>
      data.achievements?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Logros y Reconocimientos</h2>
          <div className={sectionDividerClasses} />
          <div>
            {data.achievements.items.map((achievement, index) => (
              <div key={achievement.id || index} style={{ marginBottom: 4 }}>
                <p className="text-[10.5px] leading-[1.35]">
                  {achievement.title ? <span className="font-bold">{achievement.title}:</span> : null}
                  {achievement.title && achievement.description ? " " : ""}
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Licencias y Certificaciones</h2>
          <div className={sectionDividerClasses} />
          <div>
            {data.certifications.items.map((cert, index) => (
              <p key={cert.id || index} className={`${bodyTextClasses} mb-1.5`}>
                {cert.name} {cert.issuer ? `by ${cert.issuer}` : ""} ({new Date(cert.date).getFullYear()})
              </p>
            ))}
          </div>
        </div>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Educación</h2>
          <div className={sectionDividerClasses} />
          {data.education.items.map((edu, index) => (
            <div key={edu.id || index} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{edu.institution}</h3>
                <span className="text-[10.5px]">{edu.location}</span>
              </div>
              <div className="flex justify-between items-baseline">
                <p className={bodyTextClasses}>{edu.title}</p>
                <span className="text-[10.5px] italic">{edu.year}</span>
              </div>
              {edu.honors && (
                <p className="text-[10.5px]">Honores: {edu.honors}</p>
              )}
            </div>
          ))}
        </div>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Proyectos Académicos</h2>
          <div className={sectionDividerClasses} />
          {data.projects.items.map((project, index) => (
            <div key={project.id || index} className="mb-1.5">
              <div className="flex justify-between items-baseline mb-1">
                <h3 className={itemTitleClasses}>{project.title}</h3>
                <span className="text-[10.5px] italic">{project.duration}</span>
              </div>
              {project.description && (
                <p className={`${bodyTextClasses} text-justify mb-1`}>{project.description}</p>
              )}
              {project.technologies && (
                <p className="text-[10.5px]">
                  <span className="font-bold">Tecnologías:</span> {project.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Voluntariado y Actividades Comunitarias</h2>
          <div className={sectionDividerClasses} />
          {data.volunteering.items.map((vol, index) => (
            <div key={vol.id || index} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{vol.organization}</h3>
                <span className="text-[10.5px] font-bold">{vol.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={bodyTextClasses}>{vol.position}</p>
                <span className="text-[10.5px] italic">{vol.duration}</span>
              </div>
              {vol.responsibilities && (
                <div className="ml-1.5">
                  {vol.responsibilities.split("\n").map((line, idx) => {
                    const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                    if (!cleaned) return null;
                    return (
                      <p key={idx} className={`${bodyTextClasses} mb-0.5`}>
                        • {cleaned}
                      </p>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : null,

    experience: () =>
      data.experience?.items?.length ? (
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Experiencia Laboral</h2>
          <div className={sectionDividerClasses} />
          {data.experience.items.map((exp, index) => (
            <div key={exp.id || index} className="mb-1.5">
              <div className="flex justify-between items-baseline">
                <h3 className={itemTitleClasses}>{exp.company}</h3>
                <span className="text-[10.5px] font-bold">{exp.location}</span>
              </div>
              <div className="flex justify-between items-baseline mb-0.5">
                <p className={bodyTextClasses}>{exp.position}</p>
                <span className="text-[10.5px] italic">{exp.duration}</span>
              </div>
              {exp.responsibilities && (
                <div className="ml-1.5">
                  {exp.responsibilities.split("\n").map((line, idx) => {
                    const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                    if (!cleaned) return null;
                    return (
                      <p key={idx} className={`${bodyTextClasses} mb-0.5`}>
                        • {cleaned}
                      </p>
                    );
                  })}
                </div>
              )}
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
        <div className="mt-1.5 mb-0">
          <h2 className={sectionTitleClasses}>Habilidades Profesionales y Personales</h2>
          <div className={sectionDividerClasses} />
          <div>
            {data.skills.languages?.length > 0 && (
              <p className="text-[10.5px] mb-1">
                <span className="font-bold mr-1.5">Idiomas:</span>
                {data.skills.languages.join(", ")}
              </p>
            )}
            {data.skills.technical?.length > 0 && (
              <p className="text-[10.5px] mb-1">
                <span className="font-bold mr-1.5">Habilidades Técnicas:</span>
                {data.skills.technical.join(", ")}
              </p>
            )}
            {data.skills.soft?.length > 0 && (
              <p className="text-[10.5px] mb-1">
                <span className="font-bold mr-1.5">Habilidades Blandas:</span>
                {data.skills.soft.join(", ")}
              </p>
            )}
          </div>
        </div>
      ) : null,
  }

  return (
    <div className="bg-white pt-7 pb-7 px-9 min-h-[11in] text-[#111] leading-[1.35]"
          style={{ fontFamily: "Arial, sans-serif", fontSize: "11px" }}>

      {/* Header: Name centered */}
      {data.personal?.fullName && (
        <div className="text-center mb-4">
          <h1 className="text-[20px] font-bold mb-4" style={{ letterSpacing: "0.5px" }}>
            {data.personal.fullName}
          </h1>
        </div>
      )}

      {/* Contact Info - centered, smaller text with blue LinkedIn link */}
      {data.personal && (
        <div className="mb-1.5">
          <p className="text-[10px] text-[#111] text-center mb-1.5">
            {data.personal.address && <span>{data.personal.address}</span>}
            {data.personal.address && (data.personal.linkedin || data.personal.phone || data.personal.email) && <span> • </span>}
            {data.personal.linkedin && (
              <>
                <a
                  href={linkedinHref(data.personal.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0b66c3] underline"
                >
                  {linkedinDisplay(data.personal.linkedin)}
                </a>
                {(data.personal.phone || data.personal.email) && <span> • </span>}
              </>
            )}
            {data.personal.phone && <span>{data.personal.phone}</span>}
            {data.personal.phone && data.personal.email && <span> • </span>}
            {data.personal.email && <span>{data.personal.email}</span>}
          </p>
        </div>
      )}

      {/* Divider line */}
      <div className="border-b border-black my-1.5" />

      {/* Summary */}
      {data.personal?.summary && (
        <div className="mb-0">
          <p className="text-[11px] italic leading-[1.35] mb-2 text-justify">
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
          <div className="p-4 rounded-full bg-levely-blue/50 dark:bg-levely-green/50 mb-4">
            <Eye className="w-10 h-10 opacity-20 text-levely-dark" />
          </div>
          <p className="text-sm font-medium">Completa tu información personal</p>
          <p className="text-xs opacity-60 italic">La vista previa aparecerá aquí</p>
        </div>
      )}
    </div>
  )
}
