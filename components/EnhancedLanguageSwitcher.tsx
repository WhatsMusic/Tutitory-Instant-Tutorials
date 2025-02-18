"use client";

import { useState, useTransition } from "react";
import { useLocale } from "next-intl";

import { ChevronDown } from "lucide-react"; // example icons from lucide-react
import clsx from "clsx";
import { useRouter } from "next/navigation";

const AVAILABLE_LOCALES = [
    { code: "en", label: "English", icon: "🇬🇧" },
    { code: "de", label: "Deutsch", icon: "🇩🇪" }
    // add more if needed
];

export default function EnhancedLanguageSwitcher() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, startTransition] = useTransition();
    const locale = useLocale();
    const router = useRouter();

    function switchLocale(nextLocale: string) {
        // Start transition to avoid blocking UI
        startTransition(() => {
            router.push(`/${nextLocale}`);
            setIsOpen(false);
        });
    }

    const currentLocaleData = AVAILABLE_LOCALES.find(l => l.code === locale);

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                disabled={isPending}
                className={clsx(
                    "inline-flex items-center gap-2 px-3 py-2 text-sm font-medium",
                    "text-white bg-[#106e56] hover:bg-[#0b624d]",
                    "border border-transparent rounded-full shadow-sm",
                    "focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#106e56]",
                    isPending && "opacity-70 cursor-wait"
                )}
            >
                {/* WICHTIG: w-5 h-5 + flex-shrink-0 verhindert ungewolltes Skalie­ren */}
                <span className="flex items-center gap-1 whitespace-nowrap">
                    {currentLocaleData?.icon} {currentLocaleData?.label}
                </span>
                <ChevronDown className="w-8 h-8 flex-shrink-0" />
            </button>

            {isOpen && (
                <div
                    className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg 
                     ring-1 ring-black ring-opacity-5 z-50"
                >
                    <ul className="py-1">
                        {AVAILABLE_LOCALES.map(({ code, label, icon }) => (
                            <li key={code}>
                                <button
                                    onClick={() => switchLocale(code)}
                                    disabled={isPending}
                                    className={clsx(
                                        "flex items-center w-full px-4 py-2 text-sm text-gray-700",
                                        "hover:bg-gray-100 hover:text-gray-900 transition-colors",
                                        code === locale && "font-semibold bg-gray-100"
                                    )}
                                >
                                    <span className="mr-2">{icon}</span>
                                    {label}
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
