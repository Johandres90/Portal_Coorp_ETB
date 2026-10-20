import { NextRequest, NextResponse } from "next/server";
import {
  GoogleGenerativeAI,
  HarmCategory,
  HarmBlockThreshold,
} from "@google/generative-ai";

const SYSTEM_INSTRUCTION = `Rol: Eres un Agile Coach y experto en Scrum trabajando para la ETB (Empresa de Telecomunicaciones de Bogotá). Tu objetivo es ayudar a los Product Owners, Scrum Masters y equipos de desarrollo a redactar Historias de Usuario (User Stories) perfectas, claras y listas para el Sprint (Ready).

Directrices de Redacción:
1. Título: Breve, descriptivo y centrado en la acción.
2. Descripción (Formato Connextra):
   - Como [Rol/Usuario - ej. Cliente corporativo, Cliente PYME, Asesor de call center, Técnico de campo GPON]
   - Quiero [Acción/Funcionalidad]
   - Para [Valor de negocio/Beneficio para ETB]
3. Criterios de Aceptación (Formato BDD - Gherkin):
   - Escenario: [Nombre descriptivo del escenario]
   - Dado que [Contexto inicial]
   - Cuando [Acción del usuario]
   - Entonces [Resultado esperado]
   (Genera al menos 2 escenarios cuando aplique: flujo exitoso y flujo alterno/excepción).
4. Reglas de Negocio / Notas Técnicas: Especificar cualquier restricción técnica, legal o de procesos internos de ETB (ej. normativa de facturación electrónica DIAN, regulación CRC, tiempos de respuesta SLA, infraestructura de fibra óptica GPON, integración con portal Mi ETB o CRM).
5. Tono: Profesional, técnico, analítico y colaborativo.

Instrucciones de Interacción (REGLA ESTRICTA):
- Cuando el usuario te pida crear una historia de usuario basándose en una idea muy vaga o incompleta, NO generes la historia definitiva de inmediato: haz un MÁXIMO de 2 preguntas aclaratorias concretas y breves antes de redactar la versión final.
- Cuando la idea ya sea clara (o después de que el usuario responda tus preguntas), genera la Historia de Usuario completa.

FORMATO DE SALIDA TÉCNICO:
Siempre responde en un objeto JSON válido con la siguiente estructura exacta (usando responseMimeType: "application/json"):
{
  "type": "clarification" | "user_story",
  "message": "Texto conversacional del Agile Coach para el chat (aquí van tus preguntas aclaratorias si type es 'clarification', o un breve mensaje de éxito y resumen si type es 'user_story')",
  "userStory": {
    "id": "HU-ETB-XXX",
    "title": "Título de la historia",
    "priority": "Alta" | "Media" | "Baja",
    "storyPoints": 3 | 5 | 8 | 13,
    "connextra": {
      "asA": "Rol del usuario",
      "iWant": "Acción o funcionalidad requerida",
      "soThat": "Beneficio o valor de negocio para ETB"
    },
    "acceptanceCriteria": [
      {
        "scenario": "Nombre del escenario",
        "given": "Contexto inicial (Dado que...)",
        "when": "Acción ejecutada (Cuando...)",
        "then": "Resultado esperado (Entonces...)"
      }
    ],
    "businessRules": [
      "Regla de negocio 1 (ej. DIAN, SLA, Seguridad)",
      "Regla de negocio 2"
    ]
  }
}
Nota: Si "type" es "clarification", el campo "userStory" debe ser null.`;

const SAFETY_SETTINGS = [
  {
    category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
  {
    category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
    threshold: HarmBlockThreshold.BLOCK_NONE,
  },
];

// Caché en memoria del modelo activo para evitar 404 repetitivos
let cachedFastModel = "gemini-3.8-flash";

// --- Rate Limiting en Memoria (Protección contra DoS / Abuso de Cuota) ---
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minuto
const MAX_REQUESTS_PER_WINDOW = 30; // Máximo 30 peticiones/minuto por IP

interface RateLimitRecord {
  count: number;
  resetAt: number;
}

const rateLimitMap = new Map<string, RateLimitRecord>();

function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get("x-forwarded-for");
  if (forwarded) {
    const firstIp = forwarded.split(",")[0].trim();
    if (firstIp) return firstIp;
  }
  const realIp = req.headers.get("x-real-ip");
  if (realIp) return realIp.trim();
  return "127.0.0.1";
}

