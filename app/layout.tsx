import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Tutitory - Dein Tutorial-Generator",
  description: "Erstelle detaillierte Tutorials basierend auf deinen Themen.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="de">
      <body className={`${inter.variable} bg-gray-50 text-gray-800`}>
        <header className="bg-blue-500 text-white p-4">
          <div className="container mx-auto">
            <h1 className="text-xl font-bold">Tutitory</h1>
          </div>
        </header>
        <main className="container mx-auto p-6">
          {children}
        </main>
        <footer className="bg-gray-800 text-white p-4 mt-6">
          <div className="container mx-auto text-center">
            © 2023 Tutitory, All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}
