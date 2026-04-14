import { useState, useEffect } from "react"
import alienHouse from "../../../assets/alienHouse.png"
import "./Navbar.css"

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll)
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="navbar__logo">
        <div className="navbar__logo-icon">
          <img src={alienHouse} alt="AIEn logo" className="navbar__logo-img" />
        </div>
        <span className="navbar__logo-text">
          <span className="logo-ai">AI</span>
          <span className="logo-en">En</span>
          <sup>®</sup>
        </span>
      </div>

      <div className="navbar__tagline">Tu asistente de inteligencia artificial</div>

      <div className="navbar__badge">
        <span className="badge-dot" />
        En línea
      </div>
    </nav>
  )
}