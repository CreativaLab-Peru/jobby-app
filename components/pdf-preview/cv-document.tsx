"use client"; // if used in client components (PDFViewer). Not needed if only server-generated.

import React from "react";
import {
  Document,
  Page,
  View,
  Text,
  StyleSheet,
  Font,
} from "@react-pdf/renderer";
import path from "path";
import type { CVData, CVSection } from "@/types/cv";

// OPTIONAL: register a custom font if you host one in /public/fonts
Font.register({
  family: "Inter",
  fonts: [
    { src: path.resolve("/fonts/Inter_18pt-Regular.ttf"), fontWeight: "normal", fontStyle: "normal" },
    { src: path.resolve("/fonts/Inter_18pt-Italic.ttf"), fontWeight: "normal", fontStyle: "italic" },
    { src: path.resolve("/fonts/Inter_18pt-Bold.ttf"), fontWeight: "bold", fontStyle: "normal" },
    { src: path.resolve("/public/fonts/Inter_18pt-BoldItalic.ttf"), fontWeight: "bold", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: "Inter",
    color: "#111",
    lineHeight: 1.35,
  },

  /* Header */
  header: { textAlign: "center", marginBottom: 6 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 16, letterSpacing: 0.5 },
  contactLine: {
    fontSize: 10,
    color: "#111",
    marginBottom: 6,
  },
  contactLink: {
    color: "#0b66c3",
    textDecoration: "underline",
  },

  thinRule: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginVertical: 6,
  },

  /* Summary */
  summaryText: {
    fontStyle: "italic",
    fontSize: 11,
    marginBottom: 8,
    textAlign: "justify",
  },

  /* Section header like HTML: left aligned, small, bold uppercase with bottom border */
  sectionHeader: {
    marginTop: 6,
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "bold",
    textTransform: "uppercase",
    marginBottom: 6,
  },
  sectionDivider: {
    borderBottomWidth: 1,
    borderBottomColor: "#000",
    marginBottom: 8,
  },

  /* Rows and columns */
  entryRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  entryLeft: { width: "66%" },
  entryRight: { width: "32%", textAlign: "right" },

  /* Fonts for entries */
  companyName: { fontSize: 11, fontWeight: "bold" },
  roleName: { fontSize: 11 },
  locationText: { fontSize: 10.5 },
  dateText: { fontSize: 10.5, fontStyle: "italic" },

  /* Bulleted list similar to list-disc */
  bulletItem: {
    fontSize: 10.5,
    marginBottom: 2,
    paddingLeft: 8,
    textAlign: "justify",
  },

  /* Education */
  eduRow: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  eduTopRow: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  eduInstitution: { fontWeight: "bold", fontSize: 11 },

  simpleList: { marginBottom: 6, fontSize: 10.5 },

  skillsLineLabel: { fontWeight: "bold", marginRight: 6 },
  skillsLine: { fontSize: 10.5, marginBottom: 4 },

  sectionSpace: { marginBottom: 0 },
});

