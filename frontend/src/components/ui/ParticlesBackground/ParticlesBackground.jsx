import { useCallback, useEffect, useState } from "react"
import Particles, { initParticlesEngine } from "@tsparticles/react"
import { loadSlim } from "@tsparticles/slim"

export default function ParticlesBackground() {
  const [init, setInit] = useState(false)

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine)
    }).then(() => setInit(true))
  }, [])

  const options = {
    fpsLimit: 60,
    particles: {
      number: { value: 55, density: { enable: true, area: 900 } },
      color: { value: ["#2ECC71", "#52D68A", "#A8F0C8", "#1A9E52"] },
      shape: { type: "circle" },
      opacity: {
        value: { min: 0.05, max: 0.35 },
        animation: { enable: true, speed: 0.6, minimumValue: 0.05, sync: false }
      },
      size: {
        value: { min: 2, max: 6 },
        animation: { enable: true, speed: 1.5, minimumValue: 1, sync: false }
      },
      links: {
        enable: true,
        distance: 140,
        color: "#2ECC71",
        opacity: 0.12,
        width: 1
      },
      move: {
        enable: true,
        speed: 0.6,
        direction: "none",
        random: true,
        straight: false,
        outModes: { default: "bounce" },
      },
    },
    interactivity: {
      events: {
        onHover: { enable: true, mode: "grab" },
        onClick: { enable: true, mode: "push" },
      },
      modes: {
        grab: { distance: 160, links: { opacity: 0.25 } },
        push: { quantity: 2 },
      },
    },
    detectRetina: true,
    background: { color: "transparent" },
  }

  if (!init) return null

  return (
    <Particles
      id="tsparticles"
      options={options}
      style={{
        position: "fixed",
        top: 0, left: 0,
        width: "100%",
        height: "100%",
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  )
}