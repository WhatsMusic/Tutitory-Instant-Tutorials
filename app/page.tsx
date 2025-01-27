"use client"
import { useState } from "react"
import TutorialForm from "../components/TutorialForm"
import TutorialDisplay from "../components/TutorialDisplay"
import type { Tutorial } from "../types"

export default function Home() {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)

  const handleReset = () => {
    setTutorial(null);
  };

  return (
    <div className="container min-h-[70svh] w-full mx-2 sm:mx-auto p-4 sm:p-2">
      <h1 className="text-3xl font-bold mb-4 text-center">Tutitory – Dein KI-Tutorial-Generator</h1>

      {/* SEO-Optimierter Einführungstext */}
      <div className="mb-6">
        <p className="text-lg text-gray-700">
          Willkommen bei <strong>Tutitory</strong> – der intelligenten Plattform zur Erstellung von
          Tutorials für jedes erdenkliche Thema! Gib ein Stichwort oder ein Thema ein, und unsere
          leistungsstarke KI generiert in Sekundenschnelle eine Schritt-für-Schritt-Anleitung,
          egal ob es sich um Technik, Kunst, Musik, oder Wissenschaft handelt. Perfekt für Anfänger,
          Fortgeschrittene oder Experten, die einen schnellen Einstieg suchen.
        </p>
      </div>

      {!tutorial ? (
        <TutorialForm setTutorial={setTutorial} />
      ) : (
        <>
          <button onClick={handleReset} className="my-4 bg-[#106e56] text-white px-4 py-2 rounded">
            Neues Tutorial erstellen
          </button>
          <TutorialDisplay tutorial={tutorial} />
          <button onClick={handleReset} className="mt-4 bg-[#106e56] text-white px-4 py-2 rounded">
            Neues Tutorial erstellen
          </button>
        </>
      )}

      {/* SEO-Text unterhalb */}
      <div className="mt-8 bg-gray-100 p-4 sm:p-2 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Was ist Tutitory?</h2>
        <p className="text-gray-700 leading-relaxed">
          Tutitory ist dein neuer Helfer, um schnell und effizient Wissen zu generieren und zu teilen.
          Unsere Plattform nutzt die neuesten Fortschritte in der Künstlichen Intelligenz, um dir
          Tutorials und Leitfäden in klarer, verständlicher Sprache bereitzustellen. Egal ob du ein
          Tutorial für „JavaScript Grundlagen“, „Meditationstechniken“ oder „DIY-Projekte“ suchst –
          Tutitory hat die Antworten.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Warum Tutitory verwenden?</h2>
        <ul className="list-disc list-inside text-gray-700 space-y-2">
          <li>Erstelle in wenigen Sekunden maßgeschneiderte Tutorials für dein spezifisches Thema.</li>
          <li>Nutze unsere leistungsstarke KI, um Schritt-für-Schritt-Anleitungen zu generieren.</li>
          <li>Greife auf gut strukturierte und leicht verständliche Inhalte zu – ideal für Anfänger und Experten.</li>
          <li>Optimiere Lerninhalte mit SEO-freundlichem Aufbau und klaren Anweisungen.</li>
        </ul>

        <h2 className="text-xl font-semibold mt-6 mb-4">Wie funktioniert es?</h2>
        <p className="text-gray-700 leading-relaxed">
          Du musst lediglich ein Thema eingeben, z. B. „Python Programmieren“, „Yoga für Anfänger“
          oder „Webflow Grundlagen“. Unsere KI analysiert dein Thema und generiert in Sekundenschnelle
          eine detaillierte Übersicht und Inhalte. Die Tutorials können jederzeit angepasst und
          erweitert werden.
        </p>

        <h2 className="text-xl font-semibold mt-6 mb-4">Suchmaschinenoptimierung (SEO)</h2>
        <p className="text-gray-700 leading-relaxed">
          Alle generierten Inhalte sind SEO-freundlich und helfen dir, deine Themen effektiv zu
          teilen. Mit klaren Strukturen, Keyword-Optimierungen und einer XML-Sitemap unterstützt
          Tutitory dich dabei, deine Inhalte online sichtbar zu machen.
        </p>
      </div>
    </div>
  );
}
