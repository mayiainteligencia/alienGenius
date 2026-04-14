import { getGeminiResponse } from "../services/geminiService.js"

export const sendMessage = async (req, res) => {
  const { message } = req.body

  try {
    const reply = await getGeminiResponse(message)
    res.json({ reply })
  } catch (error) {
    console.error("Error Gemini:", error)
    res.status(500).json({ error: "Hubo un problema al procesar tu mensaje. Intenta de nuevo." })
  }
}