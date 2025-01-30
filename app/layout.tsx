import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"


const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Tutitory - Your Tutorial Generator",
  description: "Create detailed tutorials based on your topics.",
  openGraph: {
    title: "Tutitory - Your Tutorial Generator",
    description: "Create detailed tutorials based on your topics.",
    url: "https://tutitory.com",
    type: "website",
    images: [
      {
        url: "/images/repository-open-graph-tutitory-ki-tutorial-generator.jpg",
        width: 1200, // Standard width for Open Graph images
        height: 630,  // Standard height for Open Graph images
        alt: "Tutitory: Your Tutorial Generator",
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
    <html lang="en">
      <body className={`bg-gray-50 text-gray-800 ${inter.className}`}>
        <header className="bg-[#106e56] text-white p-2">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold">
              <Link href="/" className="text-white hover:text-white">
                Tutitory.com
              </Link>
            </h1>
          </div>
        </header>
        <main className="container mx-auto p-2 sm:p-2">{children}</main>
        <footer className="bg-[#106e56] text-white p-4 mt-6">
          <div className="container mx-auto text-center">
            © 2025 Tutitory, All rights reserved.
            <div className="mt-2">
              <Link href="/imprint" className="text-white hover:text-white underline">
                Imprint
              </Link>
            </div>
          </div>
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
