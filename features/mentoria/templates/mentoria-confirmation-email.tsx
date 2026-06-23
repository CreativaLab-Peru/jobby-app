import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Img, Link, Hr, Button
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

const MERCADO_PAGO_URL = "https://mpago.la/15FA4yN";
const WHATSAPP_NUMBER = "51914773770";

interface MentoriaConfirmationEmailProps {
  name: string;
  email: string;
}

function buildWhatsAppUrl(name: string, email: string) {
  const message = `Hola Levely, soy ${name} (${email}), acabo de realizar el pago de mi mentoría 1:1.`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export const MentoriaConfirmationEmail = ({
  name,
  email,
}: MentoriaConfirmationEmailProps) => {
  const displayName = name || email || "futuro becario";
  const whatsappUrl = buildWhatsAppUrl(name, email);

  return (
    <Html>
      <Head />
      <Preview>{`Confirmación de tu sesión de mentoría 1:1 — Levely`}</Preview>
      <Body style={main}>
        <Container style={container}>
          {/* Logo */}
          <Section style={{ textAlign: "center", marginBottom: "24px" }}>
            <Img
              src="https://www.joinlevely.com/logo_dark.png"
              width="120"
              alt="Levely"
              style={{ margin: "0 auto" }}
            />
          </Section>

          {/* Badge */}
          <Section style={badge}>
            <Text style={badgeText}>MENTORÍA 1:1 CONFIRMADA</Text>
          </Section>

          <Heading style={h1}>¡Hola {displayName}!</Heading>

          <Text style={text}>
            Hemos recibido tu solicitud para la sesión de mentoría 1:1 con Dara Mariluz.
            Para confirmar tu lugar, realiza el pago de <strong style={{ color: colors.foreground }}>S/ 250</strong>.
          </Text>

          {/* MercadoPago Button */}
          <Section style={{ textAlign: "center", margin: "32px 0" }}>
            <Link href={MERCADO_PAGO_URL} style={button}>
              Pagar S/ 250 con MercadoPago
            </Link>
          </Section>

          {/* Price reminder */}
          <Section style={priceSection}>
            <Text style={priceLabel}>Sesión de mentoría 1:1</Text>
            <Text style={priceValue}>S/ 250</Text>
            <Text style={priceNote}>Pago único · Sin suscripción</Text>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          {/* WhatsApp section */}
          <Section style={{ textAlign: "center", margin: "24px 0" }}>
            <Text style={{ ...text, marginBottom: "16px", fontSize: "14px" }}>
              ¿Ya pagaste? Comunícate con Dara por WhatsApp para agendar tu sesión:
            </Text>
            <Link href={whatsappUrl} style={whatsappButton}>
              <Img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                width="20"
                height="20"
                alt="WhatsApp"
                style={{ marginRight: "8px", verticalAlign: "middle" }}
              />
              Confirmar pago por WhatsApp
            </Link>
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          {/* What's included */}
          <Section>
            <Text style={{ ...footer, marginBottom: "12px" }}>
              <strong style={{ color: colors.foreground }}>¿Qué incluye tu sesión?</strong>
            </Text>
            {[
              "60 minutos de sesión personalizada",
              "Revisión de tu perfil y experiencia",
              "Identificación de becas y universidades para ti",
              "Plan de acción para tu postulación",
              "Acceso al grupo privado de asesorados Levely",
            ].map((item, i) => (
              <Text key={i} style={bulletItem}>
                ✓ {item}
              </Text>
            ))}
          </Section>

          <Hr style={{ borderColor: colors.border, margin: "32px 0" }} />

          <Section>
            <Text style={footer}>
              <strong>¿Qué sigue?</strong> Después de pagar, recibirás un enlace de calendario para agendar tu sesión.
            </Text>
            <Text style={{...footer, marginTop: "12px", color: "#5a6b62"}}>
              Levely AI © 2026 · Levely emite boleta de pago · Empresa registrada en Perú
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

const whatsappButton = {
  backgroundColor: "#25D366",
  borderRadius: "12px",
  color: "#ffffff",
  fontSize: "16px",
  fontWeight: "bold",
  textDecoration: "none",
  textAlign: "center" as const,
  display: "inline-block",
  padding: "14px 24px",
};

const priceSection = {
  textAlign: "center" as const,
  margin: "24px 0",
  padding: "24px",
  backgroundColor: "rgba(200, 245, 98, 0.05)",
  borderRadius: "12px",
  border: `1px solid ${colors.border}`,
};

const priceLabel = {
  color: colors.muted,
  fontSize: "14px",
  margin: "0 0 8px 0",
};

const priceValue = {
  color: colors.primary,
  fontSize: "36px",
  fontWeight: "800" as const,
  lineHeight: "1",
  margin: "0",
};

const priceNote = {
  color: colors.muted,
  fontSize: "12px",
  margin: "8px 0 0 0",
};

const bulletItem = {
  color: colors.muted,
  fontSize: "14px",
  lineHeight: "22px",
  margin: "0 0 6px 0",
  textAlign: "left" as const,
};

const footer = {
  color: "#52525b",
  fontSize: "12px",
  textAlign: "center" as const,
  lineHeight: "18px"
};

export default MentoriaConfirmationEmail;
