"use client"

import { useState } from "react"
import type { ChapterContentProps } from "../types"
import ReactMarkdown from "react-markdown"
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ChapterNavigation from "./ChapterNavigation"



export default function ChapterContent({
    chapter,
    onBack,    // Receive these from parent
    onNext,    // Receive these from parent
    onPrevious, // Receive these from parent
    hasNext,   // Receive these from parent
    hasPrevious,// Receive these from parent
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
                body: JSON.stringify({ tutorialTitle: chapter.tutorialTitle, chapterTitle: chapter.title, question }),
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
            <div className="space-y-8 overflow-x-auto">
                <ChapterNavigation
                    chapter={chapter}
                    onBack={onBack}                  // Pass to ChapterNavigation
                    onNext={onNext}                  // Pass to ChapterNavigation
                    onPrevious={onPrevious}          // Pass to ChapterNavigation
                    hasNext={hasNext}                // Pass to ChapterNavigation
                    hasPrevious={hasPrevious}        // Pass to ChapterNavigation
                />

                <div className="prose prose-lg max-w-none">
                    <h2 className="text-2xl font-medium text-gray-900 mb-2">{chapter.title}</h2>
                    <p className="text-gray-600">{chapter.description}</p>
                    <ReactMarkdown
                        components={{
                            h1: ({ children }) => <h1 className="text-2xl font-bold mb-4">{String(children).replace(/\n$/, '')}</h1>,
                            h2: ({ children }) => <h2 className="text-xl font-semibold mt-8 mb-4">{children}</h2>,
                            h3: ({ children }) => <h3 className="text-xl font-medium mt-6 mb-3">{children}</h3>,
                            div: ({ children }) => <div className="mb-4">{children}</div>,
                            ul: ({ children }) => <ul className="list-disc pl-6 sm:pl-4 mb-4">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-6 sm:pl-4 mb-4">{children}</ol>,
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

                <ChapterNavigation
                    chapter={chapter}
                    onBack={onBack}                  // Pass to ChapterNavigation
                    onNext={onNext}                  // Pass to ChapterNavigation
                    onPrevious={onPrevious}          // Pass to ChapterNavigation
                    hasNext={hasNext}                // Pass to ChapterNavigation
                    hasPrevious={hasPrevious}        // Pass to ChapterNavigation
                />

                <div className="mt-12 p-6 sm:p-2 bg-gray-50 rounded-lg">
                    <h3 className="text-xl font-semibold mb-4">Questions about the chapter</h3>
                    <div className="space-y-4">
                        <input
                            type="text"
                            value={question}
                            onChange={(e) => setQuestion(e.target.value)}
                            className="w-full p-3 sm:p-1 border rounded-lg"
                            placeholder="Please type your question here..."
                        />
                        <button
                            onClick={handleAskQuestion}
                            disabled={isLoading}
                            className="px-6 sm:px-2 py-3 bg-[#106e56] text-white rounded-lg hover:bg-[#106e56] disabled:opacity-100 disabled:cursor-not-allowed"
                        >
                            {isLoading ? "Loading..." : "ask a question"}
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
                            <h4 className="font-semibold mb-2">The answer:</h4>
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

