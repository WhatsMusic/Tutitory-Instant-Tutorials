"use client";

import { useState, useEffect } from "react";
import type { ChapterContentProps } from "@/types";
import { useTranslations } from "next-intl";
import MarkdownRenderer from "./MarkdownRenderer";
import ChapterNavigation from "./ChapterNavigation";

export default function ChapterContent({
    chapter,
    onBack,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious,
    onRetry
}: ChapterContentProps) {
    const t = useTranslations("ChapterContent"); // <-- Namespace: "ChapterContent"

    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Track live streamed content updates
    const [displayedContent, setDisplayedContent] = useState(
        chapter.content || t("loadingContent")
    );

    useEffect(() => {
        setDisplayedContent(chapter.content || t("loadingContent"));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [chapter.content]);

    const handleAskQuestion = async () => {
        if (!question.trim()) return;

        setIsLoading(true);
        setError(null);
        try {
            const res = await fetch("/api/ask-question", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    tutorialTitle: chapter.tutorialTitle,
                    chapterTitle: chapter.title,
                    question
                })
            });

            if (!res.ok) {
                const errorData = await res.json();
                throw new Error(errorData.error || t("failedToGetAnswer"));
            }

            const { answer } = await res.json();
            setAnswer(answer);
        } catch (error) {
            console.error("Error getting answer:", error);
            setError(
                error instanceof Error ? error.message : t("unexpectedError")
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <ChapterNavigation
                chapter={chapter}
                onBack={onBack}
                onNext={onNext}
                onPrevious={onPrevious}
                hasNext={hasNext}
                hasPrevious={hasPrevious}
                onRetry={onRetry}
            />

            <div className="space-y-8 overflow-x-auto">
                {error ? (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
                        <strong className="font-bold">{t("errorTitle")}</strong>
                        <span className="block sm:inline">{error}</span>
                        <button
                            onClick={onRetry}
                            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
                        >
                            {t("tryAgain")}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="prose prose-lg max-w-none">
                            <MarkdownRenderer
                                key={displayedContent.length}
                                content={displayedContent}
                            />
                        </div>

                        <ChapterNavigation
                            chapter={chapter}
                            onBack={onBack}
                            onNext={onNext}
                            onPrevious={onPrevious}
                            hasNext={hasNext}
                            hasPrevious={hasPrevious}
                            onRetry={onRetry}
                        />

                        <div className="mt-12 p-6 sm:p-2 bg-gray-50 rounded-lg">
                            <h3 className="text-xl font-semibold mb-4">
                                {t("questionsAboutChapter")}
                            </h3>
                            <div className="space-y-4">
                                <input
                                    type="text"
                                    value={question}
                                    onChange={(e) => setQuestion(e.target.value)}
                                    className="w-full p-3 sm:p-1 border rounded-lg"
                                    placeholder={t("placeholderYourQuestion")}
                                />
                                <button
                                    onClick={handleAskQuestion}
                                    disabled={isLoading}
                                    className="px-6 sm:px-2 py-3 bg-[#106e56] text-white rounded-lg 
                             hover:bg-[#106e56] disabled:opacity-100 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? t("loading") : t("askQuestion")}
                                </button>
                            </div>
                            {error && (
                                <div className="mt-4 p-4 sm:p-1 bg-red-100 text-red-700 rounded-lg">
                                    <p className="font-semibold">{t("errorTitle")}</p>
                                    <p>{error}</p>
                                </div>
                            )}
                            {answer && (
                                <div className="mt-6 p-4 sm:p-1 bg-white rounded-lg">
                                    <h4 className="font-semibold mb-2">{t("answerTitle")}</h4>
                                    <MarkdownRenderer content={answer} />
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </>
    );
}
