import type { Metadata } from "next";
import { Inter_Tight } from "next/font/google";
import "./globals.css";

const interTight = Inter_Tight({
  variable: "--font-inter-tight",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
  preload: true,
});

import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata();

import { Providers } from "@/components/ui/Providers";
import { ThemeProvider } from "@/components/ui/ThemeProvider";
import FAQDrawer from "@/components/ui/FAQDrawer";
import AdminQuickLinks from "@/components/ui/AdminQuickLinks";
import { getSettings } from "@/lib/db";
import { validateEnv } from "@/lib/env";

// Run validation safely on backend or client 
if (typeof window === 'undefined') {
  validateEnv();
}
import Footer from "@/components/layout/Footer";
import { Toaster } from "sonner";
import ScrollProgress from "@/components/ui/ScrollProgress";
import ScrollToTop from "@/components/ui/ScrollToTop";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getSettings();
  const isMaintenance = settings?.maintenanceMode;

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://firestore.googleapis.com" />
        <link rel="preconnect" href="https://firebasestorage.googleapis.com" />
      </head>
      <body
        className={`${interTight.variable} antialiased bg-background text-text selection:bg-primary selection:text-white overflow-x-hidden`}
      >
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-primary focus:text-black focus:font-black uppercase tracking-widest outline-none ring-2 ring-white">
          SKIP TO MAIN CONTENT
        </a>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Providers>
            <div className="grain-overlay" />
            <div className="scanline-overlay" />
            <ScrollProgress />
            <ScrollToTop />
            {isMaintenance ? (
              <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter mb-6">SYSTEM_PAUSED</h1>
                <p className="font-mono text-xs text-white/40 uppercase tracking-widest max-w-sm">The timeline is being recalibrated. Return shortly for the next transmission.</p>
              </main>
            ) : (
              children
            )}
            <Footer />
            <FAQDrawer />
            <AdminQuickLinks />
            <Toaster position="bottom-right" theme="dark" />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
