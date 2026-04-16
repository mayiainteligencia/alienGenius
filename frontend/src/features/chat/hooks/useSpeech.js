import { useState, useRef, useCallback } from "react"

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition

export const useSpeech = ({ onResult }) => {
  const [listening, setListening] = useState(false)
  const recognitionRef = useRef(null)

  const startListening = useCallback(() => {
    if (!SpeechRecognition) return

    const recognition = new SpeechRecognition()
    recognition.lang = "es-MX"
    recognition.interimResults = false
    recognition.maxAlternatives = 1

    recognition.onstart = () => setListening(true)
    recognition.onresult = (e) => {
      const transcript = e.results[0][0].transcript
      onResult(transcript)
    }
    recognition.onend = () => setListening(false)
    recognition.onerror = () => setListening(false)

    recognitionRef.current = recognition
    recognition.start()
  }, [onResult])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setListening(false)
  }, [])

  const speak = useCallback((text, onEnd) => {
    if (!window.speechSynthesis) {
      onEnd?.()
      return
    }
    window.speechSynthesis.cancel()

    const clean = text.replace(/[\u{1F000}-\u{1FFFF}\u{2600}-\u{27BF}\u{FE00}-\u{FEFF}]/gu, "").trim()
    const utterance = new SpeechSynthesisUtterance(clean)
    utterance.lang = "es-MX"
    utterance.rate = 1.25
    utterance.pitch = 1.05

    const trySpeak = () => {
      const voices = window.speechSynthesis.getVoices()
      const spanishVoice = voices.find(v => v.lang.startsWith("es"))
      if (spanishVoice) utterance.voice = spanishVoice
      utterance.onend = () => onEnd?.()
      window.speechSynthesis.speak(utterance)
    }

    // Las voces pueden no estar cargadas aún
    if (window.speechSynthesis.getVoices().length === 0) {
      window.speechSynthesis.addEventListener("voiceschanged", trySpeak, { once: true })
    } else {
      trySpeak()
    }
  }, [])

  const cancelSpeak = useCallback(() => {
    window.speechSynthesis?.cancel()
  }, [])

  const supported = !!SpeechRecognition

  return { listening, startListening, stopListening, speak, cancelSpeak, supported }
}