function checkRateLimit(ip: string): { limited: boolean; retryAfter: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Limpieza periódica para evitar fugas de memoria
  if (rateLimitMap.size > 2000) {
    rateLimitMap.forEach((val, key) => {
      if (val.resetAt < now) {
        rateLimitMap.delete(key);
      }
    });
  }

  if (!record || record.resetAt < now) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return { limited: false, retryAfter: 0 };
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { limited: true, retryAfter: Math.max(1, retryAfter) };
  }

  record.count += 1;
  return { limited: false, retryAfter: 0 };
}

// Sanitiza los mensajes de error para no exponer URLs internas, tokens o stack traces
function sanitizeErrorMessage(err: any): string {
  const msg = String(err?.message || err || "");
  if (/API_KEY_INVALID|invalid.*api.*key|API key not valid/i.test(msg)) {
    return "La clave de API de Google Gemini no es válida o ha expirado. Por favor verifícala en la configuración superior.";
  }
  if (/RESOURCE_EXHAUSTED|quota/i.test(msg)) {
    return "Se ha superado la cuota de peticiones de Google Gemini. Por favor espera unos minutos o utiliza otra clave API.";
  }
  if (/SAFETY|blocked|HarmBlock/i.test(msg)) {
    return "La solicitud no pudo ser procesada debido a las políticas de seguridad de contenido de IA.";
  }
  if (/ECONNRESET|ETIMEDOUT|ENOTFOUND|fetch failed/i.test(msg)) {
    return "Error de red al conectar con los servidores de Google Gemini. Verifica tu conexión a internet.";
  }
  return "No fue posible procesar la consulta con el Agente de IA. Inténtalo nuevamente.";
}

