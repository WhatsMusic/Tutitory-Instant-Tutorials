
import type { ChapterContentProps } from "@/types";
import { ArrowLeft, ArrowRight, ChevronLeft } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ChapterNavigation({
    onBack,
    onNext,
    onPrevious,
    hasNext,
    hasPrevious
}: ChapterContentProps) {
    const t = useTranslations("ChapterNavigation"); // <-- Namespace: "ChapterNavigation"

    return (
        <div>
            <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
                <button
                    onClick={onBack}
                    className="flex items-center text-[#106e56] hover:text-[#267461] mb-4 sm:mb-0"
                >
                    <ChevronLeft className="w-5 h-5 mr-1" />
                    {t("backToTableOfContents")}
                </button>
                <div className="flex flex-col sm:flex-row gap-4">
                    <button
                        onClick={onPrevious}
                        disabled={!hasPrevious}
                        className="flex items-center px-4 sm:px-2 py-2 bg-[#d9f2eb] hover:bg-[#106e56] 
                       text-[#106e56] hover:text-[#d9f2eb] 
                       rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        {t("previousChapter")}
                    </button>
                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className="flex items-center px-4 sm:px-2 py-2 bg-[#d9f2eb] hover:bg-[#106e56] 
                       text-[#106e56] hover:text-[#d9f2eb] 
                       rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {t("nextChapter")}
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}
