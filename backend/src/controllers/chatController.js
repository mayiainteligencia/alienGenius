import { getGeminiResponse } from "../services/geminiService.js"

const INJECTION_PATTERNS = [
  /ignora\s+(tus\s+)?(instrucciones|reglas|sistema|prompt)/i,
  /ignore\s+(your\s+)?(instructions|rules|system|prompt)/i,
  /eres\s+ahora/i,
  /you\s+are\s+now/i,
  /actúa\s+como/i,
  /act\s+as/i,
  /nuevo\s+rol/i,
  /new\s+role/i,
  /olvida\s+(todo|tus)/i,
  /forget\s+(everything|your)/i,
  /system\s*prompt/i,
  /\[system\]/i,
  /<system>/i,
  /jailbreak/i,
  /DAN\b/,
]

export const sendMessage = async (req, res) => {
  const { message } = req.body

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensaje inválido." })
  }

  if (message.trim().length === 0) {
    return res.status(400).json({ error: "El mensaje no puede estar vacío." })
  }

  if (message.length > 1000) {
    return res.status(400).json({ error: "El mensaje es demasiado largo. Máximo 1000 caracteres." })
  }

  const isInjectionAttempt = INJECTION_PATTERNS.some((pattern) => pattern.test(message))
  if (isInjectionAttempt) {
    return res.status(200).json({
      reply: "Solo puedo ayudarte con preguntas sobre los productos de limpieza AIEn (Pinol, Cloralex, Ensueño, Microdyn y Citrex). ¿En qué puedo ayudarte? 🌿",
    })
  }

  try {
    const reply = await getGeminiResponse(message)
    res.json({ reply })
  } catch (error) {
    console.error("Error Gemini:", error)
    res.status(500).json({ error: "Hubo un problema al procesar tu mensaje. Intenta de nuevo." })
  }
}