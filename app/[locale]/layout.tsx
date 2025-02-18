import "@/app/globals.css";
import { Analytics } from "@vercel/analytics/react";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ReactNode } from "react";
import { routing } from "@/i18n/routing";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";
export const dynamicParams = true;

type Props = {
    children: ReactNode;
    params: Promise<{ locale: string }>;
};



export function generateStaticParams() {
    return routing.locales.map((locale) => ({ locale }));
}


export async function generateMetadata({
    params
}: Omit<Props, 'children'>) {
    const { locale } = await params;
    const t = await getTranslations({ locale, namespace: 'Layout' });


    return {
        title: t("title"),
        description: t("description"),
        metadataBase: new URL("https://tutitory.com"),
        alternates: {
            canonical: "/",
            languages: {
                "en-US": "/en-US",
                "de-DE": "/de-DE"
            }
        },
        openGraph: {
            title: t("ogTitle"),
            description: t("ogDescription"),
            url: "https://tutitory.com",
            type: "website",
            images: "/opengraph-image.jpg",
            siteName: "Tutitory"
        },
        icons: {
            icon: [
                { url: "/icon.png" },
                new URL("/icon.png", "https://tutitory.com"),
                { url: "/icon-dark.png", media: "(prefers-color-scheme: dark)" }
            ],
            apple: [
                { url: "/apple-icon.png" },
                { url: "/apple-icon-x3.png", sizes: "180x180", type: "image/png" }
            ]
        },
        robots: {
            index: true,
            follow: true,
            nocache: false,
            googleBot: {
                index: true,
                follow: true,
                noimageindex: false,
                "max-video-preview": -1,
                "max-image-preview": "large",
                "max-snippet": -1
            }
        }
    };
}



export default async function LocaleLayout({
    children,
    params
}: Props) {
    const { locale } = await params;


    // Ensure that the incoming `locale` is valid
    if (!routing.locales.includes(locale as "en" | "de")) {
        notFound();
    }
    const allMessages = await getMessages({ locale });

    // Enable static rendering
    setRequestLocale(locale);

    return (
        <html lang={locale}>
            <body>
                <NextIntlClientProvider messages={allMessages}>
                    <Header />
                    {children}
                    <Footer />
                </NextIntlClientProvider>
                <Analytics />
            </body>
        </html>
    );
}
