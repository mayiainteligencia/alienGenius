import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import chatRoutes from "./routes/chatRoutes.js"

dotenv.config()

console.log("KEY:", process.env.GEMINI_API_KEY)

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["POST"],
}))

app.use(express.json())

app.use("/api/chat", chatRoutes)

app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "AIEn Genius API" })
})

app.listen(PORT, () => {
  console.log(`🚀 AIEn Genius backend corriendo en http://localhost:${PORT}`)
})
