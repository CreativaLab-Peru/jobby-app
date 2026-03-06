import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Img, Link, Hr
} from "@react-email/components";
import * as React from "react";

const colors = {
  background: "#0d1526",
  card: "#192233",
  primary: "#3b82f6",
  secondary: "#bef264",
  foreground: "#fcfcfd",
  muted: "#a1a1aa",
  border: "#334155",
};

interface SuccessPaymentEmailProps {
  email?: string;
  magicLink: string;
}

export const SuccessPaymentEmail = ({
                                      email,
                                      magicLink
                                    }: SuccessPaymentEmailProps) => {
  // Si no hay email, usamos un saludo amigable por defecto
  const displayIdentifier = email ? email : "nuevo miembro";

  return (
    <Html>
      <Head />
      <Preview>¡Bienvenido a Levely Pro! Pago confirmado</Preview>
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

          {/* Badge de Éxito */}
          <Section style={successBadge}>
            <Text style={successText}>PAGO COMPLETADO CON ÉXITO</Text>
          </Section>

          <Heading style={h1}>¡Ya eres parte de Levely!</Heading>

          <Text style={text}>
            Hola <strong>{displayIdentifier}</strong>, hemos recibido tu pago correctamente.
            Tu cuenta ha sido activada y ya tienes acceso total.
          </Text>

          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Text style={{ ...text, marginBottom: "16px", fontSize: "14px" }}>
              Haz clic abajo para configurar tu cuenta y empezar:
            </Text>
            <Link href={magicLink} style={button}>Ingresar ahora</Link>
          </Section>

          <Text style={subtext}>
            Este enlace es único y expirará en 24 horas por motivos de seguridad.
          </Text>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          <Section>
            <Text style={footer}>
              <strong>¿Necesitas ayuda con tu acceso?</strong> <br />
              Simplemente responde a este correo.
            </Text>
            <Text style={{...footer, marginTop: "12px", color: "#3f3f46"}}>
              Levely AI © 2026
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
};

// --- Estilos ---
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

const successBadge = {
  backgroundColor: "rgba(190, 242, 100, 0.1)",
  borderRadius: "100px",
  padding: "2px 12px",
  width: "fit-content",
  margin: "0 auto 16px auto",
  border: `1px solid ${colors.secondary}`,
};

const successText = {
  color: colors.secondary,
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
  color: "#ffffff",
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

export default SuccessPaymentEmail;
