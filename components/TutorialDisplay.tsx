"use client";

import { useState, useEffect } from "react";
import { Tutorial, Chapter } from "../types";
import ReactMarkdown from "react-markdown";

export default function TutorialDisplay({ tutorial }: { tutorial: Tutorial }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);




  // Extrahiere Kapitel beim ersten Rendern
  useEffect(() => {

    if (Array.isArray(tutorial.content)) {
      const extractedChapters = extractChapters(tutorial.content);
      setChapters(extractedChapters);
    } else {
      console.error("Ungültiger Content:", tutorial.content);
      setChapters([]);
    }
  }, [tutorial.content]);

  if (!tutorial || !Array.isArray(tutorial.content)) {
    console.error("Ungültiges Tutorial-Objekt:", tutorial);
    return <p className="text-gray-500">Kein gültiges Tutorial verfügbar.</p>;
  }


  const handleGenerateChapter = async (chapterTitle: string) => {
    setLoading(true);
    let generatedContent = "";

    try {
      const res = await fetch("/api/generate-tutorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: tutorial.title, chapterTitle }),
      });

      const reader = res.body?.getReader();
      const decoder = new TextDecoder("utf-8");

      while (reader) {
        const { value, done } = await reader.read();
        if (done) break;
        generatedContent += decoder.decode(value, { stream: true });
        setActiveChapter({
          title: chapterTitle,
          content: generatedContent.split("\n").filter((line) => line.trim()),
        });
      }
    } catch (error) {
      console.error("Fehler beim Abrufen des Kapitels:", error);
    } finally {
      setLoading(false);
    }
  };


  if (!chapters || chapters.length === 0) {
    return <p className="text-gray-500">Keine Inhalte verfügbar.</p>;
  }

  return (
    <div className="max-h-screen w-full max-w-md bg-white p-6 rounded-lg shadow-md overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">{tutorial.title}</h2>

      {activeChapter ? (
        <div>
          <h3 className="text-lg font-bold mt-4 mb-2">{activeChapter.title}</h3>
          {activeChapter.content.map((paragraph, index) => (
            <div key={index} className="mb-4 text-gray-700">
              <ReactMarkdown>{paragraph}</ReactMarkdown>
            </div>
          ))}
          <button
            onClick={() => setActiveChapter(null)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Zurück zur Kapitelübersicht
          </button>
        </div>
      ) : (
        <ul className="list-inside list-decimal">
          {chapters.map((chapter, index) => (
            <li key={index} className="mb-4">
              <button
                onClick={() => handleGenerateChapter(chapter.title)}
                className="text-blue-500 underline hover:text-blue-700"
              >
                {chapter.title}
              </button>
            </li>
          ))}
        </ul>
      )}

      {loading && <p className="text-blue-500 mt-4">Das Kapitel wird geladen...</p>}
    </div>
  );
}

function extractChapters(content: string[]): Chapter[] {
  if (!Array.isArray(content)) {
    console.error("Content ist kein Array:", content);
    return [];
  }

  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

  content.forEach((line: string) => {
    // Filter: Überspringe irrelevante Zeilen
    if (
      line.includes("Generate content for the chapter titled") ||
      line.includes("The final answer is")
    ) {
      return; // Überspringe die Zeile
    }

    // Prüfe auf Kapitelstart
    if (line.startsWith("**")) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: line.replace(/\*\*/g, "").trim(), content: [] };
    } else if (currentChapter) {
      currentChapter.content.push(line.trim());
    }
  });

  // Letztes Kapitel hinzufügen
  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters;
}

