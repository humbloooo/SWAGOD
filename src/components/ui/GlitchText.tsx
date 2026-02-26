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
                className="relative z-10 font-bold tracking-tighter text-white uppercase"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
            >
                {text}
            </motion.h1>

            {/* Red Channel - Smoother, Slower Offset */}
            <motion.h1
                className="absolute top-0 left-0 z-0 font-bold tracking-tighter text-primary uppercase opacity-70 mix-blend-multiply"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
                animate={{
                    x: [-2, 2, -1, 0],
                    y: [1, -1, 0],
                    skewX: [0, 2, -2, 0],
                }}
                transition={{
                    duration: 0.4,
                    repeat: Infinity,
                    repeatType: "mirror",
                    ease: "easeInOut",
                    repeatDelay: 0.5
                }}
            >
                {text}
            </motion.h1>

            {/* Ghost Channel - Subtle Drift */}
            <motion.h1
                className="absolute top-0 left-0 z-0 font-bold tracking-tighter text-white/30 uppercase opacity-50"
                style={{ fontSize: "clamp(4rem, 15vw, 12rem)" }}
                animate={{
                    x: [2, -2, 0],
                    y: [-1, 1, 0],
                    opacity: [0.3, 0.6, 0.3]
                }}
                transition={{
                    duration: 0.5,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay: 0.1
                }}
            >
                {text}
            </motion.h1>
        </div>
    );
}
