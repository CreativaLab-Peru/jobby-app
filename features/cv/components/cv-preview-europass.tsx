"use client"

import React from "react"
import { CVData, CVSection } from "@/types/cv"
import { linkedinHref, linkedinDisplay } from "@/lib/utils"
import { Phone, Mail, Linkedin, MapPin } from "lucide-react"

interface CVPreviewEuropassProps {
  data: CVData
  sections: CVSection[]
}

const EU_BLUE = "#003FA3"
const BORDER_COLOR = "#2596be"
const GOLD = "#FFCC00"

function EuFlagSvg({ width = 38, height = 26 }: { width?: number; height?: number }) {
  const cx = width / 2
  const cy = height / 2
  const circleR = Math.min(width, height) * 0.28
  const outerR = Math.min(width, height) * 0.072
  const innerR = outerR * 0.39
  const starPaths = Array.from({ length: 12 }, (_, i) => {
    const angle = (i * 30 - 90) * (Math.PI / 180)
    const scx = cx + circleR * Math.cos(angle)
    const scy = cy + circleR * Math.sin(angle)
    return (
      Array.from({ length: 10 }, (_, j) => {
        const a = (j * 36 - 90) * (Math.PI / 180)
        const r = j % 2 === 0 ? outerR : innerR
        return `${j === 0 ? "M" : "L"} ${(scx + r * Math.cos(a)).toFixed(2)} ${(scy + r * Math.sin(a)).toFixed(2)}`
      }).join(" ") + " Z"
    )
  })
  return (
    <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      <rect x="0" y="0" width={width} height={height} fill={EU_BLUE} />
      {starPaths.map((d, i) => (
        <path key={i} d={d} fill={GOLD} />
      ))}
    </svg>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div
      className="text-[11px] font-bold uppercase pb-0 mt-[9px] mb-[5px] border-b border-black"
      style={{ color: EU_BLUE }}
    >
      {children}
    </div>
  )
}

function parseLines(text: string): Array<{ type: "bullet" | "subheading"; text: string }> {
  return text
    .split("\n")
    .map((line) => {
      const raw = line.trim().replace(/^[-–•·]\s*/, "")
      if (!raw) return null
      if (/^[A-ZÁÉÍÓÚÑa-záéíóúñ][^:]{2,39}:$/.test(raw)) return { type: "subheading" as const, text: raw }
      return { type: "bullet" as const, text: raw }
    })
    .filter(Boolean) as Array<{ type: "bullet" | "subheading"; text: string }>
}

function BulletList({ text }: { text: string }) {
  const lines = parseLines(text)
  return (
    <div className="mt-[2px]">
      {lines.map((item, idx) =>
        item.type === "subheading" ? (
          <p key={idx} className="text-[9px] font-bold mt-[3px] mb-[1px] ml-1">
            {item.text}
          </p>
        ) : (
          <div key={idx} className="flex ml-1 mb-[1.5px]">
            <span className="text-[10px] w-[10px] flex-shrink-0 text-[#444]">·</span>
            <span className="text-[9px] text-justify leading-[1.4]">{item.text}</span>
          </div>
        )
      )}
    </div>
  )
}

