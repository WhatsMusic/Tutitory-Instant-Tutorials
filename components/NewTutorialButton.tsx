"use client";

import { Tutorial } from "@/types";
import { useState } from "react";
import { useTranslations } from "next-intl";
import TutorialForm from "./TutorialForm";

export default function NewTutorialButton() {
    const t = useTranslations("NewTutorialButton"); // <-- Namespace: "NewTutorialButton"

    const [tutorial, setTutorial] = useState<Tutorial | null>(null);

    const handleReset = () => {
        setTutorial(null);
        // console.log(tutorial);
    };

    return (
        <div>
            {tutorial ? (
                <button
                    onClick={handleReset}
                    className="mt-4 bg-[#106e56] text-white px-4 py-2 rounded"
                >
                    {t("createNewTutorial")}
                </button>
            ) : (
                <>
                    <TutorialForm />
                </>
            )}
        </div>
    );
}
