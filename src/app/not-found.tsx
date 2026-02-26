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
        <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center pb-[100px] pt-32 text-center">
            <Header />
            <h1 className="text-8xl md:text-[12rem] font-black uppercase tracking-tighter text-transparent stroke-white glitch-hover leading-none">
                404
            </h1>
            <p className="font-mono text-white/40 max-w-sm mt-8 mb-12 uppercase tracking-widest text-xs leading-loose">
                The requested coordinates lead to an empty zone. The future you are looking for has been overwritten.
            </p>
            <Link
                href="/"
                className="flex items-center gap-3 px-8 py-4 border border-white/20 font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all group"
            >
                <Home size={16} />
                Return to the timeline
            </Link>
        </main>
    );
}
