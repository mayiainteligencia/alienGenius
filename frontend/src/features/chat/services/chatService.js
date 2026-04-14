const API_URL = "http://localhost:3001/api/chat"

export const getBotResponse = async (userMessage) => {
  const response = await fetch(API_URL + "/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: userMessage }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.error || "Error al conectar con el servidor.")
  }

  const data = await response.json()
  return data.reply
}

export const createMessage = (role, text) => ({
  id: Date.now() + Math.random(),
  role,
  text,
  time: new Date().toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" }),
})