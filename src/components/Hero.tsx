"use client";

import { motion } from "framer-motion";
import GlitchText from "./ui/GlitchText";
import { ArrowRight } from "lucide-react";
import Image from "next/image";

import Link from "next/link";
import { useTextScramble } from "@/hooks/useTextScramble";
import Magnetic from "./motion/Magnetic";

export default function Hero({ heroImage }: { heroImage?: string }) {

    return (
        <section className="relative flex flex-col items-center justify-center h-screen w-full overflow-hidden bg-background">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
                <Image
                    src={heroImage || "/assets/hero-bg.png"}
                    alt="Hero Background"
                    fill
                    className="object-cover opacity-80"
                    priority
                />
                <div className="absolute inset-0 bg-black/40" /> {/* Darker overlay */}
            </div>

            {/* Glitch Content */}
            <div className="z-10 flex flex-col items-center gap-8 text-center">
                <GlitchText text="SWAGOD" />
                <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="text-white/90 font-mono text-[10px] md:text-sm tracking-[0.5em] uppercase bg-black/60 px-8 py-4 backdrop-blur-md border border-white/10 glow-primary"
                >
                    {useTextScramble("TIMELESS COLLECTIONS // MODERN STYLES")}
                </motion.p>

                <div className="flex flex-col sm:flex-row items-center gap-6 mt-12">
                    {/* Primary CTA */}
                    <Magnetic>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                const element = document.getElementById('latest-drops');
                                element?.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="px-10 py-5 bg-primary text-white font-black text-xs tracking-[0.3em] hover:bg-black transition-all uppercase border border-white/10 glow-primary"
                        >
                            BROWSE COLLECTIONS
                        </motion.button>
                    </Magnetic>

                    {/* Secondary CTA */}
                    <Link href="/tour">
                        <Magnetic strength={0.2}>
                            <motion.div
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255, 0, 0, 0.05)" }}
                                whileTap={{ scale: 0.95 }}
                                className="group flex items-center gap-2 px-8 py-4 bg-transparent text-primary font-bold text-lg tracking-wider border border-primary uppercase hover:border-red-600 transition-colors cursor-pointer"
                            >
                                <span>Tour</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </motion.div>
                        </Magnetic>
                    </Link>
                </div>
            </div>

            {/* Background subtleties could go here */}
            <button
                onClick={() => {
                    const nextSection = document.getElementById('latest-drops');
                    nextSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="absolute bottom-10 left-0 w-full flex justify-center opacity-50 hover:opacity-100 hover:text-primary transition-all cursor-pointer"
            >
                <span className="text-xs uppercase tracking-[0.2em] animate-pulse">Scroll to Explore</span>
            </button>
        </section>
    );
}
