import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: {
    template: "%s | SWAGOD",
    default: "SWAGOD // FUTURE WEAR",
  },
  description: "Premium Streetwear. Wear the Future. Fear the Past. Est. 2026.",
  openGraph: {
    title: "SWAGOD",
    description: "Premium Streetwear. Wear the Future. Fear the Past.",
    url: "https://swagod.com",
    siteName: "SWAGOD",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "SWAGOD",
    description: "Premium Streetwear. Wear the Future. Fear the Past.",
  },
  icons: {
    icon: "/favicon.svg",
  },
};

import { Providers } from "@/components/Providers";
import Footer from "@/components/Footer";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/ScrollProgress";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${interTight.variable} antialiased bg-background text-text selection:bg-primary selection:text-white overflow-x-hidden`}
      >
        <Providers>
          <div className="grain-overlay" />
          <div className="scanline-overlay" />
          <ScrollProgress />
          {children}
          <Footer />
          <Toaster position="bottom-right" theme="dark" />
        </Providers>
      </body>
    </html>
  );
}
