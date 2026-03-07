import Vapi from "@vapi-ai/web";
import { useEffect, useState, useCallback } from "react";
import {
  prepareInterviewSession
} from "@/features/interview/actions/prepare-interview-session";
import {linkVapiCallId} from "@/features/interview/actions/link-vapi-call-id-action";

interface TranscriptMessage {
  role: "user" | "assistant";
  text: string;
}

export const useVapi = () => {
  const [vapi, setVapi] = useState<Vapi | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState<TranscriptMessage[]>([]);

  useEffect(() => {
    // Es buena práctica usar variables de entorno para la Key
    const vapiInstance = new Vapi("d8f16ab8-1d1a-4574-86ac-5ec2b5079782");
    setVapi(vapiInstance);

    vapiInstance.on("call-start", () => {
      setIsConnected(true);
      setIsConnecting(false);
    });

    vapiInstance.on("call-end", () => {
      setIsConnected(false);
      setIsConnecting(false);
      setIsSpeaking(false);
    });

    vapiInstance.on("speech-start", () => setIsSpeaking(true));
    vapiInstance.on("speech-end", () => setIsSpeaking(false));

    vapiInstance.on("message", (message) => {
      if (message.type === "transcript" && message.transcriptType === "final") {
        setTranscript((prev) => [
          ...prev,
          {
            role: message.role === "user" ? "user" : "assistant",
            text: message.transcript,
          },
        ]);
      }
    });

    return () => {
      vapiInstance.removeAllListeners();
      vapiInstance.stop();
    };
  }, []);

  // 2. startCall ahora acepta el contexto
  const startCall = useCallback(async (opportunityId: string, cvId: string) => {
    console.log("startCall", opportunityId, cvId);
    if (!vapi) return;

    console.log("startCall", opportunityId, cvId);

    setIsConnecting(true);
    setTranscript([]);

    const ASSISTANT_ID = "54fc6087-27cf-42c7-933f-4fc410535174";

    try {
      // 1. LLAMADA AL SERVER: Crear sesión y obtener contexto
      const context = await prepareInterviewSession(opportunityId, cvId);

      const call = await vapi.start(ASSISTANT_ID, {
        // server: {
        //   url: "https://TU_URL_NGROK_O_DOMINIO.com/api/webhooks/vapi",
        //   timeoutSeconds: 30,
        // },
        // 3. Sobrescribimos la configuración para esta llamada específica
        variableValues: {
          // Si usas {{role}} en el prompt del dashboard, esto lo rellena
          role: context.role,
          company: context.company,
        },
        transcriber: {
          provider: "deepgram", // Es el más rápido y recomendado por Vapi
          model: "nova-2",      // El modelo más preciso actualmente
          language: "es",       // Forzamos español (puedes usar "es-MX" o "es-ES" si quieres más precisión)
          smartFormat: true,    // Mejora puntuación y números
        },
        model: {
          messages: [
            {
              role: "system",
              content: `Eres un entrevistador experto en ${context.company}.
                Estás entrevistando a ${context.candidateName} para el puesto de ${context.role}.
                Debes evaluar los siguientes temas técnicos: ${context.technicalTopics.join(", ")}.
                Mantén un tono profesional y directo. No te salgas del rol.`
            }
          ],
          model: 'chatgpt-4o-latest',
          provider: 'openai',
        },
        // Opcional: Personalizar el primer mensaje dinámicamente
        firstMessage: `Hola ${context.candidateName}, gracias por venir. Soy tu entrevistador de ${context.company}. Comencemos hablando sobre tu experiencia en ${context.role}.`
      });
      // 3. LLAMADA AL SERVER: Vincular el ID que nos dio Vapi
      if (call?.id) {
        await linkVapiCallId(context.sessionId, call.id);
      }
    } catch (error) {
      console.error("Falló el inicio de la llamada:", error);
      setIsConnecting(false);
    }
  }, [vapi]);

  const endCall = () => {
    vapi?.stop();
  };

  return {
    isConnected,
    isConnecting,
    isSpeaking,
    transcript,
    startCall,
    endCall,
  };
};
