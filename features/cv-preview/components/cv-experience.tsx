interface ExperienceItem {
  id: string
  position?: string
  company?: string
  location?: string
  duration?: string
  responsibilities?: string
}

interface CVExperienceProps {
  experience?: {
    items?: ExperienceItem[]
  }
}

export function CVExperience({ experience }: CVExperienceProps) {
  if (!experience?.items || experience.items.length === 0) return null

  return (
    <div className="mb-4">
      <h2 className="text-[16px] font-bold text-black mb-3 uppercase border-b border-black">
        EXPERIENCIA LABORAL
      </h2>
      {experience.items.map((exp, index) => (
        <div key={`${index}`} className="mb-3">
          <div className="flex justify-between items-start">
            <h3 className="text-[15px] font-bold text-black">{exp.company}</h3>
            <span className="text-[15px] text-black whitespace-nowrap ml-2 font-bold">{exp.location}</span>
          </div>
          <div className="flex justify-between items-start mb-1">
            <p className="text-[15px] text-black">{exp.position}</p>
            <span className="text-[15px] text-black whitespace-nowrap ml-2 italic">{exp.duration}</span>
          </div>
          <ul className="text-[15px] text-black leading-relaxed text-justify">
            {exp.responsibilities && exp.responsibilities
              .split("\n")
              .map((line, idx) => (
                <li key={idx} className="text-[15px] text-black leading-relaxed text-justify list-disc ml-6">
                  {line.replace(/^[-–•]\s*/, "")}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  )
}
