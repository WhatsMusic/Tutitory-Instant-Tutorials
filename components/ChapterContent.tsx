"use client"

import { useState } from "react"
import type { Chapter } from "../types"
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';




interface ChapterContentProps {
    chapter: Chapter
    onBack: () => void
    onNext: () => void
    onPrevious: () => void
    hasNext: boolean
    hasPrevious: boolean
}

export default function ChapterContent({
    chapter,
    onBack,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
}: ChapterContentProps) {
    const [question, setQuestion] = useState("")
    const [answer, setAnswer] = useState("")
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)


    const handleAskQuestion = async () => {
        if (!question.trim()) return

        setIsLoading(true)
        setError(null)
        try {
            const res = await fetch("/api/ask-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chapterTitle: chapter.title, question }),
            })

            if (!res.ok) {
                const errorData = await res.json()
                throw new Error(errorData.error || "Failed to get answer")
            }

            const { answer } = await res.json()
            setAnswer(answer)
        } catch (error) {
            console.error("Error getting answer:", error)
            setError(error instanceof Error ? error.message : "An unexpected error occurred")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <div className="space-y-8">
                <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                    <button onClick={onBack} className="flex items-center text-blue-600 hover:text-blue-800 mb-4 sm:mb-0">
                        <ChevronLeft className="w-5 h-5 mr-1" />
                        Zurück zum Inhaltsverzeichnis
                    </button>
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button
                            onClick={onPrevious}
                            disabled={!hasPrevious}
                            className="flex items-center px-4 sm:px-2 py-2 bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Vorheriges Kapitel
                        </button>
                        <button
                            onClick={onNext}
                            disabled={!hasNext}
                            className="flex items-center px-4 sm:px-2 py-2 bg-blue-100 text-blue-600 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Nächstes Kapitel
                            <ArrowRight className="w-4 h-4 ml-2" />
                        </button>
                    </div>
                </div>

                <div className="prose prose-lg max-w-none">
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h1 className="text-3xl font-bold mb-4">{String(children).replace(/\n$/, '')}</h1>,
                            h2: ({ children }) => <h2 className="text-2xl font-semibold mt-8 mb-4">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                            div: ({ children }) => <div className="mb-4">{children}</div>,
                            ul: ({ children }) => <ul className="list-disc pl-6 sm:pl-2 mb-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-6 sm:pl-2 mb-4">{children}</ol>,
                            li: ({ children }) => <li className="mb-2">{children}</li>,
                            blockquote: ({ children }) => (
                                <blockquote className="border-l-4 border-gray-300 pl-4 italic my-4 p-4">{children} </blockquote>
                            ),
                            code: ({ className, children, ...props }) => {
                                const match = /language-(\w+)/.exec(className || '');
                                return match ? (
                                    <SyntaxHighlighter
                                        language={match[1]}
                                        style={oneLight}
                                    >
                                        {String(children)}
                                    </SyntaxHighlighter>
                                ) : (
                                    <code className={className} {...props}>
                                        {children}
                                    </code>
                                );
                            },

                        }}
                    >
                        {chapter.content || ""}
                    </ReactMarkdown>
                </div>

                <div className="mt-12 p-6 sm:p-2 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Fragen zum Kapitel</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 sm:p-1 border rounded-lg"
                            placeholder="Stellen Sie hier Ihre Frage..."
                        />
                        <button
                            onClick={handleAskQuestion}
                            disabled={isLoading || !question.trim()}
                            className="px-6 sm:px-2 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Lädt..." : "Frage stellen"}
                        </button>
                    </div>
                    {error && (
                        <div className="mt-4 p-4 sm:p-1 bg-red-100 text-red-700 rounded-lg">
                            <p className="font-semibold">Error:</p>
                            <p>{error}</p>
                        </div>
                    )}
                    {answer && (
                        <div className="mt-6 p-4 sm:p-1 bg-white rounded-lg">
                            <h4 className="font-semibold mb-2">Antwort:</h4>
                            <ReactMarkdown
                                components={{
                                    div: ({ children }) => <div className="mb-2">{children}</div>,
                                    ul: ({ children }) => <ul className="list-disc pl-6 sm:pl-2 mb-2">{children}</ul>,
                                    ol: ({ children }) => <ol className="list-decimal pl-6 sm:pl-2 mb-2">{children}</ol>,
                                    li: ({ children }) => <li className="mb-1 sm:pl-2">{children}</li>,
                                }}
                            >
                                {answer}
                            </ReactMarkdown>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

