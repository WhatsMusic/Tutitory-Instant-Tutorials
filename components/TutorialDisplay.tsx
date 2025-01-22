"use client";

import { useState, useEffect } from "react";
import { Tutorial, Chapter } from "../types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function TutorialDisplay({ tutorial }: { tutorial: Tutorial }) {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (Array.isArray(tutorial.content)) {
      setChapters(extractChapters(tutorial.content));
    }
  }, [tutorial.content]);

  const handleGenerateChapter = async (chapterTitle: string) => {
    const cacheKey = `${tutorial.title}-${chapterTitle}`;
    const cachedChapter = localStorage.getItem(cacheKey);
    if (cachedChapter) {
      try {
        setActiveChapter(JSON.parse(cachedChapter));
      } catch (cacheError) {
        console.error("Ungültige Cache-Daten:", cacheError);
        localStorage.removeItem(cacheKey);
      }
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate-chapter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: tutorial.title.trim(), chapterTitle: chapterTitle.trim() }),
      });

      // Logge die vollständige Antwort
      console.log("API-Antwort:", res);

      // Überprüfe, ob die Antwort erfolgreich ist
      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fehlertext:", errorText);
        throw new Error(`API-Fehler: ${res.status} ${res.statusText}`);
      }

      // Logge den Antworttext

      try {
        const responseBody = await res.text();
        try {
          const data: Chapter = JSON.parse(responseBody);
          setActiveChapter(data);
          localStorage.setItem(cacheKey, JSON.stringify(data));
        } catch (jsonError) {
          console.error("Fehler beim Parsen von JSON:", responseBody, jsonError);
          throw new Error("Ungültige JSON-Antwort von der API.");
        }
      } catch (error) {
        console.error("Fehler beim Abrufen oder Parsen der Daten:", error);
        alert(error instanceof Error ? error.message : "Unbekannter Fehler.");
      }


    } catch (error) {
      console.error("Fehler beim Abrufen oder Parsen der Daten:", error);
      alert(error instanceof Error ? error.message : "Unbekannter Fehler.");
    } finally {
      setLoading(false);
    }

  }



  return (
    <div className="max-w-3xl mx-auto bg-white p-6 mt-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{tutorial.title}</h2>
      {!activeChapter ? (
        <div>
          <h3 className="text-xl font-semibold mb-4">Kapitelübersicht</h3>
          <ul className="space-y-2 list-inside list-decimal">
            {chapters.map((chapter) => (
              <li key={chapter.title}>
                <button
                  onClick={() => handleGenerateChapter(chapter.title)}
                  className="text-blue-500 underline hover:text-blue-700 focus:outline-none"
                >
                  {chapter.title}
                </button>
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">{activeChapter.title}</h3>
          <div className="prose prose-blue">
            {/* Markdown wird hier gerendert */}
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {activeChapter.content.join("\n")}
            </ReactMarkdown>
          </div>
          <button
            onClick={() => setActiveChapter(null)}
            className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 focus:outline-none"
          >
            Zurück zur Kapitelübersicht
          </button>
        </div>
      )}
      {loading && <p className="text-blue-500 mt-4">Kapitel wird geladen...</p>}
    </div>
  );
}

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