import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";

const Footer = () => {
    const t = useTranslations("Footer"); // <-- Namespace: "Footer"

    return (
        <footer className="bg-[#106e56] text-white p-4 mt-6">
            <div className="container mx-auto text-center">
                {/* Example string: "© 2025 Tutitory, All rights reserved." */}
                {t("copyright")}
                <div className="mt-2">
                    <Link href="/imprint" className="text-white hover:text-white underline">
                        {t("imprint")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
