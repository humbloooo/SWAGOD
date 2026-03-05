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
                const timer = setTimeout(() => {
                    setIsVisible(true);
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        setIsVisible(false);
                        sessionStorage.setItem('welcome_seen', 'true');
                    }, 5000);
                }, 1500);
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
                            <span className="font-black uppercase tracking-tighter italic">Logged in as the Administration,</span>
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
