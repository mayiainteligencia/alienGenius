import { GoogleGenerativeAI } from "@google/generative-ai"

export const getGeminiModel = () => {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  return genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
    generationConfig: {
      temperature: 0.7,
      maxOutputTokens: 1024,
    },
  })
}