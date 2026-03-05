"use client";

import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { X } from "lucide-react";

interface WelcomeBannerProps {
    enabled?: boolean;
}

export default function WelcomeBanner({ enabled }: WelcomeBannerProps) {
    const { data: session } = useSession();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (enabled && session?.user) {
            // Only show if haven't shown in this session
            const hasSeen = sessionStorage.getItem('welcome_seen');
            if (!hasSeen) {
                const timer = setTimeout(() => setIsVisible(true), 1500);
                return () => clearTimeout(timer);
            }
        }
    }, [enabled, session]);

    const handleClose = () => {
        setIsVisible(false);
        sessionStorage.setItem('welcome_seen', 'true');
    };

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ y: -100, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -100, opacity: 0 }}
                    className="fixed top-24 left-0 right-0 z-[45] flex justify-center px-4 pointer-events-none"
                >
                    <div className="bg-primary text-background px-8 py-3 flex items-center gap-6 shadow-2xl border border-white/20 pointer-events-auto">
                        <div className="flex flex-col">
                            <span className="text-[8px] font-mono font-black uppercase tracking-[0.3em] opacity-60">PERSONALIZATION_ENGINE_ACTIVE</span>
                            <span className="font-black uppercase tracking-tighter italic">WELCOME BACK, {session?.user?.name?.split(' ')[0] || 'CITIZEN'}</span>
                        </div>
                        <div className="w-[1px] h-8 bg-background/20" />
                        <button
                            onClick={handleClose}
                            className="hover:scale-110 transition-transform"
                        >
                            <X size={18} strokeWidth={3} />
                        </button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
