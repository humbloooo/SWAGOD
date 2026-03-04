"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";

export default function ScrollToTop() {
    const [isVisible, setIsVisible] = useState(false);
    const [isScrolling, setIsScrolling] = useState(false);

    useEffect(() => {
        let scrollTimeout: NodeJS.Timeout;

        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                setIsVisible(true);
            } else {
                setIsVisible(false);
            }

            // Set scrolling state
            setIsScrolling(true);
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                setIsScrolling(false);
            }, 300); // 300ms after scroll stops
        };

        window.addEventListener("scroll", handleScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", handleScroll);
            clearTimeout(scrollTimeout);
        };
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
                    className={`fixed top-1/2 -translate-y-1/2 right-0 z-40 py-6 px-2 bg-black border-l border-y border-white/20 text-white shadow-[-5px_0_20px_rgba(0,0,0,0.6)] hover:border-primary hover:text-primary transition-all duration-500 flex flex-col items-center justify-center gap-3 group pointer-events-auto rounded-l-md ${isScrolling ? 'translate-x-[110%] opacity-50' : 'translate-x-0 opacity-100'}`}
                    aria-label="Scroll to top"
                >
                    <ArrowUp size={16} className="group-hover:-translate-y-1 transition-transform" />
                    <span className="text-[10px] font-black uppercase tracking-widest" style={{ writingMode: 'vertical-rl' }}>TOP</span>
                </motion.button>
            )}
        </AnimatePresence>
    );
}
