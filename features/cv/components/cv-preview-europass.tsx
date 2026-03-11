"use client"

import { CVData, CVSection } from "@/types/cv"
import { linkedinHref, linkedinDisplay } from "@/lib/utils"

interface CVPreviewEuropassProps {
  data: CVData
  sections: CVSection[]
}

// CEFR Level descriptions
const CEFR_LEVELS: Record<string, { label: string; description: string }> = {
  A1: { label: "A1", description: "Elementary user (Básico)" },
  A2: { label: "A2", description: "Elementary user (Elementario)" },
  B1: { label: "B1", description: "Independent user (Intermedio)" },
  B2: { label: "B2", description: "Independent user (Intermedio-alto)" },
  C1: { label: "C1", description: "Proficient user (Avanzado)" },
  C2: { label: "C2", description: "Proficient user (Dominio)" },
}

export function CVPreviewEuropass({ data, sections }: CVPreviewEuropassProps) {
  // Europass color scheme
  const sidebarBg = "bg-[#0B5394]"
  const sidebarText = "text-white"
  const mainBg = "bg-white"
  const mainText = "text-black"

  // Europass typography
  const sectionTitleClasses = "text-[13px] font-bold uppercase mb-2 text-white"
  const sidebarDivider = "border-b border-white my-2"
  const mainSectionTitle = "text-[13px] font-bold uppercase mb-1.5 border-b border-black pb-0.5"
  const mainDivider = "border-b border-black mb-1.5"
  const itemTitleClasses = "text-[12px] font-bold"
  const bodyTextClasses = "text-[11px] leading-[1.35]"
  const smallTextClasses = "text-[10px]"

  return (
    <div className={`flex ${mainBg} min-h-[11in] font-[Arial]`} style={{ fontFamily: "Arial, sans-serif" }}>
      
      {/* ========== SIDEBAR (30%) ========== */}
      <div className={`${sidebarBg} ${sidebarText} w-[30%] p-6`} style={{ fontSize: "11px" }}>
        
        {/* Header: EUROPASS */}
        <div className="text-center mb-3">
          <h2 className="text-[24px] font-bold mb-2">EUROPASS</h2>
          <div className={sidebarDivider} />
        </div>

        {/* Contact Info */}
        {data.personal && (
          <div className="mb-3 text-center">
            {data.personal.phone && (
              <p className={`${smallTextClasses} mb-1`}>{data.personal.phone}</p>
            )}
            {data.personal.email && (
              <p className={`${smallTextClasses} mb-1`}>{data.personal.email}</p>
            )}
            {data.personal.linkedin && (
              <p className={`${smallTextClasses} mb-1`}>
                <a
                  href={linkedinHref(data.personal.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  {linkedinDisplay(data.personal.linkedin)}
                </a>
              </p>
            )}
            <div className={sidebarDivider} />
          </div>
        )}

        {/* SKILLS AND COMPETENCIES */}
        {data.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
          <div className="mb-3">
            <h3 className={sectionTitleClasses}>Skills and Competencies</h3>
            
            {/* Technical Skills */}
            {data.skills.technical?.length > 0 && (
              <div className="mb-2">
                <p className="text-[12px] font-bold mb-1">Digital Marketing</p>
                <ul className="ml-2 space-y-0.5">
                  {data.skills.technical.slice(0, 5).map((skill, idx) => (
                    <li key={idx} className={`${smallTextClasses} bullet`}>
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Soft Skills */}
            {data.skills.soft?.length > 0 && (
              <div>
                <p className="text-[12px] font-bold mb-1">Professional Skills</p>
                <ul className="ml-2 space-y-0.5">
                  {data.skills.soft.slice(0, 5).map((skill, idx) => (
                    <li key={idx} className={`${smallTextClasses} bullet`}>
                      • {skill}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* LANGUAGE SKILLS - EUROPASS SPECIAL */}
        {data.skills?.languages && data.skills.languages.length > 0 && (
          <div className="mb-3">
            <h3 className={sectionTitleClasses}>Language Skills</h3>
            <div className="space-y-1.5">
              {data.skills.languages.map((language, idx) => {
                // Expecting format like "English: C2" or just "English"
                const [lang, level] = language.split(":").map((s) => s.trim())
                const ceferLevel = level?.toUpperCase() as keyof typeof CEFR_LEVELS || "B1"
                const ceferInfo = CEFR_LEVELS[ceferLevel]

                return (
                  <div key={idx} className="mb-2">
                    <p className="text-[12px] font-bold">{lang || language}</p>
                    {ceferInfo && (
                      <p className={`${smallTextClasses}`}>
                        {ceferInfo.label} ({ceferInfo.description.split("(")[1]?.replace(")", "")}
                      </p>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )}

      </div>

      {/* ========== MAIN CONTENT (70%) ========== */}
      <div className={`${mainBg} ${mainText} w-[70%] p-6`} style={{ fontSize: "11px", lineHeight: "1.35" }}>
        
        {/* Header: Full Name */}
        {data.personal?.fullName && (
          <div className="text-center mb-3">
            <h1 className="text-[18px] font-bold mb-2">{data.personal.fullName}</h1>
            {data.personal.address && (
              <p className={smallTextClasses}>{data.personal.address}</p>
            )}
          </div>
        )}

        {/* Summary / Professional Profile */}
        {data.personal?.summary && (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Professional Summary</h2>
            <p className={`${bodyTextClasses} text-justify`}>{data.personal.summary}</p>
          </div>
        )}

        {/* WORK EXPERIENCE */}
        {data.experience?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Work Experience</h2>
            {data.experience.items.map((exp, index) => (
              <div key={exp.id || index} className="mb-2">
                <div className="flex justify-between items-baseline">
                  <p className={`${itemTitleClasses}`}>
                    {exp.position && exp.company ? `${exp.position} at ${exp.company}` : exp.company || exp.position}
                  </p>
                </div>
                {exp.location && (
                  <p className={`${smallTextClasses} mb-0.5`}>{exp.location}</p>
                )}
                {exp.duration && (
                  <p className={`${smallTextClasses} italic mb-1`}>{exp.duration}</p>
                )}
                {exp.responsibilities && (
                  <div className="ml-2">
                    {exp.responsibilities.split("\n").map((line, idx) => {
                      const cleaned = line.trim().replace(/^[-–•]\s*/, "")
                      if (!cleaned) return null
                      return (
                        <p key={idx} className={`${bodyTextClasses} mb-0.5`}>
                          • {cleaned}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* EDUCATION */}
        {data.education?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Education</h2>
            {data.education.items.map((edu, index) => (
              <div key={edu.id || index} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <p className={itemTitleClasses}>{edu.title}</p>
                  {edu.year && <span className={smallTextClasses}>{edu.year}</span>}
                </div>
                {edu.institution && (
                  <p className={bodyTextClasses}>{edu.institution}</p>
                )}
                {edu.location && (
                  <p className={smallTextClasses}>{edu.location}</p>
                )}
                {edu.honors && (
                  <p className={smallTextClasses} style={{ fontStyle: "italic" }}>
                    Honors: {edu.honors}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* CERTIFICATIONS */}
        {data.certifications?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Certifications</h2>
            {data.certifications.items.map((cert, index) => (
              <div key={cert.id || index} className="mb-1">
                <p className={itemTitleClasses}>{cert.name}</p>
                {cert.issuer && (
                  <p className={bodyTextClasses}>by {cert.issuer}</p>
                )}
                {cert.date && (
                  <p className={smallTextClasses}>({new Date(cert.date).getFullYear()})</p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* PROJECTS */}
        {data.projects?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Projects</h2>
            {data.projects.items.map((project, index) => (
              <div key={project.id || index} className="mb-1.5">
                <div className="flex justify-between items-baseline">
                  <p className={itemTitleClasses}>{project.title}</p>
                  {project.duration && (
                    <span className={`${smallTextClasses} italic`}>{project.duration}</span>
                  )}
                </div>
                {project.description && (
                  <p className={`${bodyTextClasses} mb-0.5`}>{project.description}</p>
                )}
                {project.technologies && (
                  <p className={smallTextClasses}>
                    <span className="font-bold">Technologies:</span> {project.technologies}
                  </p>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* VOLUNTEERING */}
        {data.volunteering?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Volunteering and Community Activities</h2>
            {data.volunteering.items.map((vol, index) => (
              <div key={vol.id || index} className="mb-1.5">
                <p className={itemTitleClasses}>{vol.position}</p>
                {vol.organization && (
                  <p className={bodyTextClasses}>{vol.organization}</p>
                )}
                {vol.location && (
                  <span className={`${smallTextClasses} mr-2`}>{vol.location}</span>
                )}
                {vol.duration && (
                  <span className={`${smallTextClasses} italic`}>{vol.duration}</span>
                )}
                {vol.responsibilities && (
                  <div className="ml-2 mt-0.5">
                    {vol.responsibilities.split("\n").map((line, idx) => {
                      const cleaned = line.trim().replace(/^[-–•]\s*/, "")
                      if (!cleaned) return null
                      return (
                        <p key={idx} className={`${bodyTextClasses} mb-0.5`}>
                          • {cleaned}
                        </p>
                      )
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : null}

        {/* ACHIEVEMENTS */}
        {data.achievements?.items?.length ? (
          <div className="mb-3">
            <h2 className={mainSectionTitle}>Achievements and Recognition</h2>
            {data.achievements.items.map((achievement, index) => (
              <div key={achievement.id || index} className="mb-1">
                <p className={bodyTextClasses}>
                  {achievement.title && <span className="font-bold">{achievement.title}:</span>}
                  {achievement.title && achievement.description ? " " : ""}
                  {achievement.description}
                </p>
              </div>
            ))}
          </div>
        ) : null}

      </div>

      {/* Empty state */}
      {!data.personal?.fullName && (
        <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
          <p className="text-sm font-medium">Completa tu información personal para ver la vista previa</p>
        </div>
      )}
    </div>
  )
}
