const INJECTION_PATTERNS = [
  /ignora\s+(tus\s+)?instrucciones/i,
  /olvida\s+(tus\s+)?instrucciones/i,
  /actúa\s+como/i,
  /actua\s+como/i,
  /eres\s+ahora/i,
  /nuevo\s+rol/i,
  /nuevo\s+prompt/i,
  /system\s+prompt/i,
  /jailbreak/i,
  /ignore\s+(your\s+)?instructions/i,
  /forget\s+(your\s+)?instructions/i,
  /act\s+as/i,
  /you\s+are\s+now/i,
  /new\s+role/i,
  /pretend\s+you/i,
  /dan\s+mode/i,
  /developer\s+mode/i,
]

const MAX_LENGTH = 500

export const sanitizeMessage = (req, res, next) => {
  const { message } = req.body

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Mensaje inválido." })
  }

  if (message.trim().length === 0) {
    return res.status(400).json({ error: "El mensaje no puede estar vacío." })
  }

  if (message.length > MAX_LENGTH) {
    return res.status(400).json({ error: `El mensaje no puede superar ${MAX_LENGTH} caracteres.` })
  }

  const hasInjection = INJECTION_PATTERNS.some(pattern => pattern.test(message))
  if (hasInjection) {
    return res.status(400).json({ error: "Solo puedo ayudarte con temas de limpieza y productos AIEn. 🌿" })
  }

  next()
}