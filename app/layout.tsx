import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tutitory - Dein Tutorial-Generator",
  description: "Erstelle detaillierte Tutorials basierend auf deinen Themen.",
  openGraph: {
    title: "Tutitory - Dein Tutorial-Generator",
    description: "Erstelle detaillierte Tutorials basierend auf deinen Themen.",
    url: "https://tutitory.com", // Die URL deiner Webseite
    type: "website",
    images: [
      {
        url: "/images/repository-open-graph-tutitory-ki-tutorial-generator.jpg", // Pfad zum Bild
        width: 1200, // Standard-Breite für Open Graph-Bilder
        height: 630,  // Standard-Höhe für Open Graph-Bilder
        alt: "Tutitory: Dein KI-Tutorial-Generator",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <head>
        <meta property="og:title" content="Tutitory - Dein Tutorial-Generator" />
        <meta
          property="og:description"
          content="Erstelle detaillierte Tutorials basierend auf deinen Themen."
        />
        <meta property="og:url" content="https://www.tutitory.com" />
        <meta property="og:type" content="website" />
        <meta
          property="og:image"
          content="/images/repository-open-graph-tutitory-ki-tutorial-generator.jpg"
        />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta
          property="og:image:alt"
          content="Tutitory: Dein KI-Tutorial-Generator"
        />
      </head>
      <body className={`bg-gray-50 text-gray-800 ${inter.className}`}>
        <header className="bg-blue-500 text-white p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/" className="text-white hover:text-white">
                Tutitory
              </Link>
            </h1>
          </div>
        </header>
        <main className="container mx-auto p-6 sm:p-1">{children}</main>
        <footer className="bg-gray-800 text-white p-4 mt-6">
          <div className="container mx-auto text-center">
            © 2025 Tutitory, All rights reserved.
            <div className="mt-2">
              <a href="/impressum" className="text-blue-400 hover:underline">
                Impressum
              </a>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
