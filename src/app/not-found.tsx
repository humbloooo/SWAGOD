"use client";

import Link from "next/link";

export default function NotFound() {
    return (
        <main className="h-screen w-full bg-black text-white flex flex-col items-center justify-center text-center p-4">
            <h1 className="text-9xl font-black tracking-tighter text-primary animate-pulse">
                404
            </h1>
            <h2 className="text-2xl font-mono uppercase mb-8">
                SYSTEM FAILURE // PAGE NOT FOUND
            </h2>
            <p className="max-w-md text-gray-500 font-mono mb-12">
                The requested data segment has been corrupted or does not exist in this timeline.
            </p>
            <Link
                href="/"
                className="px-8 py-3 border border-white hover:bg-white hover:text-black transition-colors uppercase font-bold tracking-widest"
            >
                Return to Base
            </Link>
        </main>
    );
}
