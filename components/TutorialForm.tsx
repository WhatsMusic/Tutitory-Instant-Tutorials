"use client"

import { useState } from "react"
import type { Tutorial } from "../types"

export default function TutorialForm({ setTutorial }: { setTutorial: (tutorial: Tutorial) => void }) {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/generate-toc", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic }),
      })

      let data
      try {
        data = await res.json()
      } catch (jsonError) {
        console.error("Fehler beim Parsen von JSON:", jsonError)
        throw new Error("Serverantwort konnte nicht analysiert werden")
      }

      if (!res.ok) {
        throw new Error(data.error || "Inhaltsverzeichnis konnte nicht erstellt werden")
      }

      if (!data.title || !data.description || !data.chapters || data.chapters.length === 0) {
        throw new Error("IUngültige Tutorial-Daten empfangen")
      }
      setTutorial(data)

    } catch (error) {
      console.error("Fehler beim Erstellen des Inhaltsverzeichnisses:", error)
      setError(error instanceof Error ? error.message : "Ein unerwarteter Fehler ist aufgetreten")
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Geben Sie ein Thema für Ihr Tutorial ein"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded" disabled={loading}>
        {loading ? "Generiere..." : "Tutorial generieren"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
    </form>
  )
}

