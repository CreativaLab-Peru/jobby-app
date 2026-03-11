"use client";

import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";
import type { CVData, CVSection } from "@/types/cv";
import { linkedinDisplay } from "@/lib/utils";

// Font Arial - Same as Harvard version
Font.register({
  family: "Arial",
  fonts: [
    { src: path.resolve("/fonts/Arial/ARIAL.TTF"), fontWeight: "normal", fontStyle: "normal" },
    { src: path.resolve("/fonts/Arial/ARIALI.TTF"), fontWeight: "normal", fontStyle: "italic" },
    { src: path.resolve("/fonts/Arial/ARIALBD.TTF"), fontWeight: "bold", fontStyle: "normal" },
    { src: path.resolve("/fonts/Arial/ARIALBI.TTF"), fontWeight: "bold", fontStyle: "italic" },
  ],
});

// CEFR Levels
const CEFR_LEVELS: Record<string, { label: string; description: string }> = {
  A1: { label: "A1", description: "Elementary user" },
  A2: { label: "A2", description: "Elementary user" },
  B1: { label: "B1", description: "Independent user" },
  B2: { label: "B2", description: "Independent user" },
  C1: { label: "C1", description: "Proficient user" },
  C2: { label: "C2", description: "Proficient user" },
};

const styles = StyleSheet.create({
  // Page layout: flexbox with two columns
  page: {
    display: "flex",
    flexDirection: "row",
    fontFamily: "Arial",
    fontSize: 11,
  },

  // SIDEBAR (30%)
  sidebar: {
    width: "30%",
    backgroundColor: "#0B5394",
    color: "#FFFFFF",
    padding: 18,
    fontSize: 10.5,
    lineHeight: 1.4,
  },

  sidebarHeader: {
    textAlign: "center",
    marginBottom: 12,
  },

  europassTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    letterSpacing: 1,
  },

  sidebarDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#FFFFFF",
    marginBottom: 12,
    marginTop: 4,
  },

  contactInfo: {
    textAlign: "center",
    marginBottom: 8,
    fontSize: 9,
    lineHeight: 1.5,
  },

  sidebarSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    marginTop: 8,
    marginBottom: 6,
    textTransform: "uppercase",
  },

  skillCategory: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 4,
    marginTop: 4,
  },

  skillItem: {
    fontSize: 9,
    marginLeft: 8,
    marginBottom: 2,
  },

  languageItem: {
    marginBottom: 6,
  },

  languageName: {
    fontSize: 10,
    fontWeight: "bold",
    marginBottom: 2,
  },

  languageLevel: {
    fontSize: 9,
    marginBottom: 1,
  },

  languageLevelDescription: {
    fontSize: 8,
    fontStyle: "italic",
  },

  // MAIN CONTENT (70%)
  mainContent: {
    width: "70%",
    backgroundColor: "#FFFFFF",
    color: "#111111",
    padding: 18,
    fontSize: 11,
    lineHeight: 1.35,
  },

  headerSection: {
    textAlign: "center",
    marginBottom: 8,
  },

  fullName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },

  address: {
    fontSize: 9,
    marginBottom: 8,
  },

  mainSectionTitle: {
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
    borderBottomWidth: 1,
    borderBottomColor: "#000000",
    paddingBottom: 4,
    marginTop: 6,
    marginBottom: 6,
  },

  entryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },

  entryTitle: {
    fontSize: 10,
    fontWeight: "bold",
  },

  entrySubtitle: {
    fontSize: 10,
    marginBottom: 2,
  },

  entryDate: {
    fontSize: 9,
    fontStyle: "italic",
  },

  entryResponsibilities: {
    marginLeft: 8,
    marginBottom: 4,
  },

  bulletPoint: {
    fontSize: 10,
    marginBottom: 1,
    textAlign: "justify",
  },

  educationItem: {
    marginBottom: 6,
  },

  certItem: {
    fontSize: 10,
    marginBottom: 3,
  },

  projectItem: {
    marginBottom: 6,
  },

  sectionSpace: {
    marginBottom: 0,
  },
});

