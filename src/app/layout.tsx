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
          {children}
          <Footer />
          <Toaster position="top-center" toastOptions={{
            className: 'bg-black text-white border border-primary font-mono uppercase',
            style: { borderRadius: '0px' }
          }} />
        </Providers>
      </body>
    </html>
  );
}
