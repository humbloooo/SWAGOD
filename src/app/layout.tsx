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

export const metadata: Metadata = {
  title: "SWAGOD // DYSTOPIAN ARCHIVE",
  description: "Luxury Streetwear for the Unseen. Crafted in the Shadows.",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0",
  openGraph: {
    title: "SWAGOD // DYSTOPIAN ARCHIVE",
    description: "Luxury Streetwear for the Unseen.",
    url: "https://swagod.co.za",
    siteName: "SWAGOD",
    images: [
      {
        url: "/assets/swagod-logo.png",
        width: 800,
        height: 800,
      },
    ],
    locale: "en_US",
    type: "website",
  },
  manifest: "/manifest.json",
  twitter: {
    card: "summary_large_image",
    title: "SWAGOD // DYSTOPIAN ARCHIVE",
    description: "Luxury Streetwear for the Unseen.",
    images: ["/assets/swagod-logo.png"],
  },
};

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
import SiteTracker from "@/components/SiteTracker";
import { motion } from "framer-motion";

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
      </head>
      <body
        className={`${interTight.variable} antialiased bg-background text-foreground selection:bg-primary selection:text-white overflow-x-hidden`}
        suppressHydrationWarning
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
            <SiteTracker />
            {isMaintenance ? (
              <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent animate-pulse" />
                <div className="relative z-10 space-y-8">
                  <div className="inline-block px-4 py-1 border border-primary/30 bg-primary/10 text-primary font-mono text-[10px] uppercase tracking-[0.4em] mb-4">
                    ESTABLISHING SECURE CONNECTION...
                  </div>
                  <h1 className="text-6xl md:text-9xl font-black uppercase tracking-tighter leading-none glitch-text">
                    SYSTEM_<span className="text-primary italic">PAUSED</span>
                  </h1>
                  <p className="font-mono text-[10px] md:text-sm text-white/40 uppercase tracking-[0.3em] max-w-lg mx-auto leading-relaxed">
                    The Swagod protocol is undergoing a scheduled recalibration of its reality layer.
                    Retail nodes are temporarily offline. Check back during the next transmission window.
                  </p>
                  <div className="pt-12 flex flex-col items-center gap-4">
                    <div className="w-48 h-[1px] bg-white/10 relative overflow-hidden">
                      <motion.div
                        className="absolute inset-0 bg-primary w-full"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                      />
                    </div>
                    <span className="text-[9px] font-mono text-primary/60 uppercase tracking-widest animate-pulse">RECALIBRATING_TIMELINE...</span>
                  </div>
                </div>
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
