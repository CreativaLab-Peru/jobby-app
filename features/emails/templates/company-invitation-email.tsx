import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface CompanyInvitationEmailProps {
  companyName: string;
  email: string;
  code: string;
  joinUrl: string;
  expiresLabel: string;
}

const colors = {
  background: "#0d1526",
  card: "#192233",
  primary: "#3b82f6",
  secondary: "#bef264",
  foreground: "#fcfcfd",
  muted: "#a1a1aa",
  border: "#334155",
};

export const CompanyInvitationEmail = ({
  companyName,
  email,
  code,
  joinUrl,
  expiresLabel,
}: CompanyInvitationEmailProps) => (
  <Html>
    <Head />
    <Preview>Tu código de invitación para unirte a {companyName}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={{ textAlign: "center", marginBottom: "32px" }}>
          <Text style={{ color: colors.secondary, fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Levely Business
          </Text>
          <Heading style={h1}>Invitación para {companyName}</Heading>
        </Section>

        <Text style={text}>Hola <strong>{email}</strong>,</Text>
        <Text style={text}>
          Te compartieron una invitación para unirte a <strong>{companyName}</strong> en Levely.
          Usa el siguiente código de 6 dígitos para confirmar tu acceso.
        </Text>

        <Section style={codeBox}>
          <Text style={codeLabel}>Código de acceso</Text>
          <Text style={codeValue}>{code}</Text>
        </Section>

        <Section style={{ textAlign: "center", margin: "28px 0" }}>
          <Button href={joinUrl} style={button}>
            Abrir invitación
          </Button>
        </Section>

        <Text style={{ ...text, fontSize: "14px" }}>
          Si prefieres, copia y pega este enlace: <br />
          <Link href={joinUrl} style={{ color: colors.primary, fontSize: "12px" }}>{joinUrl}</Link>
        </Text>

        <Text style={{ ...text, fontSize: "12px", color: colors.border }}>
          Esta invitación vence {expiresLabel}.
        </Text>

        <Hr style={hr} />
        <Text style={footer}>
          Si no esperabas esta invitación, puedes ignorar este correo.
        </Text>
      </Container>
    </Body>
  </Html>
);

const main = { backgroundColor: colors.background, padding: "40px 0", fontFamily: "Poppins, sans-serif" };
const container = { backgroundColor: colors.card, border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "40px", maxWidth: "520px", margin: "0 auto" };
const h1 = { color: colors.foreground, fontSize: "24px", fontWeight: 700, textAlign: "center" as const, margin: "8px 0 0" };
const text = { color: colors.muted, fontSize: "16px", lineHeight: "24px" };
const codeBox = { backgroundColor: "rgba(255,255,255,0.04)", border: `1px solid ${colors.border}`, borderRadius: "16px", padding: "24px", textAlign: "center" as const, marginTop: "24px" };
const codeLabel = { color: colors.muted, fontSize: "12px", letterSpacing: "0.08em", textTransform: "uppercase" as const, margin: "0 0 8px" };
const codeValue = { color: colors.secondary, fontSize: "32px", fontWeight: 800, letterSpacing: "0.4em", margin: 0 };
const hr = { borderColor: colors.border, margin: "32px 0" };
const footer = { color: "#71717a", fontSize: "12px", textAlign: "center" as const };
const button = { backgroundColor: colors.primary, borderRadius: "12px", color: "#fff", fontSize: "16px", fontWeight: 700, textDecoration: "none", textAlign: "center" as const, display: "inline-block", padding: "16px 32px" };

