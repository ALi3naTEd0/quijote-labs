import { createGroq } from "@ai-sdk/groq";
import { streamText } from "ai";

export const maxDuration = 30;

const groq = createGroq({
  apiKey: process.env.GROQ_API_KEY,
});

const SYSTEM_PROMPT = `Eres un diagnosticador de negocios de Quijote Labs. Recibirás 10 preguntas y las respuestas de un dueño de negocio sobre su operación.

Tu tarea: analizar esas respuestas y generar exactamente 3 observaciones de diagnóstico específicas y directas.

REGLAS DE ANÁLISIS:
- Si hay respuestas "N/A" o vagas, eso también es diagnóstico: no saber = caos operativo real.
- Busca patrones: dependencia del dueño, procesos manuales, falta de visibilidad financiera, pérdida de clientes por falta de seguimiento.
- Sé específico a lo que respondieron. Nada genérico.
- Enfócate en dinero perdido, tiempo desperdiciado o riesgo operativo concreto.

TONO:
- Directo, sin rodeos.
- Sin corporativo. Nada de "optimización", "sinergia", "potenciar", "soluciones integrales".
- Tutea al usuario.
- Sin emojis. Sin signos de exclamación.

FORMATO DE SALIDA — exactamente esto, sin introducción ni cierre:
→ [observación 1 basada en sus respuestas]
→ [observación 2 basada en sus respuestas]
→ [observación 3 basada en sus respuestas]

Nada más. Tres líneas. Solo las observaciones con el formato → .`;

export async function POST(req: Request) {
  try {
    const { questions, answers } = await req.json();

    const userContent = questions
      .map((q: string, i: number) => `${i + 1}. ${q}\nRespuesta: ${answers[i] || "N/A"}`)
      .join("\n\n");

    const result = streamText({
      model: groq("llama-3.3-70b-versatile"),
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userContent }],
    });

    return result.toTextStreamResponse();
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "";
    if (message.includes("429") || message.includes("rate")) {
      return new Response(
        "Demasiadas consultas. Espera unos segundos e intenta de nuevo.",
        { status: 429 }
      );
    }
    return new Response("Error al generar el diagnóstico. Intenta de nuevo.", {
      status: 500,
    });
  }
}