export function CVPreviewEuropass({ data, sections }: CVPreviewEuropassProps) {
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    experience: () =>
      data.experience?.items?.length ? (
        <div>
          <SectionTitle>EXPERIENCIA LABORAL</SectionTitle>
          {data.experience.items.map((exp, i) => (
            <div key={exp.id || i} className="mb-[6px]">
              {exp.position && (
                <p className="text-[10px] font-bold" style={{ color: EU_BLUE }}>
                  {exp.position}
                </p>
              )}
              {(exp.company || exp.duration) && (
                <p className="text-[10px] italic mb-[2px]">
                  {[exp.company, exp.duration ? `[ ${exp.duration} ]` : ""].filter(Boolean).join("  ")}
                </p>
              )}
              {exp.location && (
                <p className="text-[9px] mb-[2.5px]">
                  <span className="font-bold">Población: </span>
                  {exp.location}
                </p>
              )}
              {exp.responsibilities && <BulletList text={exp.responsibilities} />}
            </div>
          ))}
        </div>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <div>
          <SectionTitle>EDUCACIÓN Y FORMACIÓN</SectionTitle>
          {data.education.items.map((edu, i) => (
            <div key={edu.id || i} className="mb-[6px]">
              {edu.title && (
                <p className="text-[10px] font-bold" style={{ color: EU_BLUE }}>
                  {edu.title}
                </p>
              )}
              {(edu.institution || edu.year) && (
                <p className="text-[10px] italic mb-[2px]">
                  {[edu.institution, edu.year ? `[ ${edu.year} ]` : ""].filter(Boolean).join("  ")}
                </p>
              )}
              {edu.location && (
                <p className="text-[9px] mb-[1px]">
                  <span className="font-bold">Población: </span>
                  {edu.location}
                </p>
              )}
              {edu.honors && (
                <p className="text-[9px] mb-[1px]">
                  <span className="font-bold">Mención: </span>
                  {edu.honors}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null,

    skills: () =>
      data.skills && (data.skills.technical?.length || data.skills.soft?.length || data.skills.languages?.length) ? (
        <div>
          <SectionTitle>COMPETENCIAS</SectionTitle>
          {data.skills.technical?.length ? (
            <div className="mb-[3px]">
              <p className="text-[10px] font-bold mt-[4px] mb-[3px]">Competencias técnicas</p>
              {data.skills.technical.map((s, i) => (
                <p key={i} className="text-[9px] ml-2 mb-[1.5px]">
                  · {s}
                </p>
              ))}
            </div>
          ) : null}
          {data.skills.soft?.length ? (
            <div className="mb-[3px]">
              <p className="text-[10px] font-bold mt-[4px] mb-[3px]">Competencias transversales</p>
              {data.skills.soft.map((s, i) => (
                <p key={i} className="text-[9px] ml-2 mb-[1.5px]">
                  · {s}
                </p>
              ))}
            </div>
          ) : null}
          {data.skills.languages?.length ? (
            <div className="mb-[3px]">
              <p className="text-[10px] font-bold mt-[4px] mb-[3px]">Idiomas</p>
              {data.skills.languages.map((lang, i) => {
                const [name, level] = lang.split(":").map((s) => s.trim())
                return (
                  <p key={i} className="text-[9px] ml-2 mb-[1.5px]">
                    · {name}
                    {level ? ` — ${level}` : ""}
                  </p>
                )
              })}
            </div>
          ) : null}
        </div>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <div>
          <SectionTitle>PROYECTOS</SectionTitle>
          {data.projects.items.map((p, i) => (
            <div key={p.id || i} className="mb-[6px]">
              {p.title && (
                <p className="text-[10px] font-bold" style={{ color: EU_BLUE }}>
                  {p.title}
                </p>
              )}
              {p.duration && <p className="text-[10px] italic mb-[2px]">[ {p.duration} ]</p>}
              {p.description && (
                <p className="text-[9px] text-justify leading-[1.4]">{p.description}</p>
              )}
              {p.technologies && (
                <p className="text-[9px] mt-[1px]">
                  <span className="font-bold">Tecnologías: </span>
                  {p.technologies}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : null,

    achievements: () =>
      data.achievements?.items?.length ? (
        <div>
          <SectionTitle>LOGROS Y RECONOCIMIENTOS</SectionTitle>
          {data.achievements.items.map((ach, i) => (
            <div key={ach.id || i} className="mb-[3px]">
              <p className="text-[9px]">
                {ach.title && <span className="font-bold">{ach.title}: </span>}
                {ach.description}
              </p>
            </div>
          ))}
        </div>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <div>
          <SectionTitle>CERTIFICACIONES</SectionTitle>
          {data.certifications.items.map((cert, i) => (
            <div key={cert.id || i} className="mb-[5px]">
              {cert.name && (
                <p className="text-[10px] font-bold" style={{ color: EU_BLUE }}>
                  {cert.name}
                </p>
              )}
              {cert.issuer && <p className="text-[9px]">por {cert.issuer}</p>}
              {cert.date && <p className="text-[9px]">{cert.date}</p>}
            </div>
          ))}
        </div>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <div>
          <SectionTitle>VOLUNTARIADO</SectionTitle>
          {data.volunteering.items.map((vol, i) => (
            <div key={vol.id || i} className="mb-[6px]">
              {vol.position && (
                <p className="text-[10px] font-bold" style={{ color: EU_BLUE }}>
                  {vol.position}
                </p>
              )}
              {(vol.organization || vol.duration) && (
                <p className="text-[10px] italic mb-[2px]">
                  {[vol.organization, vol.duration ? `[ ${vol.duration} ]` : ""].filter(Boolean).join("  ")}
                </p>
              )}
              {vol.location && (
                <p className="text-[9px] mb-[2.5px]">
                  <span className="font-bold">Población: </span>
                  {vol.location}
                </p>
              )}
              {vol.responsibilities && <BulletList text={vol.responsibilities} />}
            </div>
          ))}
        </div>
      ) : null,
  }

  return (
    <div
      className="relative bg-white min-h-[297mm] w-full"
      style={{ fontFamily: "Arial, sans-serif", fontSize: "10px", color: "#222" }}
    >
      {/* Marco tipo esquina ┌─┐└─┘ */}
      <div className="absolute left-0 right-0 top-0 h-[14px]" style={{ backgroundColor: BORDER_COLOR }} />
      <div className="absolute left-0 right-0 bottom-0 h-[14px]" style={{ backgroundColor: BORDER_COLOR }} />
      <div className="absolute left-0 top-0 w-[14px] h-[60px]" style={{ backgroundColor: BORDER_COLOR }} />
      <div className="absolute right-0 top-0 w-[14px] h-[60px]" style={{ backgroundColor: BORDER_COLOR }} />
      <div className="absolute left-0 bottom-0 w-[14px] h-[60px]" style={{ backgroundColor: BORDER_COLOR }} />
      <div className="absolute right-0 bottom-0 w-[14px] h-[60px]" style={{ backgroundColor: BORDER_COLOR }} />

      <div className="px-[30px] pt-[26px] pb-[26px]">
        {/* Logo Europass – arriba a la derecha */}
        <div className="flex justify-end items-center gap-[5px] mb-[10px]">
          <EuFlagSvg />
          <span className="text-[18px] font-bold" style={{ color: EU_BLUE }}>
            europass
          </span>
        </div>

        {/* Cabecera: foto + nombre + contacto */}
        <div className="flex items-start gap-[12px] mb-[8px]">
          {data.personal?.image && (
            <div className="relative w-[75px] h-[75px] rounded-full flex-shrink-0 overflow-hidden">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.personal.image}
                alt="foto"
                className="w-full h-full object-cover"
              />
              {/* Vignette overlay */}
              <div className="absolute inset-0 rounded-full" style={{ boxShadow: "inset 0 0 10px 3px rgba(0,0,0,0.20)" }} />
            </div>
          )}
          <div className="flex-1">
            <h1 className="text-[16px] font-bold mb-[5px]" style={{ color: EU_BLUE }}>
              {data.personal?.fullName ?? ""}
            </h1>

            {/* Fila 1: Nacionalidad + Teléfono */}
            <div className="flex flex-wrap items-center gap-x-[3px] mb-[2.5px]">
              {data.personal?.nationality && (
                <>
                  <span className="text-[9px] font-bold">Nacionalidad:</span>
                  <span className="text-[9px]">{data.personal.nationality}</span>
                  <span className="w-[14px]" />
                </>
              )}
              {data.personal?.phone && (
                <>
                  <Phone size={9} color={EU_BLUE} />
                  <span className="text-[9px] font-bold">Número de teléfono:</span>
                  <span className="text-[9px]">{data.personal.phone}</span>
                </>
              )}
            </div>

            {data.personal?.email && (
              <div className="flex flex-wrap items-center gap-x-[3px] mb-[2.5px]">
                <Mail size={9} color={EU_BLUE} />
                <span className="text-[9px] font-bold">Dirección de correo electrónico:</span>
                <span className="text-[9px]" style={{ color: EU_BLUE }}>
                  {data.personal.email}
                </span>
              </div>
            )}

            {data.personal?.linkedin && (
              <div className="flex flex-wrap items-center gap-x-[3px] mb-[2.5px]">
                <Linkedin size={9} color={EU_BLUE} />
                <span className="text-[9px] font-bold">LinkedIn:</span>
                <a
                  href={linkedinHref(data.personal.linkedin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[9px] underline"
                  style={{ color: EU_BLUE }}
                >
                  {linkedinDisplay(data.personal.linkedin)}
                </a>
              </div>
            )}

            {data.personal?.address && (
              <div className="flex flex-wrap items-center gap-x-[3px] mb-[2.5px]">
                <MapPin size={9} color={EU_BLUE} />
                <span className="text-[9px] font-bold">Domicilio:</span>
                <span className="text-[9px]">{data.personal.address}</span>
              </div>
            )}
          </div>
        </div>

        {/* SOBRE MÍ */}
        {data.personal?.summary && (
          <div>
            <SectionTitle>SOBRE MÍ</SectionTitle>
            <p className="text-[10px] font-bold text-justify leading-[1.5]">{data.personal.summary}</p>
          </div>
        )}

        {/* Secciones dinámicas */}
        {sections.map((section) => {
          const renderer = sectionRenderers[section.id]
          if (!renderer) return null
          const el = renderer()
          return el ? <div key={section.id}>{el}</div> : null
        })}
      </div>
    </div>
  )
}