export function CvDocumentEuropass({ data, sections }: { data: CVData; sections: CVSection[] }) {
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    experience: () =>
      data.experience?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>WORK EXPERIENCE</Text>
          {data.experience.items.map((exp, index) => (
            <View key={exp.id ?? index} style={{ marginBottom: 6 }}>
              <View style={styles.entryRow}>
                <View style={{ width: "70%" }}>
                  <Text style={styles.entryTitle}>
                    {exp.position && exp.company ? `${exp.position} at ${exp.company}` : exp.company || exp.position}
                  </Text>
                </View>
              </View>
              {exp.location && (
                <Text style={styles.entrySubtitle}>{exp.location}</Text>
              )}
              {exp.duration && (
                <Text style={styles.entryDate}>{exp.duration}</Text>
              )}
              {exp.responsibilities && (
                <View style={styles.entryResponsibilities}>
                  {exp.responsibilities.split("\n").map((line, idx) => {
                    const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                    if (!cleaned) return null;
                    return (
                      <Text key={idx} style={styles.bulletPoint}>
                        • {cleaned}
                      </Text>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>EDUCATION</Text>
          {data.education.items.map((edu, index) => (
            <View key={edu.id ?? index} style={styles.educationItem}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>{edu.title}</Text>
                {edu.year && <Text style={styles.entryDate}>{edu.year}</Text>}
              </View>
              {edu.institution && (
                <Text style={styles.entrySubtitle}>{edu.institution}</Text>
              )}
              {edu.location && (
                <Text style={{ fontSize: 9, marginBottom: 2 }}>{edu.location}</Text>
              )}
              {edu.honors && (
                <Text style={{ fontSize: 9, fontStyle: "italic" }}>
                  Honors: {edu.honors}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>CERTIFICATIONS</Text>
          {data.certifications.items.map((cert, index) => (
            <View key={cert.id ?? index} style={styles.certItem}>
              <Text style={styles.entryTitle}>{cert.name}</Text>
              {cert.issuer && (
                <Text style={{ fontSize: 10 }}>by {cert.issuer}</Text>
              )}
              {cert.date && (
                <Text style={{ fontSize: 9 }}>
                  ({new Date(cert.date).getFullYear()})
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>PROJECTS</Text>
          {data.projects.items.map((project, index) => (
            <View key={project.id ?? index} style={styles.projectItem}>
              <View style={styles.entryRow}>
                <Text style={styles.entryTitle}>{project.title}</Text>
                {project.duration && (
                  <Text style={styles.entryDate}>{project.duration}</Text>
                )}
              </View>
              {project.description && (
                <Text style={{ fontSize: 10, marginBottom: 2, textAlign: "justify" }}>
                  {project.description}
                </Text>
              )}
              {project.technologies && (
                <Text style={{ fontSize: 9 }}>
                  <Text style={{ fontWeight: "bold" }}>Technologies:</Text> {project.technologies}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>VOLUNTEERING</Text>
          {data.volunteering.items.map((vol, index) => (
            <View key={vol.id ?? index} style={{ marginBottom: 6 }}>
              <Text style={styles.entryTitle}>{vol.position}</Text>
              {vol.organization && (
                <Text style={styles.entrySubtitle}>{vol.organization}</Text>
              )}
              {vol.location && (
                <Text style={{ fontSize: 9, marginBottom: 1 }}>{vol.location}</Text>
              )}
              {vol.duration && (
                <Text style={styles.entryDate}>{vol.duration}</Text>
              )}
              {vol.responsibilities && (
                <View style={styles.entryResponsibilities}>
                  {vol.responsibilities.split("\n").map((line, idx) => {
                    const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                    if (!cleaned) return null;
                    return (
                      <Text key={idx} style={styles.bulletPoint}>
                        • {cleaned}
                      </Text>
                    );
                  })}
                </View>
              )}
            </View>
          ))}
        </View>
      ) : null,

    achievements: () =>
      data.achievements?.items?.length ? (
        <View style={styles.sectionSpace}>
          <Text style={styles.mainSectionTitle}>ACHIEVEMENTS</Text>
          {data.achievements.items.map((ach, index) => (
            <View key={ach.id ?? index} style={{ marginBottom: 3 }}>
              <Text style={{ fontSize: 10 }}>
                {ach.title && <Text style={{ fontWeight: "bold" }}>{ach.title}:</Text>}
                {ach.title && ach.description ? " " : ""}
                {ach.description}
              </Text>
            </View>
          ))}
        </View>
      ) : null,

    skills: () => null, // Skills rendered in sidebar, not main content
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* ========== SIDEBAR ========== */}
        <View style={styles.sidebar}>
          {/* Header */}
          <View style={styles.sidebarHeader}>
            <Text style={styles.europassTitle}>EUROPASS</Text>
            <View style={styles.sidebarDivider} />
          </View>

          {/* Contact Info */}
          {data.personal && (
            <View style={styles.contactInfo}>
              {data.personal.phone && <Text>{data.personal.phone}</Text>}
              {data.personal.email && <Text>{data.personal.email}</Text>}
              {data.personal.linkedin && (
                <Text>{linkedinDisplay(data.personal.linkedin)}</Text>
              )}
              <View style={styles.sidebarDivider} />
            </View>
          )}

          {/* SKILLS AND COMPETENCIES */}
          {data.skills && (data.skills.technical?.length > 0 || data.skills.soft?.length > 0) && (
            <View>
              <Text style={styles.sidebarSectionTitle}>SKILLS AND COMPETENCIES</Text>

              {data.skills.technical?.length > 0 && (
                <View>
                  <Text style={styles.skillCategory}>Digital Marketing</Text>
                  {data.skills.technical.slice(0, 5).map((skill, idx) => (
                    <Text key={idx} style={styles.skillItem}>
                      • {skill}
                    </Text>
                  ))}
                </View>
              )}

              {data.skills.soft?.length > 0 && (
                <View style={{ marginTop: 4 }}>
                  <Text style={styles.skillCategory}>Professional Skills</Text>
                  {data.skills.soft.slice(0, 5).map((skill, idx) => (
                    <Text key={idx} style={styles.skillItem}>
                      • {skill}
                    </Text>
                  ))}
                </View>
              )}
            </View>
          )}

          {/* LANGUAGE SKILLS */}
          {data.skills?.languages && data.skills.languages.length > 0 && (
            <View style={{ marginTop: 8 }}>
              <Text style={styles.sidebarSectionTitle}>LANGUAGE SKILLS</Text>
              {data.skills.languages.map((language, idx) => {
                const [lang, level] = language.split(":").map((s) => s.trim());
                const ceferLevel = level?.toUpperCase() as keyof typeof CEFR_LEVELS || "B1";
                const ceferInfo = CEFR_LEVELS[ceferLevel];

                return (
                  <View key={idx} style={styles.languageItem}>
                    <Text style={styles.languageName}>{lang || language}</Text>
                    {ceferInfo && (
                      <>
                        <Text style={styles.languageLevel}>{ceferInfo.label}</Text>
                        <Text style={styles.languageLevelDescription}>
                          {ceferInfo.description}
                        </Text>
                      </>
                    )}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* ========== MAIN CONTENT ========== */}
        <View style={styles.mainContent}>
          {/* Header */}
          {data.personal?.fullName && (
            <View style={styles.headerSection}>
              <Text style={styles.fullName}>{data.personal.fullName}</Text>
              {data.personal.address && (
                <Text style={styles.address}>{data.personal.address}</Text>
              )}
            </View>
          )}

          {/* Summary */}
          {data.personal?.summary && (
            <View style={{ marginBottom: 6 }}>
              <Text style={styles.mainSectionTitle}>PROFESSIONAL SUMMARY</Text>
              <Text style={{ textAlign: "justify" }}>{data.personal.summary}</Text>
            </View>
          )}

          {/* Sections */}
          <View>
            {sections.map((section) => {
              const renderer = sectionRenderers[section.id];
              if (!renderer) return null;
              return <View key={section.id}>{renderer()}</View>;
            })}
          </View>
        </View>
      </Page>
    </Document>
  );
}
