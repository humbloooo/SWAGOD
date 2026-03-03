"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const toggleVisibility = () => {
            // Show button after scrolling past 50vh (approx 500px depending on screen height)
            if (window.scrollY > window.innerHeight * 0.5) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }
        };

        window.addEventListener("scroll", toggleVisibility);
        return () => window.removeEventListener("scroll", toggleVisibility);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    onClick={scrollToTop}
                    className="fixed top-1/2 -translate-y-1/2 right-0 z-40 py-6 px-2 bg-black border-l border-y border-white/20 text-white shadow-[-5px_0_20px_rgba(0,0,0,0.6)] hover:border-primary hover:text-primary transition-all flex flex-col items-center justify-center gap-3 group pointer-events-auto rounded-l-md"
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>TOP</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
