"use client"; // Indicates that this code is intended to run on the client side.

import { useState, useEffect } from "react"; // Imports React hooks for state management and side effects.
import { Tutorial, Chapter } from "../types"; // Imports the Tutorial and Chapter types for TypeScript type checking.
import ReactMarkdown from "react-markdown"; // Imports the ReactMarkdown component for rendering Markdown content.

export default function TutorialDisplay({ tutorial }: { tutorial: Tutorial }) { // Defines the TutorialDisplay component, which takes a tutorial prop.
  const [chapters, setChapters] = useState<Chapter[]>([]); // State to store the list of chapters.
  const [activeChapter, setActiveChapter] = useState<Chapter | null>(null); // State to store the currently active chapter.
  const [loading, setLoading] = useState(false); // State to indicate if a chapter is being loaded.

  useEffect(() => { // useEffect hook that runs when the tutorial content changes.
    if (Array.isArray(tutorial.content)) { // Checks if the tutorial content is an array.
      const extractedChapters = extractChapters(tutorial.content); // Extracts chapters from the tutorial content.
      // console.log("Extracted chapters:", extractedChapters); // Debug output for extracted chapters.
      setChapters(extractedChapters); // Sets the chapters state with the extracted chapters.
    }
  }, [tutorial.content]); // Dependency array for the useEffect hook, triggers when tutorial.content changes.

  const handleGenerateChapter = async (chapterTitle: string) => { // Function to handle chapter generation.
    const cacheKey = `${tutorial.title}-${chapterTitle}`; // Creates a cache key using the tutorial title and chapter title.
    const cachedChapter = localStorage.getItem(cacheKey); // Attempts to retrieve the chapter from local storage.
    if (cachedChapter) { // If a cached chapter exists, try to parse and set it as the active chapter.
      try {
        setActiveChapter(JSON.parse(cachedChapter));
      } catch (cacheError) { // Handles any errors during parsing.
        console.error("Invalid cache data:", cacheError);
        localStorage.removeItem(cacheKey); // Removes invalid cache data.
      }
      return;
    }

    setLoading(true); // Sets loading state to true while fetching data.
    try {
      const res = await fetch("/api/generate-chapter", { // Sends a POST request to the API to generate a chapter.
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: tutorial.title.trim(), chapterTitle: chapterTitle.trim() }),
      });

      if (!res.ok) { // Checks if the response is not OK.
        const errorText = await res.text();
        console.error("Error text:", errorText);
        throw new Error(`API error: ${res.status} ${res.statusText}`); // Throws an error with the response status.
      }

      const responseBody = await res.text(); // Reads the response body as text.
      const data: Chapter = JSON.parse(responseBody); // Parses the response body as a Chapter object.
      setActiveChapter(data); // Sets the active chapter with the fetched data.
      localStorage.setItem(cacheKey, JSON.stringify(data)); // Caches the chapter data in local storage.
      // console.log(JSON.stringify(data));
    } catch (error) { // Catches and handles any errors during the fetch or parsing process.
      console.error("Error fetching or parsing data:", error);
      alert(error instanceof Error ? error.message : "Unknown error.");
    } finally {
      setLoading(false); // Sets loading state to false after the process is complete.
    }
  };

  return (
    <div className="max-w-full mx-auto bg-white p-4 mt-5 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">{tutorial.title}</h2>

      {!activeChapter ? (
        <div>
          <div>
            {chapters.length > 0 ? (
              <div className="text-lg font-400 mb-4">
                <ReactMarkdown className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
                  {chapters
                    .filter((chapter) => chapter.title.startsWith("Beschreibung"))
                    .map((chapter) => chapter.content.join("\n\n"))
                    .join("\n\n") || "Keine Beschreibung verfügbar."}
                </ReactMarkdown>
              </div>
            ) : (
              <p>Keine Kapitel verfügbar.</p>
            )}

          </div>
          {!loading ? (
            <h3 className="text-xl font-semibold mb-4">Kapitelübersicht</h3>
          ) : (
            <div></div>
          )}
          {loading ? ( // Zeige Ladezustand an, wenn Kapitel geladen wird
            <p className="text-blue-500 text-center text-2xl blink">Kapitel wird geladen...</p>
          ) : (
            <ul className="space-y-2l text-left">
              {chapters.length > 0 ? (
                chapters
                  .filter((chapter) => !chapter.title.startsWith("Beschreibung") && !chapter.title.startsWith("Tutorialplan") && !chapter.title.startsWith("Rolle") && !chapter.title.startsWith("Zielgruppe") && !chapter.title.startsWith("Struktur") && !chapter.title.startsWith("Expertenrolle")) // Exclude chapters with "Beschreibung" in the title
                  .map((chapter, index) => (
                    <li key={index}>
                      <button
                        onClick={() => handleGenerateChapter(chapter.title)} // Sets the chapter as active when clicked.
                        className="text-blue-500 hover:text-gray-800 focus:outline-none text-left"
                      >
                        {chapter.title}
                      </button>
                    </li>
                  ))
              ) : (
                <p>Keine Kapitel verfügbar.</p>
              )}
            </ul>

          )}

        </div>
      ) : (
        <div className="prose prose-blue max-w-full px-2 py-4 sm:px-2 sm:py-6 bg-white rounded-lg shadow-md text-left">

          <ReactMarkdown className="text-gray-800 text-sm sm:text-base md:text-lg leading-relaxed">
            {activeChapter.content.join("\n\n")}
          </ReactMarkdown>
          <button
            onClick={() => setActiveChapter(null)} // Resets the active chapter to null when clicked.
            className="mt-6 w-full sm:w-auto bg-blue-500 text-white py-3 px-6 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            Zurück zur Kapitelübersicht
          </button>
        </div>
      )}
    </div>
  );

  function extractChapters(content: string[]): Chapter[] { // Function to extract chapters from the content.
    const chapters: Chapter[] = []; // Array to store extracted chapters.
    let currentChapter: Chapter | null = null; // Variable to track the current chapter being processed.

    content.forEach((line) => { // Iterates over each line of content.
      const trimmedLine = line.trim(); // Trims whitespace from the line.



      // Detects a new chapter by a Markdown heading
      if (trimmedLine.startsWith("**")) { // Checks if the line starts with Markdown-style bold, indicating a chapter title.
        if (currentChapter) { // If a current chapter exists, push it to the chapters array.
          chapters.push(currentChapter);
        }
        currentChapter = { title: trimmedLine.replace(/\*\*/g, ""), content: [] }; // Creates a new chapter with the title and empty content.
      } else if (currentChapter) { // If a current chapter exists, add the line to its content.
        currentChapter.content.push(trimmedLine || "\n");
      }
    });

    if (currentChapter) { // Pushes the last chapter to the chapters array if it exists.
      chapters.push(currentChapter);
    }

    return chapters; // Returns the array of extracted chapters.
  }
}
