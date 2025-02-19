// app/components/TutorialForm.tsx
"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TutorialDisplay from "./TutorialDisplay";
import { Chapter } from "@/types";
import { useLocale } from 'next-intl';


interface Tutorial {
  title: string;
  description: string;
  chapters: Chapter[];
  // Add other properties as needed
}


export default function TutorialForm() {
  const t = useTranslations("TutorialForm");
  const locale = useLocale();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);


    try {
      const res = await fetch(`/api/generate-toc?locale=${locale}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic })
      });

      let data;
      try {
        data = await res.json();
      } catch (jsonError) {
        console.error("Error parsing JSON:", jsonError);
        throw new Error(t("serverResponseError"));
      }

      if (!res.ok) {
        throw new Error(data.error || t("failedGenerateTOC"));
      }

      // Hier wird angenommen, dass die API alle benötigten Felder liefert.
      if (!data.title || !data.description || !data.chapters || data.chapters.length === 0) {
        throw new Error(t("invalidTutorialData"));
      }
      setTutorial(data);
    } catch (error) {
      console.error("Error generating table of contents:", error);
      setError(error instanceof Error ? error.message : t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <form id="topicForm" onSubmit={handleSubmit} className="space-y-4">
      <input
        id="topicFormInput"
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder={t("placeholderTopic")}
        className="w-full p-2 border rounded"
        required
      />
      <button
        type="submit"
        className="w-full bg-[#106e56] text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? t("generating") : t("btnGenerateTutorial")}
      </button>
      {error && <p className="text-red-500">{error}</p>}
      {tutorial && <TutorialDisplay tutorial={tutorial} />}
    </form>
  );
}
