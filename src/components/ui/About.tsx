"use client";

import { AboutData } from "@/lib/types";

export default function About({ data }: { data: AboutData }) {
    // Fallback if no data
    if (!data) return null;

    return (
        <section className="py-24 bg-surface text-black">
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                        {data.heading}
                    </h2>
                    <div className="w-24 h-1 bg-primary mb-8" />
                </div>
                <div className="space-y-6 font-mono text-sm md:text-base text-gray-700">
                    {data.paragraphs?.map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    ))}
                    <p className="font-bold text-black uppercase tracking-widest pt-4">
                        {data.footer}
                    </p>
                </div>
            </div>
        </section>
    );
}
