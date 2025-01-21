"use client";

import { Tutorial } from "../types";
import { useState, useRef, useEffect } from "react";

export default function TutorialForm({
    setTutorialPlan,
}: {
    setTutorialPlan: (plan: Tutorial) => void;
}) {
    const [topic, setTopic] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // Setze den Fokus auf das Eingabefeld
    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleGeneratePlan = async () => {
        if (!topic.trim()) {
            setError("Bitte geben Sie ein gültiges Thema ein.");
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/generate-tutorial", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ topic, chapterTitle: topic }),
            });

            console.log("Serverantwort:", res);

            if (!res.ok) {
                const errorText = await res.text();
                console.error("Fehlerdetails:", errorText);
                throw new Error(`Fehler: ${res.statusText}`);
            }

            const data = await res.json();
            setTutorialPlan(data);
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
            />
            <button
                onClick={handleGeneratePlan}
                className={`w-full py-2 rounded ${loading
                    ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                    }`}
                disabled={loading}
            >
                {loading ? "Lädt..." : "Plan generieren"}
            </button>
            {error && <p className="text-red-500 mt-4">{error}</p>}
        </div>
    );
}
