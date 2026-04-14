import { GoogleGenerativeAI } from "@google/generative-ai"

export const getGeminiModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI.getGenerativeModel({
    model: "gemini-2.0-flash-lite",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 512,
    },
  })
}