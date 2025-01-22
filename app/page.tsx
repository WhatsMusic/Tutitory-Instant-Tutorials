"use client";

import { useEffect, useState } from "react";
import TutorialForm from "../components/TutorialForm";
import TutorialDisplay from "../components/TutorialDisplay";
import { Tutorial } from "../types";



export default function Home() {
  const [tutorialPlan, setTutorialPlan] = useState<Tutorial | null>(null);
  useEffect(() => {
    if (tutorialPlan) {
      if (process.env.NODE_ENV === "development") {
        console.debug("Neues Tutorial geladen:", tutorialPlan);
      }
    }
  }, [tutorialPlan]);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
      <h1
        className="text-4xl font-extrabold text-gray-800 mb-6"
        aria-label="Tutitory - Dein KI-Tutorial-Generator"
      >
        Tutitory - Dein KI-Tutorial-Generator
      </h1>
      <TutorialForm setTutorialPlan={setTutorialPlan} />
      {tutorialPlan ? (
        <TutorialDisplay tutorial={tutorialPlan} />
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-600 mb-4" role="status">
            Geben Sie ein Thema ein, um zu starten.
          </p>
        </div>

      )}

    </div>

  );
}
