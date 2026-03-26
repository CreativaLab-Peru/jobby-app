"use client";

import React from "react";
import { Document, Page, View, Text, StyleSheet, Font, Image, Svg, Path, Rect } from "@react-pdf/renderer";
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

const EU_BLUE = "#003FA3";
const BORDER_COLOR = "#2596be";
const GOLD = "#FFCC00";

// 5-pointed star path centrada en (cx, cy)
function starPath(cx: number, cy: number, outer: number, inner: number): string {
  return (
    Array.from({ length: 10 }, (_, j) => {
      const a = (j * 36 - 90) * (Math.PI / 180);
      const r = j % 2 === 0 ? outer : inner;
      return `${j === 0 ? "M" : "L"} ${(cx + r * Math.cos(a)).toFixed(3)} ${(cy + r * Math.sin(a)).toFixed(3)}`;
    }).join(" ") + " Z"
  );
}

// Bandera EU simplificada
function EuFlagPdf({ width = 38, height = 26 }: { width?: number; height?: number }) {
  const cx = width / 2;
  const cy = height / 2;
  const circleR = Math.min(width, height) * 0.28;
  const outerR = Math.min(width, height) * 0.072;
  const innerR = outerR * 0.39;
  const stars = Array.from({ length: 12 }, (_, i) => {
    const a = (i * 30 - 90) * (Math.PI / 180);
    return starPath(cx + circleR * Math.cos(a), cy + circleR * Math.sin(a), outerR, innerR);
  });
  return (
    <Svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
      <Rect x="0" y="0" width={String(width)} height={String(height)} fill={EU_BLUE} />
      {stars.map((d, i) => (
        <Path key={i} d={d} fill={GOLD} />
      ))}
    </Svg>
  );
}

function PhoneIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={9} height={9}>
      <Path
        d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02L6.62 10.79z"
        fill={EU_BLUE}
      />
    </Svg>
  );
}

function MailIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={9} height={9}>
      <Path
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
        fill={EU_BLUE}
      />
    </Svg>
  );
}

function LinkedInIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={9} height={9}>
      <Path
        d="M19 3a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h14m-.5 15.5v-5.3a3.26 3.26 0 00-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 011.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 001.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 00-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"
        fill={EU_BLUE}
      />
    </Svg>
  );
}

function MapPinIcon() {
  return (
    <Svg viewBox="0 0 24 24" width={9} height={9}>
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
        fill={EU_BLUE}
      />
    </Svg>
  );
}

// Parsea responsabilidades en bullets y subencabezados
function parseLines(text: string): Array<{ type: "bullet" | "subheading"; text: string }> {
  return text
    .split("\n")
    .map((line) => {
      const raw = line.trim().replace(/^[-–•·]\s*/, "");
      if (!raw) return null;
      if (/^[A-ZÁÉÍÓÚÑa-záéíóúñ][^:]{2,39}:$/.test(raw)) return { type: "subheading" as const, text: raw };
      return { type: "bullet" as const, text: raw };
    })
    .filter(Boolean) as Array<{ type: "bullet" | "subheading"; text: string }>;
}

