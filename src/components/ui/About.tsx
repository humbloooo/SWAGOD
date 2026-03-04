"use client";

import { AboutData } from "@/lib/types";
import { motion, useScroll, useSpring } from "framer-motion";
import { useRef } from "react";

export default function About({ data }: { data: AboutData }) {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
    const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });
    // Fallback if no data
    if (!data) return null;

    return (
        <section ref={ref} className="py-24 bg-surface text-foreground relative">
            {/* Scroll Indicator specific to About Section */}
            <motion.div
                className="absolute top-0 left-0 right-0 h-1 bg-primary origin-left z-20"
                style={{ scaleX }}
            />
            <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-8">
                        {data.heading}
                    </h2>
                    <div className="w-24 h-1 bg-primary mb-8" />
                </div>
                <div className="space-y-6 font-mono text-sm md:text-base text-foreground/70">
                    {data.paragraphs?.map((p: string, i: number) => (
                        <p key={i}>{p}</p>
                    ))}
                    <p className="font-bold text-foreground uppercase tracking-widest pt-4">
                        {data.footer}
                    </p>
                </div>
            </div>
        </section>
    );
}
