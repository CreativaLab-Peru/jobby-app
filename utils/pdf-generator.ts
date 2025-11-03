function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export function generatePDFContent(data, type: string) {
  let content = "";

  // Header with name
  if (data.personal?.fullName) {
    content += `
      <div class="header">
        <h1>${escapeHtml(data.personal.fullName)}</h1>
      </div>
    `;
  }

  // Contact
  if (data.personal && (data.personal.address || data.personal.linkedin || data.personal.phone || data.personal.email)) {
    const contactParts = [
      data.personal.address ? escapeHtml(data.personal.address) : null,
      data.personal.linkedin
        ? `<a href="${escapeHtml(
            data.personal.linkedin.startsWith("http")
              ? data.personal.linkedin
              : "https://" + data.personal.linkedin
          )}" target="_blank" rel="noopener noreferrer" style="color: #2563eb; text-decoration: none;">${escapeHtml(
            data.personal.linkedin
          )}</a>`
        : null,
      data.personal.phone ? escapeHtml(data.personal.phone) : null,
      data.personal.email ? escapeHtml(data.personal.email) : null,
    ]
      .filter(Boolean)
      .join(" • ");

    content += `
      <div class="contact-section">
        <p class="contact-info">${contactParts}</p>
        <hr class="divider" />
      </div>
    `;
  }

  // Summary
  if (data.personal?.summary) {
    content += `
      <div class="summary-section">
        <p class="summary">${escapeHtml(data.personal.summary)}</p>
      </div>
    `;
  }

  // Experience or Projects
  const isAcademicType = type === "becas" || type === "practicas" || type === "intercambios";

  if (isAcademicType) {
    if (data.projects?.items && data.projects.items.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">PROYECTOS ACADÉMICOS</div>
          ${data.projects.items
            .map(
              (project) => `
              <div class="project-item">
                <div class="item-header">
                  <div>
                    <div class="item-title">${escapeHtml(project.title || "")}</div>
                  </div>
                  <div class="item-date">${escapeHtml(project.duration || "")}</div>
                </div>
                <div class="item-description">${escapeHtml(project.description || "")}</div>
                ${
                  project.technologies
                    ? `<div class="item-description"><strong>Tecnologías:</strong> ${escapeHtml(project.technologies)}</div>`
                    : ""
                }
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }

    if (data.volunteering?.items && data.volunteering.items.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">VOLUNTARIADOS Y ACTIVIDADES COMUNITARIAS</div>
          ${data.volunteering.items
            .map(
              (vol) => `
              <div class="experience-item">
                <div class="item-header">
                  <div class="item-title-bold">${escapeHtml(vol.organization || "")}</div>
                  <div class="item-location-bold">${escapeHtml(vol.location || "")}</div>
                </div>
                <div class="item-subheader">
                  <div class="item-position">${escapeHtml(vol.position || "")}</div>
                  <div class="item-date-italic">${escapeHtml(vol.duration || "")}</div>
                </div>
                <ul class="responsibilities-list">
                  ${
                    vol.responsibilities
                      ? vol.responsibilities
                          .split("\n")
                          .map((line: string) => `<li>${escapeHtml(line.replace(/^[-–•]\s*/, ""))}</li>`)
                          .join("")
                      : ""
                  }
                </ul>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }
  } else {
    if (data.experience?.items && data.experience.items.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">EXPERIENCIA LABORAL</div>
          ${data.experience.items
            .map(
              (exp) => `
              <div class="experience-item">
                <div class="item-header">
                  <div class="item-title-bold">${escapeHtml(exp.company || "")}</div>
                  <div class="item-location-bold">${escapeHtml(exp.location || "")}</div>
                </div>
                <div class="item-subheader">
                  <div class="item-position">${escapeHtml(exp.position || "")}</div>
                  <div class="item-date-italic">${escapeHtml(exp.duration || "")}</div>
                </div>
                <ul class="responsibilities-list">
                  ${
                    exp.responsibilities
                      ? exp.responsibilities
                          .split("\n")
                          .map((line: string) => `<li>${escapeHtml(line.replace(/^[-–•]\s*/, ""))}</li>`)
                          .join("")
                      : ""
                  }
                </ul>
              </div>
            `
            )
            .join("")}
        </div>
      `;
    }
  }

  // Education
  if (data.education?.items && data.education.items.length > 0) {
    content += `
      <div class="section">
        <div class="section-title">EDUCACIÓN</div>
        ${data.education.items
          .map(
            (edu) => `
            <div class="education-item">
              <div class="item-header">
                <div class="item-title-bold">${escapeHtml(edu.institution || "")}</div>
                <div class="item-location">${escapeHtml(edu.location || "")}</div>
              </div>
              <div class="item-subheader">
                <div class="item-degree">${escapeHtml(edu.title || "")}</div>
                <div class="item-date-italic">${escapeHtml(edu.year || "")}</div>
              </div>
              ${
                edu.honors
                  ? `
                <ul class="item-details">
                  <li>Honores: ${escapeHtml(edu.honors)}</li>
                </ul>
              `
                  : ""
              }
            </div>
          `
          )
          .join("")}
      </div>
    `;
  }

  // Certifications or Achievements
  if (isAcademicType) {
    if (data.achievements?.items && data.achievements.items.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">LOGROS Y RECONOCIMIENTOS</div>
          <div class="item-description">
            ${data.achievements.items
              .map(
                (achievement) =>
                  `${escapeHtml(achievement.title || "")}: ${escapeHtml(achievement.description || "")}`
              )
              .join(". ")}
          </div>
        </div>
      `;
    }
  } else {
    if (data.certifications?.items && data.certifications.items.length > 0) {
      content += `
        <div class="section">
          <div class="section-title">LICENCIAS Y CERTIFICACIONES</div>
          <div class="item-description">
            ${data.certifications.items
              .map(
                (cert) => `${escapeHtml(cert.name || "")} - ${escapeHtml(cert.issuer || "")}`
              )
              .join(". ")}
          </div>
        </div>
      `;
    }
  }

  // Skills
  if (data.skills && (data.skills.technical || data.skills.soft || data.skills.languages)) {
    content += `
      <div class="section">
        <div class="section-title">HABILIDADES PROFESIONALES Y PERSONALES</div>
        <div class="skills-section">
          ${
            data.skills.languages
              ? `<div class="skills-category"><strong>Idiomas:</strong> ${data.skills.languages
                  .map((lang: string) => escapeHtml(lang))
                  .join(", ")}</div>`
              : ""
          }
          ${
            data.skills.technical
              ? `<div class="skills-category"><strong>Habilidades Técnicas:</strong> ${data.skills.technical
                  .map((tech: string) => escapeHtml(tech))
                  .join(", ")}</div>`
              : ""
          }
          ${
            data.skills.soft
              ? `<div class="skills-category"><strong>Habilidades Blandas:</strong> ${data.skills.soft
                  .map((soft: string) => escapeHtml(soft))
                  .join(", ")}</div>`
              : ""
          }
        </div>
      </div>
    `;
  }

  return content;
}
