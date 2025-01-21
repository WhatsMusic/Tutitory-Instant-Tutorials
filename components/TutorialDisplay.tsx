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
      console.warn("Tutorial content is not an array:", tutorial.content);
      setChapters([]); // Set chapters to an empty array if content is not valid
    }
  }, [tutorial.content]);

  // Neuer Code für Caching-Funktionen
  const saveToCache = (key: string, data: unknown) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const loadFromCache = (key: string) => {
    const cachedData = localStorage.getItem(key);
    return cachedData ? JSON.parse(cachedData) : null;
  };

  // Anpassen der Funktion handleGenerateChapter
  const handleGenerateChapter = async (chapterTitle: string) => {
    const cacheKey = `${tutorial.title}-${chapterTitle}`;
    const cachedChapter = loadFromCache(cacheKey);

    if (cachedChapter) {
      setActiveChapter(cachedChapter);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-tutorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic: tutorial.title, chapterTitle }),
      });

      if (!res.ok) {
        throw new Error(`Fehler beim Abrufen des Kapitels: ${res.statusText}`);
      }

      const data: Chapter = await res.json();
      setActiveChapter(data);
      saveToCache(cacheKey, data); // Kapitel im Cache speichern
    } catch (error) {
      console.error("Fehler beim Laden des Kapitels:", error);
    } finally {
      setLoading(false);
    }
  };


  if (!chapters || chapters.length === 0) {
    return <p className="text-gray-500">Keine Kapitel verfügbar.</p>;
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

// Funktion zur Kapitel-Extraktion
function extractChapters(content: string[]): Chapter[] {
  const chapters: Chapter[] = [];
  let currentChapter: Chapter | null = null;

  content.forEach((line) => {
    if (line.startsWith("**")) {
      if (currentChapter) {
        chapters.push(currentChapter);
      }
      currentChapter = { title: line.replace(/\*\*/g, ""), content: [] };
    } else if (currentChapter) {
      currentChapter.content.push(line);
    }
  });

  if (currentChapter) {
    chapters.push(currentChapter);
  }

  return chapters;
}
