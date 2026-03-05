import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Img, Link, Hr
} from "@react-email/components";
import * as React from "react";

// Usamos tus mismos tokens de color
const colors = {
  background: "#0d1526",
  card: "#192233",
  primary: "#3b82f6",
  secondary: "#bef264",
  foreground: "#fcfcfd",
  muted: "#a1a1aa",
  border: "#334155",
};

export const MagicLinkEmail = ({ url }: { url: string }) => (
  <Html>
    <Head />
    <Preview>Tu enlace de acceso a Levely Pro</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: "center", marginBottom: "32px" }}>
          <Img src="https://www.joinlevely.com/logo_dark.png" width="130" alt="Levely" style={{ margin: "0 auto" }} />
        </Section>

        <Heading style={h1}>Acceso rápido</Heading>
        <Text style={text}>Haz clic en el botón de abajo para iniciar sesión de forma segura en tu cuenta de <strong>Levely</strong>.</Text>

        <Section style={{ textAlign: "center", margin: "32px 0" }}>
          <Link href={url} style={button}>Entrar a mi cuenta</Link>
        </Section>

        <Text style={{ ...text, fontSize: "12px", color: colors.border }}>
          Si el botón no funciona, copia y pega esta URL: <br/>
          <Link href={url} style={{ color: colors.primary }}>{url}</Link>
        </Text>

        <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />
        <Text style={footer}>Levely AI — No compartas este enlace con nadie.</Text>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: colors.background, padding: "40px 0" };
const container = { backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "40px", maxWidth: "480px", margin: "0 auto" };
const h1 = { color: colors.foreground, fontSize: "24px", fontWeight: "700", textAlign: "center" as const };
const text = { color: colors.muted, fontSize: "16px", lineHeight: "24px" };
const footer = { color: "#71717a", fontSize: "12px", textAlign: "center" as const };
const button = {
  backgroundColor: colors.primary,
  borderRadius: "12px",
  color: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "block",
  padding: "16px",
};
