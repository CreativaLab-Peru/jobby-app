import {
  Document,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
} from "docx"

export function generateWordDocument(data, type: string) {
  const isAcademicType = type === "becas" || type === "practicas" || type === "intercambios"

  const doc = new Document({
    sections: [
      {
        properties: {},
        children: [
          // Header with name
          ...(data.personal?.fullName
            ? [
                new Paragraph({
                  text: data.personal.fullName.toUpperCase(),
                  heading: HeadingLevel.HEADING_1,
                  spacing: {
                    after: 400,
                  },
                }),
              ]
            : []),

          // Summary
          ...(data.personal?.summary
            ? [
                new Paragraph({
                  text: data.personal.summary,
                  spacing: {
                    after: 400,
                  },
                  alignment: AlignmentType.JUSTIFIED,
                }),
                new Paragraph({
                  text: "",
                  border: {
                    bottom: {
                      color: "#000000",
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                  spacing: {
                    after: 400,
                  },
                }),
              ]
            : []),

          // Contact
          ...(data.personal
            ? [
                new Paragraph({
                  text: "CONTACTO",
                  heading: HeadingLevel.HEADING_2,
                  spacing: {
                    after: 200,
                  },
                  border: {
                    bottom: {
                      color: "#000000",
                      style: BorderStyle.SINGLE,
                      size: 1,
                    },
                  },
                }),
                new Paragraph({
                  text: `${data.personal.phone || ""} - ${data.personal.email || ""}`,
                  spacing: {
                    after: 400,
                  },
                }),
              ]
            : []),

          // Experience or Projects
          ...(isAcademicType ? generateProjectsSection(data.projects) : generateExperienceSection(data.experience)),

          // Volunteering
          ...generateVolunteeringSection(data.volunteering),

          // Education
          ...generateEducationSection(data.education),

          // Achievements or Certifications
          ...(isAcademicType
            ? generateAchievementsSection(data.achievements)
            : generateCertificationsSection(data.certifications)),

          // Skills
          ...generateSkillsSection(data.skills),
        ],
      },
    ],
  })

  return doc
}

function generateProjectsSection(projects) {
  if (!projects?.items || projects.items.length === 0) return []

  return [
    new Paragraph({
      text: "PROYECTOS ACADÉMICOS",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    ...projects.items.flatMap((project) => [
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: project.title || "",
                  }),
                ],
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: project.duration || "",
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ],
          }),
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
      }),
      new Paragraph({
        text: project.description || "",
        spacing: {
          after: 200,
        },
        alignment: AlignmentType.JUSTIFIED,
      }),
      ...(project.technologies
        ? [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Tecnologías: ",
                  bold: true,
                }),
                new TextRun({
                  text: project.technologies,
                }),
              ],
              spacing: {
                after: 400,
              },
            }),
          ]
        : []),
    ]),
  ]
}

function generateVolunteeringSection(volunteering) {
  if (!volunteering?.items || volunteering.items.length === 0) return []

  return [
    new Paragraph({
      text: "VOLUNTARIADOS Y ACTIVIDADES COMUNITARIAS",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    ...volunteering.items.flatMap((vol) => [
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: vol.organization || "",
                        bold: true,
                      }),
                    ],
                  }),
                ],
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: vol.location || "",
                        bold: true,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ],
          }),
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: vol.position || "",
                  }),
                ],
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    children: [
                      new TextRun({
                        text: vol.duration || "",
                        italics: true,
                      }),
                    ],
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ],
          }),
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
      }),
      ...(vol.responsibilities
        ? vol.responsibilities.split("\n").map(
            (line: string) =>
              new Paragraph({
                text: line.replace(/^[-–•]\s*/, ""),
                bullet: {
                  level: 0,
                },
                spacing: {
                  after: 100,
                },
                alignment: AlignmentType.JUSTIFIED,
              })
          )
        : []),
      new Paragraph({
        text: "",
        spacing: {
          after: 200,
        },
      }),
    ]),
  ]
}

