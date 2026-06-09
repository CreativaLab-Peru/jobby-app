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

interface DiagnosticAccessEmailProps {
  email?: string;
  name?: string;
  magicLink: string;
}

export const DiagnosticAccessEmail = ({
  email,
  name,
  magicLink
}: DiagnosticAccessEmailProps) => {
  const displayName = name || email || "futuro becario";

  return (
    <Html>
      <Head />
<Preview>Diagnostico Levely - Acceso para subir tu CV</Preview>
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
            <Text style={badgeText}>DIAGNOSTICO DE BECA</Text>
          </Section>

          <Heading style={h1}>Accede a subir tu CV</Heading>

          <Text style={text}>
            Hola <strong style={{ color: colors.foreground }}>{displayName}</strong>,
            hemos recibido tu pago correctamente. Ahora es momento de subir tu CV para comenzar tu diagnostico de beca.
          </Text>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Text style={{ ...text, marginBottom: "16px", fontSize: "14px" }}>
              Haz clic abajo para acceder y subir tu CV:
            </Text>
            <Link href={magicLink} style={button}>Subir mi CV ahora</Link>
          </Section>

          <Text style={subtext}>
            Este enlace es unico y expirara en 7 dias por motivos de seguridad.
          </Text>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          <Section>
            <Text style={footer}>
              <strong>Proximo paso:</strong> Podras seleccionar los paises y tipos de beca que te interesan para personalizar tu diagnostico.
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

const subtext = {
  color: "#71717a",
  fontSize: "12px",
  textAlign: "center" as const,
  margin: "0 20px"
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

export default DiagnosticAccessEmail;
