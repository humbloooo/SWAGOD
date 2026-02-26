"use client";

import { useState } from "react";
import { HelpCircle, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const FAQS = [
    {
        q: "WHAT IS THE ARCHIVE PROTOCOL?",
        a: "THE ARCHIVE REPRESENTS OUR VAULT OF PAST DIMENSIONS. ITEMS REMOVED FROM ACTIVE ROTATION ARE PRESERVED HERE FOR HISTORICAL RECORD."
    },
    {
        q: "HOW LONG DOES TRANSMISSION TAKE?",
        a: "EXPECT DELIVERY WITHIN 3-7 SOLAR DAYS. EXPEDITED CHANNELS ARE AVAILABLE FOR PRIORITY CITIZENS."
    },
    {
        q: "CAN I CANCEL A DATA STREAM?",
        a: "ONCE AN ORDER IS INJECTED INTO THE TIMELINE, CANCELLATIONS ARE NOT POSSIBLE. WE OFFER 30-DAY RETURN PROTOCOLS."
    },
    {
        q: "ARE THE GARMENTS AUTHENTIC?",
        a: "EVERY PIECE IS CRYPTOGRAPHICALLY VERIFIED AND TAGGED WITH OUR SIGNATURE DYSTOPIAN ORANGE AUTHENTICITY SEAL."
    }
];

export default function FAQDrawer() {
    const [isOpen, setIsOpen] = useState(false);
    const [activeIndex, setActiveIndex] = useState<number | null>(null);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-24 right-6 z-[60] p-4 bg-white text-black font-black hover:bg-primary transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                aria-label="Open Support FAQ"
            >
                <HelpCircle size={24} />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex justify-end"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", damping: 30, stiffness: 300 }}
                            className="w-full max-w-lg bg-black border-l border-white/10 h-full p-8 md:p-12 overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-16">
                                <h2 className="text-4xl font-black uppercase italic tracking-tighter">SUPPORT {"//"} <span className="text-primary text-glow">FAQ</span></h2>
                                <button onClick={() => setIsOpen(false)} className="text-white/40 hover:text-white"><X size={32} /></button>
                            </div>

                            <div className="space-y-4">
                                {FAQS.map((faq, idx) => (
                                    <div key={idx} className="border-b border-white/5 py-4">
                                        <button
                                            onClick={() => setActiveIndex(activeIndex === idx ? null : idx)}
                                            className="w-full flex justify-between items-center text-left py-2 hover:text-primary transition-colors group"
                                        >
                                            <span className="font-mono text-xs font-black uppercase tracking-widest leading-relaxed pr-8">{faq.q}</span>
                                            <ChevronDown size={16} className={`transition-transform duration-300 ${activeIndex === idx ? 'rotate-180 text-primary' : 'text-white/20'}`} />
                                        </button>
                                        <AnimatePresence>
                                            {activeIndex === idx && (
                                                <motion.div
                                                    initial={{ height: 0, opacity: 0 }}
                                                    animate={{ height: "auto", opacity: 1 }}
                                                    exit={{ height: 0, opacity: 0 }}
                                                    className="overflow-hidden"
                                                >
                                                    <p className="font-mono text-[10px] text-white/40 uppercase tracking-widest leading-loose pt-4 pb-2">
                                                        {faq.a}
                                                    </p>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-32 pt-16 border-t border-white/5">
                                <p className="font-mono text-[10px] text-white/20 uppercase tracking-[0.3em] mb-4 text-center">DIRECT TRANSMISSION:</p>
                                <a href="mailto:support@swagod.co.za" className="block text-center text-lg font-black underline hover:text-primary transition-colors">SUPPORT@SWAGOD.CO.ZA</a>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
