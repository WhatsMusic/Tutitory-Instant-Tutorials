"use client"

import { useState } from "react"
import TutorialForm from "../components/TutorialForm"
import TutorialDisplay from "../components/TutorialDisplay"
import type { Tutorial } from "../types"

export default function Home() {
  const [tutorial, setTutorial] = useState<Tutorial | null>(null)

  return (
    <div className="container min-h-[70svh] mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Tutitory.com</h1>
      {!tutorial ? <TutorialForm setTutorial={setTutorial} /> : <TutorialDisplay tutorial={tutorial} />}
    </div>
  )
}