export async function POST(req: NextRequest) {
  // 1. Verificación de Rate Limit
  const clientIp = getClientIp(req);
  const { limited, retryAfter } = checkRateLimit(clientIp);
  if (limited) {
    return NextResponse.json(
      {
        error: `Has superado el límite de consultas permitidas (${MAX_REQUESTS_PER_WINDOW}/min). Espera ${retryAfter} segundos.`,
      },
      {
        status: 429,
        headers: { "Retry-After": String(retryAfter) },
      }
    );
  }

  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Cuerpo de solicitud inválido (debe ser formato JSON válido)." },
        { status: 400 }
      );
    }

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { error: "Payload inválido." },
        { status: 400 }
      );
    }

    const { messages, apiKey: clientApiKey, customInstruction } = body;

    // 2. Validación de API Key
    if (clientApiKey !== undefined && clientApiKey !== null && clientApiKey !== "") {
      if (typeof clientApiKey !== "string") {
        return NextResponse.json(
          { error: "El formato de la API Key es inválido." },
          { status: 400 }
        );
      }
      const trimmedKey = clientApiKey.trim();
      // Validar formato seguro: alfanumérico, guión, guión bajo, longitud típica de Google API Key (20 - 150 chars)
      if (!/^[a-zA-Z0-9_\-]{20,150}$/.test(trimmedKey)) {
        return NextResponse.json(
          { error: "La API Key proporcionada no tiene una estructura válida de Google AI Studio." },
          { status: 400 }
        );
      }
    }

    const apiKey = (clientApiKey ? clientApiKey.trim() : null) || process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "No se ha configurado la API Key de Google Gemini. Por favor configúrala en el botón de la barra superior o en el archivo .env.local.",
        },
        { status: 400 }
      );
    }

    // 3. Validación y limitación estricta de mensajes (Prevenir agotamiento de memoria y ReDoS)
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "El historial de mensajes es inválido o está vacío." },
        { status: 400 }
      );
    }

    if (messages.length > 30) {
      return NextResponse.json(
        { error: "El historial de conversación supera el límite máximo permitido (30 mensajes)." },
        { status: 400 }
      );
    }

    // Validar cada mensaje individual
    for (let i = 0; i < messages.length; i++) {
      const m = messages[i];
      if (!m || typeof m !== "object" || typeof m.content !== "string") {
        return NextResponse.json(
          { error: `El mensaje en la posición ${i + 1} no tiene un formato válido.` },
          { status: 400 }
        );
      }
      if (m.content.length > 8000) {
        return NextResponse.json(
          { error: `El mensaje en la posición ${i + 1} excede el límite permitido de 8,000 caracteres.` },
          { status: 400 }
        );
      }
      if (m.role !== "user" && m.role !== "assistant" && m.role !== "model") {
        return NextResponse.json(
          { error: `Rol de mensaje no permitido: ${m.role}` },
          { status: 400 }
        );
      }
    }

    // 4. Validación de instrucciones de entrenamiento personalizadas
    let activeInstruction = SYSTEM_INSTRUCTION;
    if (customInstruction) {
      if (typeof customInstruction !== "string") {
        return NextResponse.json(
          { error: "Las instrucciones de entrenamiento deben ser de tipo texto." },
          { status: 400 }
        );
      }
      if (customInstruction.length > 10000) {
        return NextResponse.json(
          { error: "Las instrucciones de entrenamiento exceden el límite permitido de 10,000 caracteres." },
          { status: 400 }
        );
      }
      if (customInstruction.trim().length > 20) {
        activeInstruction = customInstruction.trim();
      }
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Format chat history for Gemini SDK
    const formattedContents = messages.map((m: { role: string; content: string }) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

    // Modelo preferente en memoria para evitar latencias de 404 repetitivas
    const preferredOrder = [
      cachedFastModel,
      "gemini-3.8-flash",
      "gemini-flash-latest",
      "gemini-3.0-flash",
      "gemini-2.5-flash",
      "gemini-1.5-flash",
      "gemini-1.5-pro",
    ];

    const modelCandidates = Array.from(new Set(preferredOrder));
    let lastError: any = null;
    let responseText = "";

    for (const modelName of modelCandidates) {
      try {
        const ultraFastConfig: any = {
          temperature: 0.1,
          responseMimeType: "application/json",
          thinkingConfig: {
            thinkingBudget: 0,
          },
        };

        let model = genAI.getGenerativeModel({
          model: modelName,
          systemInstruction: activeInstruction,
          safetySettings: SAFETY_SETTINGS,
          generationConfig: ultraFastConfig,
        });

        try {
          const chatResult = await model.generateContent({
            contents: formattedContents,
          });
          responseText = chatResult.response.text();
        } catch {
          // Si el modelo específico no soporta thinkingBudget, reintentar con config estándar
          const standardConfig = {
            temperature: 0.1,
            responseMimeType: "application/json",
          };
          model = genAI.getGenerativeModel({
            model: modelName,
            systemInstruction: activeInstruction,
            safetySettings: SAFETY_SETTINGS,
            generationConfig: standardConfig,
          });
          const chatResult = await model.generateContent({
            contents: formattedContents,
          });
          responseText = chatResult.response.text();
        }

        if (responseText) {
          cachedFastModel = modelName;
          break;
        }
      } catch (err: any) {
        lastError = err;
      }
    }

    if (!responseText) {
      console.error("[SEGURIDAD/API] Error comunicándose con Gemini:", lastError);
      return NextResponse.json(
        { error: sanitizeErrorMessage(lastError) },
        { status: 502 }
      );
    }

    // Parse the JSON response
    let cleanJson = responseText.trim();
    if (cleanJson.startsWith("```json")) {
      cleanJson = cleanJson.replace(/^```json/, "").replace(/```$/, "").trim();
    } else if (cleanJson.startsWith("```")) {
      cleanJson = cleanJson.replace(/^```/, "").replace(/```$/, "").trim();
    }

    try {
      const parsedData = JSON.parse(cleanJson);
      return NextResponse.json(parsedData);
    } catch {
      return NextResponse.json(
        {
          type: "clarification",
          message: cleanJson,
          userStory: null,
        },
        { status: 200 }
      );
    }
  } catch (error: any) {
    console.error("[SEGURIDAD/API] Excepción no controlada en /api/agent:", error);
    return NextResponse.json(
      { error: sanitizeErrorMessage(error) },
      { status: 500 }
    );
  }
}
