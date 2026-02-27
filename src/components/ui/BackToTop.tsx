"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { motion, AnimatePresence, useScroll } from "framer-motion";

export default function BackToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const { scrollYProgress: scrollProgress } = useScroll();

    useEffect(() => {
        let isThrottled = false;

        const toggleVisibility = () => {
            if (isThrottled) return;
            isThrottled = true;

            setTimeout(() => {
                if (window.scrollY > 500) {
                    setIsVisible(true);
                } else {
                    setIsVisible(false);
                }
                isThrottled = false;
            }, 100);
        };

        window.addEventListener("scroll", toggleVisibility, { passive: true });
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
                        className="flex items-center gap-2 px-6 py-4 bg-background border border-foreground/20 text-foreground font-black uppercase tracking-widest text-[10px] hover:border-primary hover:text-primary transition-all group brutalist-card shadow-[0_0_15px_rgba(255,0,0,0)] hover:shadow-[0_0_15px_rgba(255,0,0,0.5)]"
                        aria-label="Back to top"
                    >
                        <span>BACK TO TOP</span>
                        <ArrowUp size={14} className="group-hover:-translate-y-1 transition-transform" />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
