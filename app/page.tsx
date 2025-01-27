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
    <div className="container min-h-[70svh] mx-auto p-4 sm:p-1">
      <h1 className="text-3xl font-bold mb-4">Tutitory.com</h1>

      {!tutorial ? (
        <TutorialForm setTutorial={setTutorial} />
      ) : (
        <>
          <button onClick={handleReset} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Neues Tutorial erstellen
          </button>
          <TutorialDisplay tutorial={tutorial} />
          <button onClick={handleReset} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
            Neues Tutorial erstellen
          </button>
        </>
      )}
    </div>
  );
}

