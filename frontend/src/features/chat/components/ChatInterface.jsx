import { useRef, useEffect } from "react"
import { useChat, CHAT_STATES } from "../hooks/useChat"
import { QUICK_QUESTIONS } from "../../../constants/quickQuestions"
import alienGenius from "../../../assets/alienGenius.png"
import caraSaludo from "../../../assets/caraSaludo.mp4"
import alienThinker from "../../../assets/alienThinker.mp4"
import alienWorks from "../../../assets/alienWorks.mp4"
import alienSuccess from "../../../assets/alienSuccess.mp4"
import "./ChatInterface.css"

const BotAvatar = () => (
  <div className="avatar avatar--bot">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#2ECC71" strokeWidth="2"/>
      <rect x="7" y="14" width="10" height="7" rx="2" stroke="#2ECC71" strokeWidth="2"/>
    </svg>
  </div>
)

const UserAvatar = () => (
  <div className="avatar avatar--user">
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#fff" strokeWidth="2"/>
      <path d="M4 20c0-4 3.58-7 8-7s8 3 8 7" stroke="#fff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </div>
)

const renderText = (text) =>
  text.split("**").map((part, i) =>
    i % 2 === 1 ? <strong key={i}>{part}</strong> : part
  )

const VIDEO_MAP = {
  [CHAT_STATES.IDLE]:     caraSaludo,
  [CHAT_STATES.TYPING]:   alienThinker,
  [CHAT_STATES.THINKING]: alienThinker,
  [CHAT_STATES.WORKING]:  alienWorks,
  [CHAT_STATES.SUCCESS]:  alienSuccess,
}

export default function ChatInterface() {
  const { messages, input, setInput, typing, chatState, sendMessage, onInputFocus, onInputBlur, listening, startListening, stopListening, voiceSupported } = useChat()
  const bottomRef = useRef(null)
  const messagesRef = useRef(null)
  const videoRef = useRef(null)

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight
    }
  }, [messages, typing])

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.load()
      videoRef.current.play().catch(() => {})
    }
  }, [chatState])

  const handleKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      sendMessage(input)
    }
  }

  const currentVideo = VIDEO_MAP[chatState]

  return (
    <div className="chat-wrapper">
      <div className="chat-hero">

        {/* Video con crossfade */}
      <div className="bot-orb">
        <video
          ref={videoRef}
          key={currentVideo}
          src={currentVideo}
          autoPlay
          loop
          muted
          playsInline
          webkit-playsinline="true"
          className={`bot-video bot-video--fade`}
        />
        <div className="bot-glow" />
      </div>

      {/* Logo AIEn Genius */}
      <img
        src={alienGenius}
        alt="AIEn Genius"
        className="chat-hero__logo"
      />

        <p className="chat-hero__subtitle">Tu asesor de confianza en limpieza</p>
      </div>

      <div className="chat-box">
        <div className="chat-messages" ref={messagesRef}>
          {messages.map(msg => (
            <div key={msg.id} className={`chat-message chat-message--${msg.role}`}>
              {msg.role === "bot" ? <BotAvatar /> : <UserAvatar />}
              <div className="bubble">
                <p>{renderText(msg.text)}</p>
                <span className="bubble__time">{msg.time}</span>
              </div>
            </div>
          ))}
          {typing && (
            <div className="chat-message chat-message--bot">
              <BotAvatar />
              <div className="bubble bubble--typing">
                <span /><span /><span />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        <div className="chat-quick">
          {QUICK_QUESTIONS.map((q, i) => (
            <button key={i} className="quick-btn" onClick={() => sendMessage(q)}>
              {q}
            </button>
          ))}
        </div>

        <div className="chat-input-wrap">
          <div className="chat-input-box">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKey}
              onFocus={onInputFocus}
              onBlur={onInputBlur}
              placeholder={listening ? "Escuchando..." : "Listo para ayudarte a limpiar..."}
              className="chat-input"
            />
            {voiceSupported && (
              <button
                className={`chat-send ${listening ? "chat-send--active chat-send--listening" : ""}`}
                onClick={listening ? stopListening : startListening}
                title={listening ? "Detener micrófono" : "Hablar"}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <rect x="9" y="2" width="6" height="11" rx="3" stroke="currentColor" strokeWidth="2"/>
                  <path d="M5 10a7 7 0 0 0 14 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="12" y1="17" x2="12" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                  <line x1="9" y1="21" x2="15" y2="21" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              </button>
            )}
            <button
              className={`chat-send ${input.trim() ? "chat-send--active" : ""}`}
              onClick={() => sendMessage(input)}
              disabled={!input.trim()}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
                <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
          <p className="chat-disclaimer">
            AIEn Genius puede cometer errores. Verifica la información importante.
          </p>
        </div>
      </div>
    </div>
  )
}