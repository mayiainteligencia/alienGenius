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

  const speak = useCallback((text) => {
    if (!window.speechSynthesis) return
    window.speechSynthesis.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = "es-MX"
    utterance.rate = 1
    utterance.pitch = 1.1

    // Buscar voz en español si hay disponible
    const voices = window.speechSynthesis.getVoices()
    const spanishVoice = voices.find(v => v.lang.startsWith("es"))
    if (spanishVoice) utterance.voice = spanishVoice

    window.speechSynthesis.speak(utterance)
  }, [])

  const supported = !!SpeechRecognition

  return { listening, startListening, stopListening, speak, supported }
}
