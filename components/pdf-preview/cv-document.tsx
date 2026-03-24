"use client"; // if used in client components (PDFViewer). Not needed if only server-generated.

import React from "react";
import { Document, Page, View, Text, StyleSheet, Font } from "@react-pdf/renderer";
import path from "path";
import type { CVData, CVSection } from "@/types/cv";
import { linkedinDisplay } from "@/lib/utils";
import {i18n} from "@/const/i18n";

// Font Arial
Font.register({
  family: "Arial",
  fonts: [
    { src: path.resolve("/fonts/Arial/ARIAL.TTF"), fontWeight: "normal", fontStyle: "normal" },
    { src: path.resolve("/fonts/Arial/ARIALI.TTF"), fontWeight: "normal", fontStyle: "italic" },
    { src: path.resolve("/fonts/Arial/ARIALBD.TTF"), fontWeight: "bold", fontStyle: "normal" },
    { src: path.resolve("/fonts/Arial/ARIALBI.TTF"), fontWeight: "bold", fontStyle: "italic" },
  ],
});

const styles = StyleSheet.create({
  page: {
    paddingTop: 28,
    paddingBottom: 28,
    paddingHorizontal: 36,
    fontSize: 11,
    fontFamily: "Arial",
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

export function CvDocument({ data, sections, lang = "ES" }: { data: CVData; sections: CVSection[], lang?: "ES" | "EN" }) {
  const t = i18n[lang] || i18n.ES;
  // Mapeo de renderizadores para cada tipo de sección (para PDF)
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    achievements: () =>
      data.achievements?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.achievements}</Text>
          <View style={styles.sectionDivider} />
          <View>
            {data.achievements.items.map((ach, idx) => {
              const title = ach.title?.trim() ?? "";
              const description = ach.description?.trim() ?? "";
              if (!title && !description) return null;
              return (
                <View key={ach.id ?? idx} style={{ marginBottom: 4 }}>
                  <Text style={{ fontSize: 10.5 }}>
                    {title ? <Text style={{ fontWeight: "bold" }}>{title}:</Text> : null}
                    {title && description ? " " : ""}
                    {description}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.certifications}</Text>
          <View style={styles.sectionDivider} />
          <View>
            {data.certifications.items.map((c, index) => {
              let yearText = "";
              if (c.date) {
                try {
                  const year = new Date(c.date).getFullYear();
                  if (!isNaN(year)) {
                    yearText = ` (${year})`;
                  }
                } catch (e) {
                }
              }
              return (
                <Text key={c.id ?? index} style={styles.simpleList}>
                  {c.name ?? ""} {c.issuer ? `${t.issuedBy} ${c.issuer}` : ""}
                  {yearText}
                </Text>
              );
            })}
          </View>
        </View>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.education}</Text>
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
                  <Text style={{ fontSize: 10.5 }}>{t.honors}: {edu.honors}</Text>
                </View>
              ) : null}
            </View>
          ))}
        </View>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.projects}</Text>
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
                <Text
                  style={{ fontSize: 10.5, marginTop: 4, marginBottom: 4, textAlign: "justify" }}
                >
                  {proj.description}
                </Text>
              ) : null}
              {proj.technologies ? (
                <Text style={{ fontSize: 10.5 }}>
                  <Text style={{ fontWeight: "bold" }}>{t.skills}:</Text> {proj.technologies}
                </Text>
              ) : null}
            </View>
          ))}
        </View>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.volunteering}</Text>
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
              {vol.responsibilities &&
              typeof vol.responsibilities === "string" &&
              vol.responsibilities.trim() ? (
                <View style={{ marginLeft: 6 }}>
                  {vol.responsibilities
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => {
                      const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                      if (!cleaned) return null;
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
      ) : null,

    experience: () =>
      data.experience?.items?.length ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.experience}</Text>
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
              {exp.responsibilities &&
              typeof exp.responsibilities === "string" &&
              exp.responsibilities.trim() ? (
                <View style={{ marginLeft: 6 }}>
                  {exp.responsibilities
                    .split("\n")
                    .filter(Boolean)
                    .map((line, i) => {
                      const cleaned = line.trim().replace(/^[-–•]\s*/, "");
                      if (!cleaned) return null;
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
      ) : null,

    skills: () =>
      data.skills &&
      ((data.skills.languages?.length ?? 0) > 0 ||
        (data.skills.technical?.length ?? 0) > 0 ||
        (data.skills.soft?.length ?? 0) > 0) ? (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t.skills}</Text>
          <View style={styles.sectionDivider} />
          <View>
            {data.skills.languages?.length ? (
              <Text style={styles.skillsLine}>
                <Text style={styles.skillsLineLabel}>{t.languages}:</Text>
                {data.skills.languages.join(", ")}
              </Text>
            ) : null}
            {data.skills.technical?.length ? (
              <Text style={styles.skillsLine}>
                <Text style={styles.skillsLineLabel}>{t.technicalSkills}:</Text>
                {data.skills.technical.join(", ")}
              </Text>
            ) : null}
            {data.skills.soft?.length ? (
              <Text style={styles.skillsLine}>
                <Text style={styles.skillsLineLabel}>{t.softSkills}:</Text>
                {data.skills.soft.join(", ")}
              </Text>
            ) : null}
          </View>
        </View>
      ) : null,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header: Name + Contact */}
        <View style={styles.header}>
          <Text style={styles.name}>{data.personal?.fullName ?? ""}</Text>

          <Text style={styles.contactLine}>
            {data.personal?.address ? `${data.personal.address}` : ""}
            {data.personal?.address &&
            (data.personal?.linkedin || data.personal?.phone || data.personal?.email)
              ? " • "
              : ""}
            {data.personal?.linkedin ? (
              <Text>
                <Text style={styles.contactLink}>
                  {linkedinDisplay(data.personal.linkedin)}
                </Text>
                {data.personal?.phone || data.personal?.email ? " • " : ""}
              </Text>
            ) : null}
            {data.personal?.phone ? `${data.personal.phone}` : ""}
            {data.personal?.phone && data.personal?.email ? " • " : ""}
            {data.personal?.email ? `${data.personal.email}` : ""}
          </Text>
        </View>

        {data.personal?.summary && <View style={styles.thinRule} />}

        {/* Summary */}
        {data.personal?.summary ? (
          <View style={styles.sectionSpace}>
            <Text style={styles.summaryText}>{data.personal.summary}</Text>
          </View>
        ) : null}

        {/* Renderizar secciones dinámicamente en el orden de la configuración */}
        {sections.map((section) => {
          const renderer = sectionRenderers[section.id];
          if (!renderer) return null;
          return <React.Fragment key={section.id}>{renderer()}</React.Fragment>;
        })}
      </Page>
    </Document>
  );
}
