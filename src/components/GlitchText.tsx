"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // Wait, I need to create lib/utils first for clsx/tailwind-merge

interface GlitchTextProps {
    text: string;
    className?: string;
}

export default function GlitchText({ text, className }: GlitchTextProps) {
    return (
        <div className={cn("relative inline-block group cursor-default", className)}>
            <motion.h1
                className="relative z-10 font-bold tracking-tighter text-black uppercase"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
            >
                {text}
            </motion.h1>

            {/* Red Channel - Stronger Offset & Skew */}
            <motion.h1
                className="absolute top-0 left-0 z-0 font-bold tracking-tighter text-primary uppercase opacity-70 mix-blend-multiply"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
                animate={{
                    x: [-4, 6, -6, 4, 0],
                    y: [4, -4, 6, -6, 0],
                    skewX: [0, 15, -15, 0],
                }}
                transition={{
                    duration: 0.1,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                }}
            >
                {text}
            </motion.h1>

            {/* Ghost Channel - More Chaotic */}
            <motion.h1
                className="absolute top-0 left-0 z-0 font-bold tracking-tighter text-black/50 uppercase opacity-50"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
                animate={{
                    x: [4, -6, 6, -4, 0],
                    y: [-4, 6, -6, 4, 0],
                    skewX: [0, -10, 10, 0],
                }}
                transition={{
                    duration: 0.12,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "circInOut",
                    delay: 0.02
                }}
            >
                {text}
            </motion.h1>
        </div>
    );
}
