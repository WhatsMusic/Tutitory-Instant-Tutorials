import Link from "next/link";
import React from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";

const Footer = () => {
    const t = useTranslations("Footer");
    const locale = useLocale();

    return (
        <footer className="bg-[#D1D3D8] text-black py-4 mt-8 bottom-0 relative mb-0 pb-0">
            <div className="container mx-auto text-center">
                {/* Example string: "© 2025 Tutitory, All rights reserved." */}
                {t("copyright")}
                <div className="mt-2">
                    <Link href={`/${locale}/imprint`} className="text-[#106e56] underline">
                        {t("imprint")}
                    </Link>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
