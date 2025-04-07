"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import TutorialDisplay from "./TutorialDisplay";
import { Chapter } from "@/types";
import { useLocale } from "next-intl";

interface Tutorial {
  title: string;
  description: string;
  chapters: Chapter[];
}

export default function TutorialForm() {
  const t = useTranslations("TutorialForm");
  const locale = useLocale();

  const [topic, setTopic] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [tutorial, setTutorial] = useState<Tutorial | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // 1) Lokalen Cache-Key bestimmen:
    const localKey = `tutorial:${topic}`.replace(/\s+/g, "_").toLowerCase();

    // 2) Check, ob bereits etwas im Local Storage liegt:
    const cachedTutorial = typeof window !== "undefined"
      ? localStorage.getItem(localKey)
      : null;

    if (cachedTutorial) {
      // Direkt aus dem Cache laden und rendern
      setTutorial(JSON.parse(cachedTutorial));
      return;
    }

    // Falls noch nichts im Cache, API-Fetch durchführen
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

      // 3) Daten validieren & lokal speichern
      if (!data.title || !data.description || !data.chapters?.length) {
        throw new Error(t("invalidTutorialData"));
      }

      // Tutorial setzen & in Local Storage ablegen
      setTutorial(data);
      localStorage.setItem(localKey, JSON.stringify(data));
    } catch (err) {
      console.error("Error generating table of contents:", err);
      setError(err instanceof Error ? err.message : t("unexpectedError"));
    } finally {
      setLoading(false);
    }
  }

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
        className="w-full bg-[#6E6910] text-white p-2 rounded"
        disabled={loading}
      >
        {loading ? t("generating") : t("btnGenerateTutorial")}
      </button>

      {error && <p className="text-red-500">{error}</p>}
      {tutorial && <TutorialDisplay tutorial={tutorial} />}
    </form>
  );
}
