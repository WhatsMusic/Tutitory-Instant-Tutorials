import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const Footer = () => {
    const t = useTranslations("Footer");
    const locale = useLocale();

    return (
        <footer className="bg-[#106e56] text-white p-4 mt-6">
            <div className="container mx-auto text-center">
                {/* Example string: "© 2025 Tutitory, All rights reserved." */}
                {t("copyright")}
                <div className="mt-2">
                    <Link href={`/${locale}/imprint`} className="text-white hover:text-white underline">
                        {t("imprint")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
