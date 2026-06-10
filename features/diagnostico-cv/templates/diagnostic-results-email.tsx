import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Img, Link, Hr
} from "@react-email/components";
import * as React from "react";

const colors = {
  background: "#080f0d",
  card: "#0d1a17",
  primary: "#c8f562",
  secondary: "#a8d444",
  foreground: "#f4f0e6",
  muted: "#8a9e93",
  border: "rgba(255,255,255,.08)",
};

interface DiagnosticResultsEmailProps {
  email?: string;
  name?: string;
  overallScore?: number;
  profileType?: string;
  recommendations?: object[];
  opportunities?: object[];
  accessLink: string;
}

export const DiagnosticResultsEmail = ({
  email,
  name,
  overallScore,
  profileType,
  recommendations,
  opportunities,
  accessLink
}: DiagnosticResultsEmailProps) => {
  const displayName = name || email || "futuro becario";

  return (
    <Html>
      <Head />
      <Preview>{`Tu diagnostico de beca esta listo - Score: ${overallScore}/100`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src="https://www.joinlevely.com/logo_dark.png"
              width="100"
              alt="Levely"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Badge */}
          <Section style={badge}>
            <Text style={badgeText}>DIAGNOSTICO COMPLETADO</Text>
          </Section>

          <Heading style={h1}>Tu diagnostico esta listo</Heading>

          <Text style={text}>
            Hola <strong style={{ color: colors.foreground }}>{displayName}</strong>,
            hemos analizado tu CV y generado tu diagnostico personalizado de beca.
          </Text>

          {/* Score Section */}
          <Section style={scoreSection}>
            <Text style={scoreLabel}>Tu Score de Competitividad</Text>
            <Text style={scoreValue}>{overallScore || 0}</Text>
            <Text style={scoreMax}>/ 100</Text>
          </Section>

          {/* Profile Type */}
          {profileType && (
            <Section style={profileSection}>
              <Text style={profileLabel}>Tu Perfil</Text>
              <Text style={profileValue}>{profileType}</Text>
            </Section>
          )}

          {/* Access Button */}
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Text style={{ ...text, marginBottom: "16px", fontSize: "14px" }}>
              Revisa tu diagnostico completo y las oportunidades que matchearon:
            </Text>
            <Link href={accessLink} style={button}>Ver mi diagnostico completo</Link>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          <Section>
            <Text style={footer}>
              <strong>¿Que sigue?</strong> Explora las oportunidades que matchearon con tu perfil y comienza tu aplicacion.
            </Text>
            <Text style={{...footer, marginTop: "12px", color: "#5a6b62"}}>
              Levely AI © 2026
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

const main = {
  backgroundColor: colors.background,
  padding: "40px 0",
  fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
};

const container = {
  backgroundColor: colors.card,
  border: `1px solid ${colors.border}`,
  borderRadius: "16px",
  padding: "40px",
  maxWidth: "480px",
  margin: "0 auto"
};

const badge = {
  backgroundColor: "rgba(200, 245, 98, 0.1)",
  borderRadius: "100px",
  padding: "2px 12px",
  width: "fit-content",
  margin: "0 auto 16px auto",
  border: `1px solid ${colors.primary}`,
};

const badgeText = {
  color: colors.primary,
  fontSize: "12px",
  fontWeight: "700" as const,
  letterSpacing: "0.5px",
  margin: "0",
  textAlign: "center" as const,
};

const h1 = {
  color: colors.foreground,
  fontSize: "24px",
  fontWeight: "800" as const,
  textAlign: "center" as const,
  lineHeight: "32px",
  margin: "16px 0"
};

const text = {
  color: colors.muted,
  fontSize: "16px",
  lineHeight: "24px",
  textAlign: "center" as const
};

const scoreSection = {
  textAlign: "center" as const,
  margin: "24px 0",
  padding: "24px",
  backgroundColor: "rgba(200, 245, 98, 0.05)",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
};

const scoreLabel = {
  color: colors.muted,
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const scoreValue = {
  color: colors.primary,
  fontSize: "48px",
  fontWeight: "800" as const,
  lineHeight: "1",
  margin: "0",
};

const scoreMax = {
  color: colors.muted,
  fontSize: "16px",
  margin: "0",
};

const profileSection = {
  textAlign: "center" as const,
  margin: "16px 0",
};

const profileLabel = {
  color: colors.muted,
  fontSize: "12px",
  margin: "0 0 4px 0",
};

const profileValue = {
  color: colors.foreground,
  fontSize: "18px",
  fontWeight: "600" as const,
  margin: "0",
};

const button = {
  backgroundColor: colors.primary,
  borderRadius: "12px",
  color: colors.background,
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
};

const footer = {
  color: "#52525b",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "18px"
};

export default DiagnosticResultsEmail;
