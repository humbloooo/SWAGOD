"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Home } from "lucide-react";
import Header from "@/components/layout/Header";

export default function NotFound() {
    useEffect(() => {
        // Track the 404 for analytics
        const path = window.location.pathname;
        console.warn(`[ANALYTICS] 404 Hit tracking: ${path}`);
    }, []);

    return (
        <main className="min-h-screen bg-background text-foreground flex flex-col justify-center items-center pb-[100px] pt-32 text-center">
            <Header />
            <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter text-transparent stroke-white leading-none">
                4040
            </h1>
            <p className="font-mono text-foreground/40 max-w-sm mt-8 mb-12 uppercase tracking-widest text-xs leading-loose">
                The page you are looking for does not exist.
                It may have been moved or deleted.
            </p>
            <Link
                href="/"
                className="flex items-center gap-3 px-8 py-4 border border-white/20 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
            >
                <Home size={16} />
                Return home
            </Link>
        </main>
    );
}
