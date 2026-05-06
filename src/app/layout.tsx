import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

import StickyNav from "@/components/layout/StickyNav";
import EmberParticles from "@/components/layout/EmberParticles";
import ProgressBar from "@/components/layout/ProgressBar";
import Footer from "@/components/layout/Footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://d4-builds.vercel.app"),
  title: {
    default: "D4 Lord of Hatred — Complete Build Encyclopedia",
    template: "%s — D4 Builds",
  },
  description:
    "All 8 classes, every viable build, level 1 to Torment IV. Season 13 Diablo 4 build guide.",
  openGraph: {
    type: "website",
    siteName: "D4 Builds",
    title: "D4 Lord of Hatred — Complete Build Encyclopedia",
    description:
      "All 8 classes, every viable build, level 1 to Torment IV. Season 13 Diablo 4 build guide.",
  },
  twitter: {
    card: "summary",
    title: "D4 Builds — Season 13 Encyclopedia",
    description:
      "All 8 classes, every viable build, level 1 to Torment IV.",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;700;900&family=Crimson+Text:ital,wght@0,400;0,600;0,700;1,400&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ProgressBar />
        <EmberParticles />
        <StickyNav />
        {children}
        <Footer />
        <Analytics />
      </body>
    </html>
  );
}
