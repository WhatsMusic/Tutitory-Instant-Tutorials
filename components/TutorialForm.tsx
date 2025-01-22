"use client";

import { Tutorial } from "../types";
import { useState, useRef } from "react";


export default function TutorialForm({
  setTutorialPlan,
}: {
  setTutorialPlan: (plan: Tutorial) => void;
}) {
  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);


  const handleGeneratePlan = async () => {
    if (!topic.trim() || topic.length < 3) {
      setError("Das Thema muss mindestens 3 Zeichen enthalten.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/generate-tutorial", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, chapterTitle: topic }),
      });

      if (!res.ok) {
        const errorText = await res.text();
        console.error("Fehlerdetails:", errorText);
        const errorMessage = errorText || `Fehler: ${res.statusText}`;
        throw new Error(errorMessage);
      }

      const data = await res.json();
      setTutorialPlan(data);
      setTopic(""); // Reset input

    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("Ein unbekannter Fehler ist aufgetreten.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
      <input
        ref={inputRef}
        type="text"
        placeholder="Gib ein Thema ein..."
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        className="w-full p-3 border border-gray-300 rounded mb-4"
        aria-label="Thema eingeben"
      />
      <button
        onClick={handleGeneratePlan}
        disabled={loading}
        aria-disabled={loading}
        className={`w-full py-2 rounded ${loading
          ? "bg-gray-400 text-gray-700 cursor-not-allowed"
          : "bg-blue-500 text-white hover:bg-blue-600"
          }`}
      >
        {loading ? "Lädt..." : "Plan generieren"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader border-t-2 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
        </div>
      )}
    </div>
  );
}