const styles = StyleSheet.create({
  page: {
    backgroundColor: "#FFFFFF",
    fontFamily: "Arial",
    fontSize: 10.5,
    color: "#222222",
    paddingLeft: 30,
    paddingRight: 30,
    paddingTop: 32,
    paddingBottom: 32,
  },
  topBar: { position: "absolute", left: 0, right: 0, top: 0, height: 14, backgroundColor: BORDER_COLOR },
  bottomBar: { position: "absolute", left: 0, right: 0, bottom: 0, height: 14, backgroundColor: BORDER_COLOR },
  leftBarTop: { position: "absolute", top: 0, left: 0, width: 14, height: 60, backgroundColor: BORDER_COLOR },
  rightBarTop: { position: "absolute", top: 0, right: 0, width: 14, height: 60, backgroundColor: BORDER_COLOR },
  leftBarBottom: { position: "absolute", bottom: 0, left: 0, width: 14, height: 60, backgroundColor: BORDER_COLOR },
  rightBarBottom: { position: "absolute", bottom: 0, right: 0, width: 14, height: 60, backgroundColor: BORDER_COLOR },
  topRow: { flexDirection: "row", justifyContent: "flex-end", alignItems: "center", marginBottom: 10 },
  europassText: { color: EU_BLUE, fontSize: 18, fontWeight: "bold", marginLeft: 6 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  photo: { width: 68, height: 68, borderRadius: 34, marginRight: 12, objectFit: "cover" },
  photoWrap: { width: 75, height: 75, borderRadius: 37.5, marginRight: 14, overflow: "hidden", borderWidth: 2, borderColor: "rgba(0,0,0,0.08)", borderStyle: "solid" },
  headerInfo: { flex: 1 },
  fullName: { fontSize: 16, fontWeight: "bold", color: EU_BLUE, marginBottom: 5 },
  contactRow: { flexDirection: "row", alignItems: "center", marginBottom: 2.5, flexWrap: "wrap" },
  cLabel: { fontSize: 9.5, fontWeight: "bold", color: "#222", marginLeft: 3 },
  cValue: { fontSize: 9.5, color: "#222", marginLeft: 2 },
  cValueLink: { fontSize: 9.5, color: EU_BLUE, marginLeft: 2 },
  cSpacer: { width: 14 },
  sectionTitle: {
    fontSize: 11.5,
    fontWeight: "bold",
    color: EU_BLUE,
    textTransform: "uppercase",
    borderBottomWidth: 0.75,
    borderBottomColor: "#222222",
    paddingBottom: 0,
    marginTop: 0,
    marginBottom: 5,
  },
  summaryText: { fontSize: 10.5, fontWeight: "bold", lineHeight: 1.5, textAlign: "justify" },
  entry: { marginBottom: 7 },
  jobTitle: { fontSize: 10.5, fontWeight: "bold", color: EU_BLUE },
  companyLine: { fontSize: 10.5, fontStyle: "italic", marginBottom: 2 },
  metaLine: { fontSize: 9.5, marginBottom: 2.5 },
  metaLabel: { fontWeight: "bold" },
  bulletRow: { flexDirection: "row", marginLeft: 4, marginBottom: 2 },
  bulletDot: { fontSize: 11.5, width: 10, color: "#444", lineHeight: 1.2 },
  bulletTxt: { fontSize: 9.5, flex: 1, lineHeight: 1.45, textAlign: "justify" },
  descTxt: { fontSize: 9.5, lineHeight: 1.45, textAlign: "justify" },
  subheadTxt: { fontSize: 9.5, fontWeight: "bold", marginTop: 3, marginBottom: 1, marginLeft: 4 },
  degreeTitle: { fontSize: 10.5, fontWeight: "bold", color: EU_BLUE },
  instLine: { fontSize: 10.5, fontStyle: "italic", marginBottom: 2 },
  skillCat: { fontSize: 10.5, fontWeight: "bold", marginBottom: 3, marginTop: 5 },
  skillItem: { fontSize: 9.5, marginLeft: 8, marginBottom: 2 },
  itemTitle: { fontSize: 10.5, fontWeight: "bold", color: EU_BLUE },
  itemBody: { fontSize: 9.5, marginBottom: 1 },
  itemSection: { marginBottom: 6 },
  sectionWrap: { paddingTop: 12 },
  titleGuard: { flexDirection: "row", flexWrap: "nowrap" },
});

function BulletList({ text }: { text: string }) {
  const lines = parseLines(text);
  return (
    <>
      {lines.map((item, idx) =>
        item.type === "subheading" ? (
          <Text key={idx} style={styles.subheadTxt}>
            {item.text}
          </Text>
        ) : (
          <View key={idx} style={styles.bulletRow}>
            <Text style={styles.bulletDot}>·</Text>
            <Text style={styles.bulletTxt}>{item.text}</Text>
          </View>
        )
      )}
    </>
  );
}

export function CvDocumentEuropass({ data, sections, lang }: { data: CVData; sections: CVSection[], lang?: "ES" | "EN" }) {
  const t = i18n[lang] || i18n.ES;
  const sectionRenderers: Record<string, () => React.ReactElement | null> = {
    experience: () =>
      data.experience?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.experience}</Text>
          {data.experience.items.map((exp, i) => (
            <View key={exp.id ?? i} style={styles.entry} wrap={false}>
              {exp.position && <Text style={styles.jobTitle}>{exp.position}</Text>}
              {(exp.company || exp.duration) && (
                <Text style={styles.companyLine}>
                  {[exp.company, exp.duration ? `[ ${exp.duration} ]` : ""].filter(Boolean).join("  ")}
                </Text>
              )}
              {exp.location && (
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>{t.location}: </Text>
                  {exp.location}
                </Text>
              )}
              {exp.responsibilities && <BulletList text={exp.responsibilities} />}
            </View>
          ))}
        </View>
      ) : null,

    education: () =>
      data.education?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.education}</Text>
          {data.education.items.map((edu, i) => (
            <View key={edu.id ?? i} style={styles.entry} wrap={false}>
              {edu.title && <Text style={styles.degreeTitle}>{edu.title}</Text>}
              {(edu.institution || edu.year) && (
                <Text style={styles.instLine}>
                  {[edu.institution, edu.year ? `[ ${edu.year} ]` : ""].filter(Boolean).join("  ")}
                </Text>
              )}
              {edu.location && (
                <Text style={styles.itemBody}>
                  <Text style={styles.metaLabel}>{t.location}: </Text>
                  {edu.location}
                </Text>
              )}
              {edu.honors && (
                <Text style={styles.itemBody}>
                  <Text style={styles.metaLabel}>{t.keyAchievement}: </Text>
                  {edu.honors}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    skills: () =>
      data.skills &&
      (data.skills.technical?.length || data.skills.soft?.length || data.skills.languages?.length) ? (
        <View>
          <Text style={styles.sectionTitle}>{t.skills}</Text>
          {data.skills.technical?.length ? (
            <View>
              <Text style={styles.skillCat}>{t.technicalSkills}</Text>
              {data.skills.technical.map((s, i) => (
                <Text key={i} style={styles.skillItem}>
                  · {s}
                </Text>
              ))}
            </View>
          ) : null}
          {data.skills.soft?.length ? (
            <View>
              <Text style={styles.skillCat}>{t.softSkills}</Text>
              {data.skills.soft.map((s, i) => (
                <Text key={i} style={styles.skillItem}>
                  · {s}
                </Text>
              ))}
            </View>
          ) : null}
          {data.skills.languages?.length ? (
            <View>
              <Text style={styles.skillCat}>{t.languages}</Text>
              {data.skills.languages.map((lang, i) => {
                const [name, level] = lang.split(":").map((s) => s.trim());
                return (
                  <Text key={i} style={styles.skillItem}>
                    · {name}
                    {level ? ` — ${level}` : ""}
                  </Text>
                );
              })}
            </View>
          ) : null}
        </View>
      ) : null,

    projects: () =>
      data.projects?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.projects}</Text>
          {data.projects.items.map((p, i) => (
            <View key={p.id ?? i} style={styles.entry} wrap={false}>
              {p.title && <Text style={styles.itemTitle}>{p.title}</Text>}
              {p.duration && <Text style={styles.companyLine}>[ {p.duration} ]</Text>}
              {p.description && <Text style={styles.descTxt}>{p.description}</Text>}
              {p.technologies && (
                <Text style={styles.itemBody}>
                  <Text style={styles.metaLabel}>Tecnologías: </Text>
                  {p.technologies}
                </Text>
              )}
            </View>
          ))}
        </View>
      ) : null,

    achievements: () =>
      data.achievements?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.achievements}</Text>
          {data.achievements.items.map((ach, i) => (
            <View key={ach.id ?? i} style={styles.itemSection} wrap={false}>
              <Text style={styles.itemBody}>
                {ach.title ? <Text style={styles.metaLabel}>{ach.title}: </Text> : null}
                {ach.description}
              </Text>
            </View>
          ))}
        </View>
      ) : null,

    certifications: () =>
      data.certifications?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.certifications}</Text>
          {data.certifications.items.map((cert, i) => (
            <View key={cert.id ?? i} style={styles.itemSection} wrap={false}>
              {cert.name && <Text style={styles.itemTitle}>{cert.name}</Text>}
              {cert.issuer && <Text style={styles.itemBody}>{t.issuedBy} {cert.issuer}</Text>}
              {cert.date && <Text style={styles.itemBody}>{cert.date}</Text>}
            </View>
          ))}
        </View>
      ) : null,

    volunteering: () =>
      data.volunteering?.items?.length ? (
        <View>
          <Text style={styles.sectionTitle}>{t.volunteering}</Text>
          {data.volunteering.items.map((vol, i) => (
            <View key={vol.id ?? i} style={styles.entry} wrap={false}>
              {vol.position && <Text style={styles.jobTitle}>{vol.position}</Text>}
              {(vol.organization || vol.duration) && (
                <Text style={styles.companyLine}>
                  {[vol.organization, vol.duration ? `[ ${vol.duration} ]` : ""].filter(Boolean).join("  ")}
                </Text>
              )}
              {vol.location && (
                <Text style={styles.metaLine}>
                  <Text style={styles.metaLabel}>Población: </Text>
                  {vol.location}
                </Text>
              )}
              {vol.responsibilities && <BulletList text={vol.responsibilities} />}
            </View>
          ))}
        </View>
      ) : null,
  };

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Marco tipo esquina ┌─┐└─┘ – fixed para repetir en cada página */}
        <View style={styles.topBar} fixed />
        <View style={styles.bottomBar} fixed />
        <View style={styles.leftBarTop} fixed />
        <View style={styles.rightBarTop} fixed />
        <View style={styles.leftBarBottom} fixed />
        <View style={styles.rightBarBottom} fixed />

        {/* Logo Europass – arriba a la derecha */}
        <View style={styles.topRow}>
          <EuFlagPdf />
          <Text style={styles.europassText}>europass</Text>
        </View>

        {/* Cabecera: foto + nombre + contacto */}
        <View style={styles.headerRow}>
          {data.personal?.image ? (
            <View style={styles.photoWrap}>
              <Image src={data.personal.image} style={{ width: 75, height: 75, objectFit: "cover" }} />
            </View>
          ) : null}
          <View style={styles.headerInfo}>
            <Text style={styles.fullName}>{data.personal?.fullName ?? ""}</Text>

            {/* Fila 1: Nacionalidad + Teléfono */}
            <View style={styles.contactRow}>
              {data.personal?.nationality && (
                <>
                  <Text style={styles.cLabel}>{t.nationality}:</Text>
                  <Text style={styles.cValue}>{data.personal.nationality}</Text>
                  <View style={styles.cSpacer} />
                </>
              )}
              {data.personal?.phone && (
                <>
                  <PhoneIcon />
                  <Text style={styles.cLabel}>{t.phoneNumber}:</Text>
                  <Text style={styles.cValue}>{data.personal.phone}</Text>
                </>
              )}
            </View>

            {/* Fila 2: Email */}
            {data.personal?.email && (
              <View style={styles.contactRow}>
                <MailIcon />
                <Text style={styles.cLabel}>{t.emailAddress}:</Text>
                <Text style={styles.cValueLink}>{data.personal.email}</Text>
              </View>
            )}

            {/* Fila 3: LinkedIn */}
            {data.personal?.linkedin && (
              <View style={styles.contactRow}>
                <LinkedInIcon />
                <Text style={styles.cLabel}>LinkedIn:</Text>
                <Text style={styles.cValueLink}>{linkedinDisplay(data.personal.linkedin)}</Text>
              </View>
            )}

            {/* Fila 4: Domicilio */}
            {data.personal?.address && (
              <View style={styles.contactRow}>
                <MapPinIcon />
                <Text style={styles.cLabel}>{t.address}:</Text>
                <Text style={styles.cValue}>{data.personal.address}</Text>
              </View>
            )}
          </View>
        </View>

        {/* SOBRE MÍ */}
        {data.personal?.summary && (
          <View>
            <Text style={styles.sectionTitle}>{t.aboutMe}</Text>
            <Text style={styles.summaryText}>{data.personal.summary}</Text>
          </View>
        )}

        {/* Secciones dinámicas */}
        {sections.map((section) => {
          const renderer = sectionRenderers[section.id];
          if (!renderer) return null;
          const el = renderer();
          return el ? <View key={section.id} style={styles.sectionWrap}>{el}</View> : null;
        })}
      </Page>
    </Document>
  );
}


