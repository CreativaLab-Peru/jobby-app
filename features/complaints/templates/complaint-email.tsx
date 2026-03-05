import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ComplaintEmailProps {
  name: string;
  email: string;
  phone?: string;
  complaint: string;
  submittedAt: string;
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

export const ComplaintEmail = ({
  name,
  email,
  phone,
  complaint,
  submittedAt,
}: ComplaintEmailProps) => {
  return (
    <Html>
      <Head />
      <Preview>Nuevo reclamo recibido de {name} — Levely</Preview>
      <Body style={main}>
        <Container style={container}>

          {/* Badge */}
          <Section style={{ textAlign: "center" as const, marginBottom: "24px" }}>
            <Text
              style={{
                display: "inline-block",
                background: "#ef444420",
                color: "#ef4444",
                fontSize: "11px",
                fontWeight: "700",
                letterSpacing: "2px",
                textTransform: "uppercase" as const,
                padding: "6px 16px",
                borderRadius: "100px",
                border: "1px solid #ef444440",
              }}
            >
              Libro de Reclamaciones
            </Text>
          </Section>

          {/* Título */}
          <Section style={headerSection}>
            <Heading style={h1}>Nuevo Reclamo Recibido</Heading>
            <Text style={subtitle}>
              Se ha registrado un nuevo reclamo en la plataforma Levely.
            </Text>
          </Section>

          <Hr style={divider} />

          {/* Datos del usuario */}
          <Section style={infoSection}>
            <Text style={sectionTitle}>
              Datos del reclamante
            </Text>

            <table style={{ width: "100%", borderCollapse: "collapse" as const }} cellPadding="0" cellSpacing="0">
              <tbody>
                <tr>
                  <td style={labelCell}>Nombre</td>
                  <td style={valueCell}>{name}</td>
                </tr>
                <tr>
                  <td style={labelCell}>Correo</td>
                  <td style={valueCell}>{email}</td>
                </tr>
                {phone && (
                  <tr>
                    <td style={labelCell}>Teléfono</td>
                    <td style={valueCell}>{phone}</td>
                  </tr>
                )}
                <tr>
                  <td style={labelCell}>Fecha</td>
                  <td style={valueCell}>{submittedAt}</td>
                </tr>
              </tbody>
            </table>
          </Section>

          <Hr style={divider} />

          {/* Detalle del reclamo */}
          <Section style={infoSection}>
            <Text style={sectionTitle}>
              Detalle del reclamo
            </Text>
            <Text style={complaintBox}>{complaint}</Text>
          </Section>

          <Hr style={divider} />

          <Section style={{ textAlign: "center" as const, marginTop: "24px" }}>
            <Text style={footer}>
              Este correo fue generado automáticamente por el sistema de Levely AI.
              <br />
              No responder directamente a este mensaje.
            </Text>
          </Section>

        </Container>
      </Body>
    </Html>
  );
};

export default ComplaintEmail;

// ─── Styles ───────────────────────────────────────────────────────────────────

const main = {
  backgroundColor: colors.background,
  fontFamily: "'Poppins', 'Segoe UI', sans-serif",
  padding: "40px 0",
};

const container = {
  backgroundColor: colors.card,
  borderRadius: "16px",
  border: `1px solid ${colors.border}`,
  maxWidth: "560px",
  margin: "0 auto",
  padding: "40px 32px",
};

const headerSection = {
  textAlign: "center" as const,
  marginBottom: "24px",
};

const h1 = {
  color: colors.foreground,
  fontSize: "24px",
  fontWeight: "700",
  margin: "0 0 8px 0",
};

const subtitle = {
  color: colors.muted,
  fontSize: "14px",
  margin: "0",
};

const divider = {
  borderColor: colors.border,
  borderTopWidth: "1px",
  margin: "24px 0",
};

const infoSection = {
  marginBottom: "8px",
};

const sectionTitle = {
  color: colors.primary,
  fontSize: "13px",
  fontWeight: "700",
  textTransform: "uppercase" as const,
  letterSpacing: "1px",
  marginBottom: "12px",
};

const labelCell = {
  color: colors.muted,
  fontSize: "13px",
  fontWeight: "600",
  padding: "6px 16px 6px 0",
  verticalAlign: "top" as const,
  width: "100px",
};

const valueCell = {
  color: colors.foreground,
  fontSize: "14px",
  padding: "6px 0",
  verticalAlign: "top" as const,
};

const complaintBox = {
  backgroundColor: "#0d1526",
  border: `1px solid ${colors.border}`,
  borderRadius: "10px",
  color: colors.foreground,
  fontSize: "14px",
  lineHeight: "1.7",
  padding: "16px",
  whiteSpace: "pre-wrap" as const,
};

const footer = {
  color: colors.muted,
  fontSize: "11px",
  lineHeight: "1.6",
};

