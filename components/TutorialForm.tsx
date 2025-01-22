"use client"; // Indicates that this code is intended to run on the client side.

import { Tutorial } from "../types"; // Imports the Tutorial type for TypeScript type checking.
import { useState, useRef } from "react"; // Imports React hooks for state management and references.

export default function TutorialForm({ setTutorialPlan }: { setTutorialPlan: (plan: Tutorial) => void; }) {
  // Defines the TutorialForm component, which takes a setTutorialPlan function as a prop.

  const [topic, setTopic] = useState(""); // State to store the input topic.
  const [loading, setLoading] = useState(false); // State to indicate if a plan is being generated.
  const [error, setError] = useState<string | null>(null); // State to store any error messages.
  const inputRef = useRef<HTMLInputElement>(null); // Reference to the input element.

  const handleGeneratePlan = async () => { // Function to handle the generation of a tutorial plan.
    if (!topic.trim() || topic.length < 3) { // Validates that the topic is at least 3 characters long.
      setError("The topic must be at least 3 characters long.");
      return;
    }

    setLoading(true); // Sets loading state to true while generating the plan.
    setError(null); // Resets any previous error messages.
    try {
      const res = await fetch("/api/generate-tutorial", { // Sends a POST request to the API to generate a tutorial.
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, chapterTitle: topic }), // Sends the topic as both the topic and chapter title.
      });

      if (!res.ok) { // Checks if the response is not OK.
        const errorText = await res.text();
        console.error("Error details:", errorText);
        const errorMessage = errorText || `Error: ${res.statusText}`;
        throw new Error(errorMessage); // Throws an error with the response status.
      }

      const data = await res.json(); // Parses the response as JSON.
      setTutorialPlan(data); // Sets the tutorial plan with the fetched data.
      setTopic(""); // Resets the input field.

    } catch (error) { // Catches and handles any errors during the fetch or parsing process.
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unknown error occurred.");
      }
    } finally {
      setLoading(false); // Sets loading state to false after the process is complete.
    }
  };

  return (
    <div className="w-full max-w-full bg-white p-2 rounded-lg shadow-md">
      {/* Container div with styling for the form, including background, padding, and shadow */}
      <input
        ref={inputRef} // Associates the input element with the inputRef reference.
        type="text"
        placeholder="Thema hier eingeben..."
        value={topic} // Binds the input value to the topic state.
        onChange={(e) => setTopic(e.target.value)} // Updates the topic state on input change.
        className="w-full p-3 border border-gray-300 rounded mb-4"
        aria-label="Enter topic"
      />
      <button
        onClick={handleGeneratePlan} // Calls handleGeneratePlan when the button is clicked.
        disabled={loading} // Disables the button if loading is true.
        aria-disabled={loading} // Sets the aria-disabled attribute for accessibility.
        className={`w-full py-2 rounded ${loading
          ? "bg-gray-400 text-gray-700 cursor-not-allowed" // Styles for the button when disabled.
          : "bg-blue-500 text-white hover:bg-blue-600" // Styles for the button when enabled.
          }`}
      >
        {loading ? "Lädt..." : "Tutorial Erstellen"}
      </button>
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {loading && (
        <div className="flex justify-center mt-4">
          <div className="loader border-t-2 border-blue-500 rounded-full w-6 h-6 animate-spin"></div>
          {/* Displays a loading spinner if loading is true. */}
        </div>
      )}
    </div>
  );
}