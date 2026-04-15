import { useState } from "react"
import { getBotResponse, createMessage } from "../services/chatService"
import { useSpeech } from "./useSpeech"

export const CHAT_STATES = {
  IDLE: "idle",
  TYPING: "typing",
  THINKING: "thinking",
  WORKING: "working",
  SUCCESS: "success",
}

export const useChat = () => {
  const [messages, setMessages] = useState([
    createMessage("bot", "¡Hola! Soy **AIEn Genius**, tu asesor de confianza en limpieza. ¿En qué puedo ayudarte hoy? 🌿"),
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [chatState, setChatState] = useState(CHAT_STATES.IDLE)

  const { listening, startListening, stopListening, speak, supported } = useSpeech({
    onResult: (transcript) => sendMessage(transcript),
  })

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMsg = createMessage("user", text.trim())
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setTyping(true)
    setChatState(CHAT_STATES.THINKING)

    setTimeout(() => setChatState(CHAT_STATES.WORKING), 800)

    try {
      const reply = await getBotResponse(text.trim())
      setTyping(false)
      setChatState(CHAT_STATES.SUCCESS)
      const botMsg = createMessage("bot", reply)
      setMessages(prev => [...prev, botMsg])
      speak(reply)

      setTimeout(() => setChatState(CHAT_STATES.IDLE), 3000)
    } catch (error) {
      setTyping(false)
      setChatState(CHAT_STATES.IDLE)
      const errMsg = createMessage("bot", `Lo siento, hubo un problema: ${error.message} 😔`)
      setMessages(prev => [...prev, errMsg])
    }
  }

  const onInputFocus = () => {
    if (chatState === CHAT_STATES.IDLE) setChatState(CHAT_STATES.TYPING)
  }

  const onInputBlur = () => {
    if (chatState === CHAT_STATES.TYPING) setChatState(CHAT_STATES.IDLE)
  }

  return {
    messages,
    input,
    setInput,
    typing,
    chatState,
    sendMessage,
    onInputFocus,
    onInputBlur,
    listening,
    startListening,
    stopListening,
    voiceSupported: supported,
  }
}