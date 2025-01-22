"use client"; // Indicates that this code is intended to run on the client side.

import { useEffect, useState } from "react"; // Imports React hooks for state management and side effects.
import TutorialForm from "../components/TutorialForm"; // Imports the TutorialForm component module.
import TutorialDisplay from "../components/TutorialDisplay"; // Imports the TutorialDisplay component module.
import { Tutorial } from "../types"; // Imports the Tutorial type for TypeScript type checking.

export default function Home() { // Defines the main component of the page.
  const [tutorialPlan, setTutorialPlan] = useState<Tutorial | null>(null); // Initializes state for the tutorial object, which can be either a Tutorial or null.

  useEffect(() => { // useEffect hook that runs when the tutorialPlan state changes.
    if (tutorialPlan) { // Checks if a tutorialPlan exists.
      if (process.env.NODE_ENV === "development") { // Checks if the environment is in development mode.
        console.debug("New tutorial loaded:", tutorialPlan); // Logs a debug message to the console when a new tutorial is loaded.
      }
    }
  }, [tutorialPlan]); // Dependency array for the useEffect hook, triggers when tutorialPlan changes.

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-blue-100 flex flex-col items-center justify-center px-2 py-6 sm:px-2 lg:px-2">
      {/* Container div with styling for the entire page, including background gradient and centered alignment */}
      <h2
        className="text-4xl font-extrabold text-gray-800 mb-6"
        aria-label="Tutitory - Your AI Tutorial Generator"
      >
        Tutitory
      </h2>
      <span className="text-2xl font-extrabold text-gray-800 mb-6">Dein KI Tutorial Generator</span>
      {/* Main heading of the page with a descriptive aria-label for accessibility */}
      <TutorialForm setTutorialPlan={setTutorialPlan} />
      {/* Embeds the TutorialForm component, passing the setTutorialPlan function as a prop */}
      {tutorialPlan ? (
        <TutorialDisplay tutorial={tutorialPlan} />
      ) : (
        <div className="flex flex-col items-center">
          <p className="text-gray-600 mb-4" role="status">
          </p>
        </div>
      )}
      {/* Conditional rendering: If a tutorialPlan exists, the TutorialDisplay component is shown; otherwise, a prompt to enter a topic is displayed */}
    </div>
  );
}