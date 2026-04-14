import { Router } from "express"
import { sendMessage } from "../controllers/chatController.js"
import { sanitizeMessage } from "../middlewares/sanitize.js"

const router = Router()

router.post("/message", sanitizeMessage, sendMessage)

export default router