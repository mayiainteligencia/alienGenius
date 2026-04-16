import { useState, useRef } from "react"
import { getBotResponse, createMessage } from "../services/chatService"
import { useSpeech } from "./useSpeech"

export const CHAT_STATES = {
  IDLE: "idle",
  TYPING: "typing",
  THINKING: "thinking",
  WORKING: "working",
  SUCCESS: "success",
}

export const VOICE_TURNS = {
  USER: "user",
  BOT: "bot",
}

export const useChat = () => {
  const [messages, setMessages] = useState([
    createMessage("bot", "¡Hola! Soy **AIEn Genius**, tu asesor de confianza en limpieza. ¿En qué puedo ayudarte hoy? 🌿"),
  ])
  const [input, setInput] = useState("")
  const [typing, setTyping] = useState(false)
  const [chatState, setChatState] = useState(CHAT_STATES.IDLE)
  const [voiceMode, setVoiceMode] = useState(false)
  const [voiceTurn, setVoiceTurn] = useState(VOICE_TURNS.USER)

  // Refs para evitar closures obsoletos
  const sendMessageRef = useRef(null)
  const voiceModeRef = useRef(false)

  const { listening, startListening, stopListening, speak, cancelSpeak, supported } = useSpeech({
    onResult: (transcript) => sendMessageRef.current?.(transcript),
  })

  const sendMessage = async (text) => {
    if (!text.trim()) return

    const userMsg = createMessage("user", text.trim())
    setMessages(prev => [...prev, userMsg])
    setInput("")
    setTyping(true)
    setChatState(CHAT_STATES.THINKING)
    if (voiceModeRef.current) setVoiceTurn(VOICE_TURNS.BOT)

    setTimeout(() => setChatState(CHAT_STATES.WORKING), 800)

    try {
      const reply = await getBotResponse(text.trim())
      setTyping(false)
      setChatState(CHAT_STATES.SUCCESS)
      setMessages(prev => [...prev, createMessage("bot", reply)])

      speak(reply, () => {
        if (voiceModeRef.current) {
          setVoiceTurn(VOICE_TURNS.USER)
          setChatState(CHAT_STATES.IDLE)
          setTimeout(() => startListening(), 400)
        }
      })

      if (!voiceModeRef.current) {
        setTimeout(() => setChatState(CHAT_STATES.IDLE), 3000)
      }
    } catch (error) {
      setTyping(false)
      setChatState(CHAT_STATES.IDLE)
      setMessages(prev => [...prev, createMessage("bot", `Lo siento, hubo un problema: ${error.message} 😔`)])
      if (voiceModeRef.current) {
        setVoiceTurn(VOICE_TURNS.USER)
        setTimeout(() => startListening(), 400)
      }
    }
  }

  sendMessageRef.current = sendMessage

  const enterVoiceMode = () => {
    voiceModeRef.current = true
    setVoiceMode(true)
    setVoiceTurn(VOICE_TURNS.USER)
    setChatState(CHAT_STATES.IDLE)
    setTimeout(() => startListening(), 600)
  }

  const exitVoiceMode = () => {
    voiceModeRef.current = false
    setVoiceMode(false)
    stopListening()
    cancelSpeak()
    setChatState(CHAT_STATES.IDLE)
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
    voiceMode,
    voiceTurn,
    enterVoiceMode,
    exitVoiceMode,
    voiceSupported: supported,
  }
}
