import ParticlesBackground from "../components/ui/ParticlesBackground/ParticlesBackground"
import Navbar from "../components/ui/Navbar/Navbar"
import ChatInterface from "../features/chat/components/ChatInterface"
import "./App.css"

function App() {
  return (
    <div className="app">
      <div className="bg-orb bg-orb--top-left" />
      <div className="bg-orb bg-orb--top-right" />
      <div className="bg-orb bg-orb--bottom" />
      <div className="bg-grid" />

      <ParticlesBackground />
      <Navbar />
      <ChatInterface />

      <footer className="footer">
        <p>© 2025 AIEn Genius · Innovación responsable con el medio ambiente 🌿</p>
      </footer>
    </div>
  )
}

export default App