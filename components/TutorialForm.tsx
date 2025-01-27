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
        console.error("Error parsing JSON:", jsonError)
        throw new Error("Failed to parse server response")
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate table of contents")
      }

      if (!data.title || !data.description || !data.chapters || data.chapters.length === 0) {
        throw new Error("Invalid tutorial data received")
      }
      setTutorial(data)

    } catch (error) {
      console.error("Error generating table of contents:", error)
      setError(error instanceof Error ? error.message : "An unexpected error occurred")
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