function generateExperienceSection(experience) {
  if (!experience?.items || experience.items.length === 0) return []

  return [
    new Paragraph({
      text: "EXPERIENCIA LABORAL",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    ...experience.items.flatMap((exp) => [
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: exp.position || "",
                  }),
                ],
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: exp.duration || "",
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ],
          }),
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
      }),
      new Paragraph({
        text: exp.company || "",
        spacing: {
          after: 200,
        },
      }),
      new Paragraph({
        text: exp.responsibilities || "",
        spacing: {
          after: 400,
        },
        alignment: AlignmentType.JUSTIFIED,
      }),
    ]),
  ]
}

function generateEducationSection(education) {
  if (!education?.items || education.items.length === 0) return []

  return [
    new Paragraph({
      text: "EDUCACIÓN",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    ...education.items.flatMap((edu) => [
      new Table({
        width: {
          size: 100,
          type: WidthType.PERCENTAGE,
        },
        rows: [
          new TableRow({
            children: [
              new TableCell({
                children: [
                  new Paragraph({
                    text: edu.institution || "",
                  }),
                ],
                width: {
                  size: 70,
                  type: WidthType.PERCENTAGE,
                },
              }),
              new TableCell({
                children: [
                  new Paragraph({
                    text: edu.year || "",
                    alignment: AlignmentType.RIGHT,
                  }),
                ],
                width: {
                  size: 30,
                  type: WidthType.PERCENTAGE,
                },
              }),
            ],
          }),
        ],
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
          insideHorizontal: { style: BorderStyle.NONE },
          insideVertical: { style: BorderStyle.NONE },
        },
      }),
      new Paragraph({
        text: edu.degree || "",
        spacing: {
          after: 200,
        },
      }),
      ...(edu.gpa
        ? [
            new Paragraph({
              text: `Promedio: ${edu.gpa}`,
              spacing: {
                after: 100,
              },
              indent: {
                left: 720,
              },
            }),
          ]
        : []),
      ...(edu.status && edu.status !== "Completado"
        ? [
            new Paragraph({
              text: edu.status,
              spacing: {
                after: 400,
              },
              indent: {
                left: 720,
              },
            }),
          ]
        : []),
    ]),
  ]
}

function generateAchievementsSection(achievements) {
  if (!achievements?.items || achievements.items.length === 0) return []

  return [
    new Paragraph({
      text: "LOGROS Y RECONOCIMIENTOS",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    new Paragraph({
      text: achievements.items
        .map((achievement) => `${achievement.title || ""}: ${achievement.description || ""}`)
        .join(". "),
      spacing: {
        after: 400,
      },
      alignment: AlignmentType.JUSTIFIED,
    }),
  ]
}

function generateCertificationsSection(certifications) {
  if (!certifications?.items || certifications.items.length === 0) return []

  return [
    new Paragraph({
      text: "LICENCIAS Y CERTIFICACIONES",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    new Paragraph({
      text: certifications.items.map((cert) => `${cert.name || ""} - ${cert.issuer || ""}`).join(". "),
      spacing: {
        after: 400,
      },
      alignment: AlignmentType.JUSTIFIED,
    }),
  ]
}

function generateSkillsSection(skills) {
  if (!skills || (!skills.technical && !skills.soft && !skills.languages)) return []

  return [
    new Paragraph({
      text: "HABILIDADES PROFESIONALES Y PERSONALES",
      heading: HeadingLevel.HEADING_2,
      spacing: {
        after: 200,
      },
      border: {
        bottom: {
          color: "#000000",
          style: BorderStyle.SINGLE,
          size: 1,
        },
      },
    }),
    ...(skills.languages
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "Idiomas: ",
                bold: true,
              }),
              new TextRun({
                text: skills.languages.join(", "),
              }),
            ],
            spacing: {
              after: 200,
            },
          }),
        ]
      : []),
    ...(skills.technical
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "Habilidades Técnicas: ",
                bold: true,
              }),
              new TextRun({
                text: skills.technical.join(", "),
              }),
            ],
            spacing: {
              after: 200,
            },
          }),
        ]
      : []),
    ...(skills.soft
      ? [
          new Paragraph({
            children: [
              new TextRun({
                text: "Habilidades Blandas: ",
                bold: true,
              }),
              new TextRun({
                text: skills.soft.join(", "),
              }),
            ],
            spacing: {
              after: 200,
            },
          }),
        ]
      : []),
  ]
}
