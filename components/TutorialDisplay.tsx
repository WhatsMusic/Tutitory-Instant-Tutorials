"use client";
import { useState } from "react";
import type { Tutorial, Chapter } from "@/types";
import { useLocale, useTranslations } from "next-intl";
import ChapterContent from "./ChapterContent";
import { Loader2 } from "lucide-react";

export default function TutorialDisplay({ tutorial }: { tutorial: Tutorial }) {
  const t = useTranslations("TutorialDisplay"); // <-- Namespace: "TutorialDisplay"
  const locale = useLocale();

  const [selectedChapter, setSelectedChapter] = useState<Chapter | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleChapterSelect = async (chapter: Chapter) => {
    const localKey = `chapter:${tutorial.title}:${chapter.title}`
      .replace(/\s+/g, "_")
      .toLowerCase();

    // 2) Prüfen, ob im localStorage schon Content vorliegt
    const cachedContent = typeof window !== "undefined"
      ? localStorage.getItem(localKey)
      : null;

    // 2a) Falls ja, direkt setzen und Request überspringen
    if (cachedContent) {
      chapter.content = cachedContent;
      setSelectedChapter({ ...chapter });
      return;
    }

    // 3) Wenn kein Cache vorhanden, wie gehabt fetch/stream
    //    Hier dein existierender Code:
    setIsLoading(true);
    setError(null);


    try {
      const res = await fetch(`/api/generate-chapter?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tutorialTitle: tutorial.title,
          chapterTitle: chapter.title,
          chapterDescription: chapter.description || t("noDescription"),
        }),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || t("failedToGenerateChapter"));
      }

      // Streamed response
      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let streamedText = "";

      if (reader) {
        let firstChunkReceived = false;
        while (true) {
          const { value, done } = await reader.read();
          if (done) break;

          streamedText += decoder.decode(value, { stream: true });

          if (!firstChunkReceived) {
            setIsLoading(false);
            firstChunkReceived = true;
          }

          chapter.content = streamedText;
          setSelectedChapter({ ...chapter });
        }
      }

      // 4) Nachdem der Stream vollständig empfangen wurde:
      //    im localStorage ablegen
      if (streamedText) {
        localStorage.setItem(localKey, streamedText);
      }

      setError(null);
    } catch (error) {
      console.error("Error generating chapter:", error);
      setError(error instanceof Error ? error.message : t("unexpectedError"));
    } finally {
      // Falls das Kapitel sehr kurz ist, kann der Stream in Nullzeit kommen
      // => Double-check, das isLoading nur abgeschaltet wird, wenn noch nicht geschehen
      if (!chapter.content) {
        setIsLoading(false);
      }
    }

    // Schlussendlich das Kapitel als "selected" setzen
    setSelectedChapter(chapter);
  }

  const currentIndex = selectedChapter
    ? tutorial.chapters.findIndex((c) => c.title === selectedChapter.title)
    : -1;

  return (
    <div className="w-full mx-auto p-6 sm:p-2 bg-white rounded-lg shadow-sm">
      <h1 className="text-xl font-bold mb-4">{tutorial.title}</h1>
      <p className="text-lg text-gray-600 mb-8">{tutorial.description}</p>

      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 sm:px-2 py-3 
                     rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">{t("errorTitle")}</strong>
          <span className="block sm:inline">{error}</span>
          {selectedChapter && (
            <button
              onClick={() => handleChapterSelect(selectedChapter)}
              className="mt-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-all"
            >
              {t("tryAgain")}
            </button>
          )}
        </div>
      )}

      {isLoading && !selectedChapter?.content ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="w-8 h-8 animate-spin text-[#106e56]" />
          <span className="ml-2 text-lg text-gray-600">
            {t("chapterLoading")}
          </span>
        </div>
      ) : selectedChapter ? (
        <ChapterContent
          chapter={selectedChapter}
          onBack={() => setSelectedChapter(null)}
          onNext={() => {
            if (currentIndex < tutorial.chapters.length - 1) {
              handleChapterSelect(tutorial.chapters[currentIndex + 1]);
            }
          }}
          onPrevious={() => {
            if (currentIndex > 0) {
              handleChapterSelect(tutorial.chapters[currentIndex - 1]);
            }
          }}
          hasNext={currentIndex < tutorial.chapters.length - 1}
          hasPrevious={currentIndex > 0}
          onRetry={() => handleChapterSelect(selectedChapter)}
        />
      ) : (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold ">
            {t("tableOfContents")}
          </h2>
          <div className="grid gap-4">
            {tutorial.chapters.map((chapter, index) => (
              <div
                key={index}
                className="p-4 sm:p-2 bg-[#eafbf6] rounded-lg hover:bg-[#d9f2eb] 
                           transition-colors cursor-pointer"
                onClick={() => handleChapterSelect(chapter)}
              >
                <h3 className="text-xl font-medium mb-2">
                  {chapter.title}
                </h3>
                <p className="text-gray-600">{chapter.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
