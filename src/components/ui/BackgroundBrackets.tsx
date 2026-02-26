"use client";

import { motion } from "framer-motion";

export default function BackgroundBrackets() {
    return (
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-10">
            {/* Top Left */}
            <motion.div
                animate={{ x: [0, 20, 0], y: [0, 20, 0] }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                className="absolute top-20 left-10 text-8xl font-black text-white/20 select-none"
            >
                [
            </motion.div>

            {/* Bottom Right */}
            <motion.div
                animate={{ x: [0, -30, 0], y: [0, -20, 0] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                className="absolute bottom-40 right-10 text-[12rem] font-black text-white/20 select-none"
            >
                ]
            </motion.div>

            {/* Subtle Drifter */}
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
                className="absolute top-1/2 left-1/4 text-4xl font-mono text-primary/10 select-none"
            >
                {"//"} SYSTEM_ALPHA
            </motion.div>
        </div>
    );
}
