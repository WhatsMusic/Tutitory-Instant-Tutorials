

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import EnhancedLanguageSwitcher from "./EnhancedLanguageSwitcher";

const Header = () => {
    const t = useTranslations("Header"); // <-- Namespace: "Header"

    return (
        <header className="bg-[#106e56] text-white p-2">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link href="/" className="text-white hover:text-white">
                        {t("siteTitle")}
                    </Link>
                </h1>
                {/* Here is your new switcher */}
                <EnhancedLanguageSwitcher />
            </div>
        </header>
    );
};

export default Header;
