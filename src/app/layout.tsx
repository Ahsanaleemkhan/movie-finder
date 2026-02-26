import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "MovieFinder — Discover Movies",
    template: "%s | MovieFinder",
  },
  description:
    "Discover and explore the latest movies with MovieFinder. Browse trending films, search your favorites, and watch trailers.",
  keywords: ["movies", "films", "movie finder", "trailers", "movie database"],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "MovieFinder",
    title: "MovieFinder — Discover Movies",
    description:
      "Discover and explore the latest movies with MovieFinder. Browse trending films, search your favorites, and watch trailers.",
  },
  twitter: {
    card: "summary_large_image",
    title: "MovieFinder — Discover Movies",
    description: "Discover and explore the latest movies with MovieFinder.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} dark`}>
      <body className="bg-zinc-950 text-white antialiased font-sans min-h-screen">
        {/* Navigation */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-zinc-950/90 to-transparent">
          <nav className="flex items-center justify-between px-4 md:px-12 py-4" aria-label="Main navigation">
            <Link
              href="/"
              className="text-xl md:text-2xl font-black tracking-tighter
                         text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-red-600
                         hover:from-red-400 hover:to-red-500 transition-all duration-300"
            >
              MOVIEFINDER
            </Link>

            <div className="flex items-center gap-4">
              <Link
                href="/"
                className="text-sm font-medium text-zinc-300 hover:text-white transition-colors hidden sm:block"
              >
                Home
              </Link>
              <Link
                href="/search"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full
                           bg-zinc-800/60 border border-zinc-700/40 backdrop-blur-sm
                           text-sm text-zinc-300 hover:text-white hover:bg-zinc-700/60
                           transition-all duration-200"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span className="hidden sm:inline">Search</span>
              </Link>
            </div>
          </nav>
        </header>

        {/* Main content */}
        <main>{children}</main>

        {/* Footer */}
        <footer className="border-t border-zinc-800/50 mt-16">
          <div className="px-4 md:px-12 py-8 md:py-12">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-xs text-zinc-500">
                © {new Date().getFullYear()} MovieFinder. All rights reserved.
              </p>
              <div className="flex items-center gap-6">
                <Link href="/" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  Home
                </Link>
                <Link href="/search" className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors">
                  Search
                </Link>
              </div>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
