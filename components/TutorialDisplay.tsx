"use client"

import { useState } from "react"
import type { Tutorial, Chapter } from "../types"
import ChapterContent from "./ChapterContent"
import { Loader2 } from "lucide-react"

export default function TutorialDisplay({ tutorial }: { tutorial: Tutorial }) {
  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleChapterSelect = async (chapter: Chapter) => {
    if (!chapter.content) {
      setIsLoading(true)
      try {
        const res = await fetch("/api/generate-chapter", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ tutorialTitle: tutorial.title, chapterTitle: chapter.title }),
        })

        if (!res.ok) {
          const errorData = await res.json()
          throw new Error(errorData.error || "Failed to generate chapter content")
        }

        const generatedChapter = await res.json()
        chapter.content = generatedChapter.content
        setError(null)
      } catch (error) {
        console.error("Error generating chapter:", error)
        setError(error instanceof Error ? error.message : "An unexpected error occurred")
        chapter.content = "Fehler beim Laden des Kapitels. Bitte versuchen Sie es erneut."
      } finally {
        setIsLoading(false)
      }
    }
    setSelectedChapter(chapter)
  }

  const currentIndex = selectedChapter ? tutorial.chapters.findIndex((c) => c.title === selectedChapter.title) : -1

  return (
    <div className="w-full mx-auto p-6 sm:p-2 bg-white rounded-lg shadow-sm">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">{tutorial.title}</h1>
      <p className="text-lg text-gray-600 mb-8">{tutorial.description}</p>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-2 py-3 rounded relative mb-4" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error}</span>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#106e56]" />
          <span className="ml-2 text-lg text-gray-600">Kapitel wird geladen...</span>
        </div>
      ) : selectedChapter ? (
        <ChapterContent
          chapter={selectedChapter}
          onBack={() => setSelectedChapter(null)}
          onNext={() => {
            if (currentIndex < tutorial.chapters.length - 1) {
              handleChapterSelect(tutorial.chapters[currentIndex + 1])
            }
          }}
          onPrevious={() => {
            if (currentIndex > 0) {
              handleChapterSelect(tutorial.chapters[currentIndex - 1])
            }
          }}
          hasNext={currentIndex < tutorial.chapters.length - 1}
          hasPrevious={currentIndex > 0}
        />
      ) : (
        <div className="space-y-6">
          <h2 className="text-2xl font-semibold text-gray-800">Inhaltsverzeichnis</h2>
          <div className="grid gap-4">
            {tutorial.chapters.map((chapter, index) => (
              <div
                key={index}
                className="p-4 sm:p-2 bg-[#eafbf6] rounded-lg hover:bg-[#d9f2eb] transition-colors cursor-pointer"
                onClick={() => handleChapterSelect(chapter)}
              >
                <h3 className="text-xl font-medium text-gray-900 mb-2">{chapter.title}</h3>
                <p className="text-gray-600">{chapter.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