export function CvDocument({ 
  data, 
  sections 
}: { 
  data: CVData;
  sections: CVSection[];
}) {
  // Crear un Set con los IDs de las secciones activas para búsqueda rápida
  const activeSectionIds = new Set(sections.map(s => s.id));

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Name + Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal?.fullName ?? ""}</Text>

          <Text style={styles.contactLine}>
            {data.personal?.address ? `${data.personal.address}` : ""}
            {(data.personal?.address && (data.personal?.linkedin || data.personal?.phone || data.personal?.email)) ? " • " : ""}
            {data.personal?.linkedin ? (
              <Text>
                <Text style={styles.contactLink}>
                  {data.personal.linkedin.startsWith("http")
                    ? data.personal.linkedin
                    : data.personal.linkedin}
                </Text>
                {(data.personal?.phone || data.personal?.email) ? " • " : ""}
              </Text>
            ) : null}
            {data.personal?.phone ? `${data.personal.phone}` : ""}
            {data.personal?.phone && data.personal?.email ? " • " : ""}
            {data.personal?.email ? `${data.personal.email}` : ""}
          </Text>
        </View>

        <View style={styles.thinRule} />

        {/* Summary */}
        {data.personal?.summary ? (
          <View style={styles.sectionSpace}>
            <Text style={styles.summaryText}>{data.personal.summary}</Text>
          </View>
        ) : null}

        {/* Achievements - Renderizado dinámico */}
        {activeSectionIds.has("achievements") && data.achievements?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LOGROS Y RECONOCIMIENTOS</Text>
            <View style={styles.sectionDivider} />

            <View>
              {data.achievements.items.map((ach, idx) => (
                <View key={ach.id ?? idx} style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 10.5 }}>
                    <Text style={{ fontWeight: "bold" }}>{ach.title ?? ""}:</Text>{" "}
                    {ach.description ?? ""}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        ) : null}

        {/* Certifications - Renderizado dinámico */}
        {activeSectionIds.has("certifications") && data.certifications?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>LICENCIAS Y CERTIFICACIONES</Text>
            <View style={styles.sectionDivider} />
            <View>
              {data.certifications.items.map((c, index) => (
                <Text key={c.id ?? index} style={styles.simpleList}>
                  {c.name ?? ""} {c.issuer ? `by ${c.issuer}` : ""}{" "}
                  {c.date ? `(${new Date(c.date).getFullYear()})` : ""}
                </Text>
              ))}
            </View>
          </View>
        ) : null}

        {/* Education */}
        {activeSectionIds.has("education") && data.education?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EDUCACIÓN</Text>
            <View style={styles.sectionDivider} />

            {data.education.items.map((edu, index) => (
              <View key={edu.id ?? index} style={styles.eduRow}>
                <View style={styles.eduTopRow}>
                  <Text style={styles.eduInstitution}>{edu.institution ?? ""}</Text>
                  <Text style={styles.locationText}>{edu.location ?? ""}</Text>
                </View>

                <View style={styles.entryRow}>
                  <Text>{edu.title ?? ""}</Text>
                  <Text style={styles.dateText}>{edu.year ?? ""}</Text>
                </View>

                {edu.honors ? (
                  <View>
                    <Text style={{ fontSize: 10.5 }}>Honores: {edu.honors}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Projects (PROYECTOS ACADÉMICOS) */}
        {activeSectionIds.has("projects") && data.projects?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>PROYECTOS ACADÉMICOS</Text>
            <View style={styles.sectionDivider} />

            {data.projects.items.map((proj, index) => (
              <View key={proj.id ?? index} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.companyName}>{proj.title ?? ""}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={styles.dateText}>{proj.duration ?? ""}</Text>
                  </View>
                </View>

                {proj.description ? (
                  <Text style={{ fontSize: 10.5, marginTop: 4, marginBottom: 4, textAlign: "justify" }}>
                    {proj.description}
                  </Text>
                ) : null}

                {proj.technologies ? (
                  <Text style={{ fontSize: 10.5 }}>
                    <Text style={{ fontWeight: "bold" }}>Tecnologías:</Text> {proj.technologies}
                  </Text>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Volunteering */}
        {activeSectionIds.has("volunteering") && data.volunteering?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>VOLUNTARIADOS Y ACTIVIDADES COMUNITARIAS</Text>
            <View style={styles.sectionDivider} />

            {data.volunteering.items.map((vol, index) => (
              <View key={vol.id ?? index} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.companyName}>{vol.organization ?? ""}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={{ fontSize: 10.5, fontWeight: "bold" }}>{vol.location ?? ""}</Text>
                  </View>
                </View>

                <View style={[styles.entryRow, { marginBottom: 2 }]}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.roleName}>{vol.position ?? ""}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={styles.dateText}>{vol.duration ?? ""}</Text>
                  </View>
                </View>

                {/* responsibilities as list-disc */}
                {vol.responsibilities ? (
                  <View style={{ marginLeft: 6 }}>
                    {vol.responsibilities
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => {
                        const cleaned = line.replace(/^[-–•]\s*/, "");
                        return (
                          <Text key={i} style={styles.bulletItem}>
                            {`\u2022 ${cleaned}`}
                          </Text>
                        );
                      })}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Experience */}
        {activeSectionIds.has("experience") && data.experience?.items?.length ? (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>EXPERIENCIA LABORAL</Text>
            <View style={styles.sectionDivider} />

            {data.experience.items.map((exp, index) => (
              <View key={exp.id ?? index} style={{ marginBottom: 6 }}>
                <View style={styles.entryRow}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.companyName}>{exp.company ?? ""}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={{ fontSize: 10.5, fontWeight: "bold" }}>{exp.location ?? ""}</Text>
                  </View>
                </View>

                <View style={[styles.entryRow, { marginBottom: 2 }]}>
                  <View style={styles.entryLeft}>
                    <Text style={styles.roleName}>{exp.position ?? ""}</Text>
                  </View>
                  <View style={styles.entryRight}>
                    <Text style={styles.dateText}>{exp.duration ?? ""}</Text>
                  </View>
                </View>

                {/* responsibilities as list-disc */}
                {exp.responsibilities ? (
                  <View style={{ marginLeft: 6 }}>
                    {exp.responsibilities
                      .split("\n")
                      .filter(Boolean)
                      .map((line, i) => {
                        const cleaned = line.replace(/^[-–•]\s*/, "");
                        return (
                          <Text key={i} style={styles.bulletItem}>
                            {`\u2022 ${cleaned}`}
                          </Text>
                        );
                      })}
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        ) : null}

        {/* Skills */}
        {activeSectionIds.has("skills") && data.skills && (
          (data.skills.languages?.length ?? 0) > 0 ||
          (data.skills.technical?.length ?? 0) > 0 ||
          (data.skills.soft?.length ?? 0) > 0
        ) && (
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>HABILIDADES PROFESIONALES Y PERSONALES</Text>
              <View style={styles.sectionDivider} />

              <View>
                {data.skills.languages?.length ? (
                  <Text style={styles.skillsLine}>
                    <Text style={styles.skillsLineLabel}>Idiomas:</Text>
                    {data.skills.languages.join(", ")}
                  </Text>
                ) : null}

                {data.skills.technical?.length ? (
                  <Text style={styles.skillsLine}>
                    <Text style={styles.skillsLineLabel}>Habilidades Técnicas:</Text>
                    {data.skills.technical.join(", ")}
                  </Text>
                ) : null}

                {data.skills.soft?.length ? (
                  <Text style={styles.skillsLine}>
                    <Text style={styles.skillsLineLabel}>Habilidades Blandas:</Text>
                    {data.skills.soft.join(", ")}
                  </Text>
                ) : null}
              </View>
            </View>
          )}
      </Page>
    </Document>
  );
}
