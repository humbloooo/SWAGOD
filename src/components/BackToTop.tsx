"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress: scrollProgress } = useScroll();

    useEffect(() => {
        const toggleVisibility = () => {
            if (window.scrollY > 500) {
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
                <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="fixed bottom-10 right-10 z-[100]"
                >
                    <button
                        onClick={scrollToTop}
                        className="relative w-14 h-14 bg-black text-white flex items-center justify-center hover:bg-primary transition-colors group"
                        aria-label="Back to top"
                    >
                        {/* Item 29: Circular Scroll Progress */}
                        <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none">
                            <circle
                                cx="28"
                                cy="28"
                                r="26"
                                stroke="rgba(255, 255, 255, 0.1)"
                                strokeWidth="2"
                                fill="none"
                            />
                            <motion.circle
                                cx="28"
                                cy="28"
                                r="26"
                                stroke="var(--color-primary)"
                                strokeWidth="2"
                                fill="none"
                                style={{ pathLength: scrollProgress }}
                            />
                        </svg>

                        <ArrowUp size={20} className="group-hover:-translate-y-1 transition-transform" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
