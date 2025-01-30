import type { Metadata } from "next"
import "./globals.css";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/react"


export const metadata: Metadata = {
  title: "Tutitory - Your Tutorial Generator",
  description: "Create detailed tutorials based on your topics.",
  metadataBase: new URL('https://tutitory.com'),
  alternates: {
    canonical: '/',
    languages: {
      'en-US': '/en-US',
      'de-DE': '/de-DE',
    },
  },
  openGraph: {
    title: "Tutitory - Your Tutorial Generator",
    description: "Create detailed tutorials based on your topics.",
    url: "https://tutitory.com",
    type: "website",
    images: '/opengraph-image.jpg',
    siteName: "Tutitory",
  },
  icons: {
    icon: [
      { url: '/icon.png' },
      new URL('/icon.png', 'https://tutitory.com'),
      { url: '/icon-dark.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: [
      { url: '/apple-icon.png' },
      { url: '/apple-icon-x3.png', sizes: '180x180', type: 'image/png' },
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
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`bg-gray-50 text-gray-800`}>
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
