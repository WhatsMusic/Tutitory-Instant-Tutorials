"use client"

import { useState } from "react"
import type { Tutorial } from "../types"
import TutorialDisplay from "./TutorialDisplay"

export default function TutorialForm() {
  const [topic, setTopic] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)

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
        throw new Error("Server response could not be processed")
      }

      if (!res.ok) {
        throw new Error(data.error || "Failed to generate the table of contents")
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
        placeholder="Enter topic"
        className="w-full p-2 border rounded"
        required
      />
      <button type="submit" className="w-full bg-[#106e56] text-white p-2 rounded" disabled={loading}>
        {loading ? "Generating..." : "Generate Tutorial"}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {tutorial && <TutorialDisplay tutorial={tutorial} />}
    </form>
  )
}

