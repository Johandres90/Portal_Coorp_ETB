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

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { messages, apiKey: clientApiKey, customInstruction } = body;

    const apiKey = clientApiKey || process.env.GEMINI_API_KEY;
    const activeInstruction = customInstruction && customInstruction.trim().length > 20
      ? customInstruction.trim()
      : SYSTEM_INSTRUCTION;

    if (!apiKey) {
      return NextResponse.json(
        {
          error:
            "No se ha configurado la API Key de Google Gemini. Por favor configúrala en el botón de la barra superior o en el archivo .env.local.",
        },
        { status: 400 }
      );
    }

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: "El historial de mensajes es inválido o está vacío." },
        { status: 400 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Format chat history for Gemini SDK
    // Gemini contents expects { role: 'user' | 'model', parts: [{ text }] }
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

    // Eliminar duplicados manteniendo orden prioritario
    const modelCandidates = Array.from(new Set(preferredOrder));

    let lastError: any = null;
    let responseText = "";

    for (const modelName of modelCandidates) {
      try {
        // Intentar primero en modo Ultra-Rápido (thinkingBudget: 0 para evitar pausas de razonamiento de 60s)
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
        } catch (fastErr: any) {
          // Si el modelo específico no soporta thinkingConfig, reintentar de inmediato con config estándar
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
          cachedFastModel = modelName; // Guardar en memoria para siguientes consultas instantáneas
          console.log(`[VELOCIDAD OPTIMIZADA] Respuesta generada exitosamente con: ${modelName}`);
          break;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(
          `[FALLBACK] Modelo ${modelName} no disponible (${err?.message || err}). Cambiando de inmediato al siguiente...`
        );
      }
    }

    if (!responseText) {
      const errorMessage =
        lastError?.message || "No fue posible generar respuesta con los modelos disponibles.";
      return NextResponse.json({ error: errorMessage }, { status: 500 });
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
    } catch (parseError) {
      console.error("Error parseando respuesta JSON de Gemini:", cleanJson);
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
    console.error("Error en /api/agent:", error);
    return NextResponse.json(
      { error: error?.message || "Error interno del servidor procesando la solicitud." },
      { status: 500 }
    );
  }
}
