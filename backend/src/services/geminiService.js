import { getGeminiModel } from "../config/gemini.js"
import { systemPrompt } from "../prompts/systemPrompt.js"

export const getGeminiResponse = async (userMessage) => {
  const model = getGeminiModel()

  const chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: systemPrompt }],
      },
      {
        role: "model",
        parts: [{ text: "Entendido. Soy AIEn Genius, tu asesor de confianza en limpieza. Solo responderé preguntas sobre los productos de limpieza AIEn." }],
      },
    ],
  })

  const result = await chat.sendMessage(userMessage)
  const response = await result.response
  return response.text()
}