"use client";

import { useEffect, useState } from "react";
import TutorialForm from "../components/TutorialForm";
import TutorialDisplay from "../components/TutorialDisplay";
import { Tutorial } from "../types";

export default function Home() {
  const [tutorialPlan, setTutorialPlan] = useState<Tutorial | null>(null);


  useEffect(() => {
    if (tutorialPlan) {
      console.log("Neues Tutorial geladen:", tutorialPlan);
    }
  }, [tutorialPlan]);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Tutitory - Dein KI-Tutorial-Generator</h1>
      <TutorialForm setTutorialPlan={setTutorialPlan} />
      {tutorialPlan ? (
        <TutorialDisplay tutorial={tutorialPlan} />
      ) : (
        <p className="text-gray-500">Geben Sie ein Thema ein, um zu starten.</p>
      )}
    </div>
  );
}