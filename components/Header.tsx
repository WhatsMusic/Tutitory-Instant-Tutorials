

import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import EnhancedLanguageSwitcher from "./EnhancedLanguageSwitcher";

const Header = () => {
    const t = useTranslations("Header"); // <-- Namespace: "Header"

    return (
        <header className="bg-[#1F5F59] text-white p-0 top-0">
            <div className="container mx-auto flex justify-between items-center">
                <h1 className="text-xl font-bold">
                    <Link href="/" className="text-white hover:text-[#D1D3D8]">
                        {t("siteTitle")}
                    </Link>
                </h1>

                <EnhancedLanguageSwitcher />
            </div>
        </header>
    );
};

export default Header;
