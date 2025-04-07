
import React from "react";
import TutorialForm from "@/components/TutorialForm";
import { useTranslations } from "next-intl";

export default function HomePage() {
    const t = useTranslations("Home");

    return (
        <>
            <div className="container min-h-[calc(100vh)] p-0 sm:mx-auto">
                <h1 className="text-2xl font-bold pb-4 text-center">{t("title")}</h1>

                {/* SEO-Optimized Introduction Text */}



                <div className="text-lg text-gray-700 text-center mb-20">{t("welcome")}</div>

                {/* Tutorial Form */}
                <div className="w-full md:w-3/4 mx-auto text-lg text-gray-700 text-center mb-4">
                    <TutorialForm />
                </div>



                {/* SEO Text Below */}
                <div className="w-full md:w-3/4 mx-auto mt-8 bg-gray-100 p-4 sm:p-2 rounded-lg">
                    <h2 className="text-xl font-semibold mb-4">
                        {t("content.whatIsTutitoryTitle")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t("content.whatIsTutitory")}
                    </p>

                    {/* Why Use Tutitory */}
                    <h2 className="text-xl font-semibold mt-6 mb-4">
                        {t("content.whyUseTutitoryTitle")}
                    </h2>
                    <ul className="list-disc list-inside text-gray-700 space-y-2">
                        {/* We'll map over the array in the JSON */}
                        {t.raw("content.whyUseTutitoryList").map(
                            (item: string, index: number) => (
                                <li key={index}>{item}</li>
                            )
                        )}
                    </ul>

                    {/* How It Works */}
                    <h2 className="text-xl font-semibold mt-6 mb-4">
                        {t("content.howItWorksTitle")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t("content.howItWorks")}
                    </p>

                    {/* SEO */}
                    <h2 className="text-xl font-semibold mt-6 mb-4">
                        {t("content.seoTitle")}
                    </h2>
                    <p className="text-gray-700 leading-relaxed">
                        {t("content.seoContent")}
                    </p>
                </div>
            </div>

        </>
    );
}
