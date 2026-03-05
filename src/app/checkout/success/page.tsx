"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import confetti from "canvas-confetti";

function SuccessContent() {
    const searchParams = useSearchParams();
    const orderId = searchParams.get("id");

    useEffect(() => {
        // Elite celebration
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

        const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

        const interval: NodeJS.Timeout = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                return clearInterval(interval);
            }

            const particleCount = 50 * (timeLeft / duration);
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
            confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
        }, 250);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center pt-24">
            <motion.div
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="w-24 h-24 bg-primary rounded-full flex items-center justify-center mb-12 shadow-[0_0_50px_rgba(255,51,0,0.5)]"
            >
                <CheckCircle size={48} className="text-background" />
            </motion.div>

            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-6"
            >
                <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter">ORDER_SECURED</h1>
                <div className="inline-block px-6 py-2 bg-foreground/5 border border-foreground/10 font-mono text-sm uppercase tracking-widest text-primary">
                    TRANS-ID: {orderId || "GENERATING..."}
                </div>

                <p className="max-w-md mx-auto font-mono text-xs text-foreground/40 uppercase tracking-widest leading-loose mt-8">
                    Your transmission has been received. Our logistics nodes are currently processing your acquisition. A confirmation signal will be sent to your primary terminal shortly.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-16 max-w-lg mx-auto w-full">
                    <Link
                        href="/shop"
                        className="flex items-center justify-center gap-3 px-8 py-4 bg-foreground text-background font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all group"
                    >
                        NEW ACQUISITIONS <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        href="/"
                        className="flex items-center justify-center gap-3 px-8 py-4 border border-foreground/10 font-bold uppercase tracking-widest text-xs hover:bg-foreground/5 transition-all text-foreground/60"
                    >
                        <Home size={14} /> BASE_STATION
                    </Link>
                </div>

                <div className="pt-24 flex items-center justify-center gap-8 text-[10px] font-mono text-foreground/20 uppercase tracking-[0.3em]">
                    <div className="flex items-center gap-2"><Package size={12} /> GLOBAL_SHIPPING</div>
                    <div className="flex items-center gap-2"><CheckCircle size={12} /> AUTHENTICATED</div>
                </div>
            </motion.div>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-mono uppercase tracking-widest">DECRYPTING...</div>}>
            <SuccessContent />
        </Suspense>
    );
}
