"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
const CartDrawer = dynamic(() => import("@/components/layout/CartDrawer"), { ssr: false });
const Search = dynamic(() => import("@/components/layout/Search"), { ssr: false });
import { useAppStore } from "@/lib/store";
import { formatPrice } from "@/lib/utils";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { useScrollThreshold } from "@/lib/hooks/useScrollThreshold";
import { SiteSettings } from "@/lib/types";


export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const hidden = useScrollThreshold(150);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => {
            document.body.style.overflow = "";
        };
    }, [isOpen]);

    const { items: cartItems, openCart, currency, setCurrency } = useAppStore();

    // Hydration fix for persist
    const [mounted, setMounted] = useState(false);
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load settings:", err));
    }, []);

    const itemCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const marqueeText = settings?.marqueeText || "WORLDWIDE SHIPPING AVAILABLE // FREE SHIPPING ON ORDERS OVER R2000 // NEW DROP: 'FUTURE REFLECTION' LIVE NOW // LIMITED QUANTITIES // WORLDWIDE SHIPPING AVAILABLE // FREE SHIPPING ON ORDERS OVER R2000";

    return (
        <>
            <motion.header
                variants={{
                    visible: { y: 0 },
                    hidden: { y: "-100%" },
                }}
                animate={hidden ? "hidden" : "visible"}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full h-16 bg-primary z-50 flex items-center justify-between px-6 shadow-md"
            >
                <Link href="/" className="text-white font-black text-xl tracking-tighter hover:scale-105 transition-transform">
                    SWAGOD
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Item 34: Currency Toggle Signal */}
                    <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-white/60 border-r border-white/20 pr-4 mr-2">
                        <button onClick={() => setCurrency("ZAR")} className={`${currency === "ZAR" ? 'text-white font-bold' : 'opacity-40 hover:opacity-100'} transition-all`}>ZAR</button>
                        <span className="opacity-20">/</span>
                        <button onClick={() => setCurrency("USD")} className={`${currency === "USD" ? 'text-white font-bold' : 'opacity-40 hover:opacity-100'} transition-all`}>USD</button>
                    </div>

                    <div className="hidden md:block mr-2">
                        <ThemeToggle />
                    </div>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-white hover:opacity-80 transition-opacity"
                        aria-label="Search Collection"
                    >
                        <SearchIcon size={20} className="icon-industrial" />
                    </button>

                    <button
                        onClick={openCart}
                        className="group relative flex items-center gap-2 text-white hover:opacity-80 transition-opacity"
                        aria-label="View Cart"
                    >
                        <div className="relative">
                            <ShoppingBag size={20} className="icon-industrial" />
                            {itemCount > 0 && (
                                <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary glow-primary">
                                    {itemCount}
                                </span>
                            )}
                        </div>
                        {mounted && cartItems.length > 0 && (
                            <span className="hidden sm:block font-mono text-xs font-black">
                                {formatPrice(cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0), currency)}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-white hover:opacity-80 transition-opacity pl-4 border-l border-white/20"
                        aria-label="Open Navigation Menu"
                    >
                        <Menu size={28} className="icon-industrial" />
                    </button>
                </div>
            </motion.header>

            {/* MARQUEE BANNER - Dynamic */}
            {settings?.showMarquee && (
                <div className="fixed top-16 left-0 w-full z-[40] bg-black text-white text-[10px] font-bold py-1 overflow-hidden whitespace-nowrap border-b border-gray-800">
                    <div className="animate-marquee inline-block">
                        <span className="mx-4 uppercase">{marqueeText}</span>
                    </div>
                </div>
            )}

            <CartDrawer />
            <Search isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

            {/* Mobile Menu Overlay */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                        exit={{ clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-0 bg-black z-[60] flex flex-col justify-center px-12"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-4 right-6 text-white hover:text-primary transition-colors"
                        >
                            <X size={48} />
                        </button>
                        <div className="flex flex-col space-y-4 md:space-y-8 overflow-y-auto pt-20 pb-10">
                            {[
                                { l: "Index", h: "/" },
                                { l: "Collections", h: "/shop" },
                                { l: "Tour", h: "/tour" },
                                { l: "Archive", h: "/archive" },
                                { l: "Access", h: "/login" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.l}
                                    initial={{ x: -50, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.h}
                                        className="text-5xl md:text-7xl font-black uppercase text-transparent stroke-white hover:text-primary transition-colors tracking-tighter drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_15px_rgba(255,100,0,0.8)]"
                                        style={{ WebkitTextStroke: "1px white" }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.l}
                                    </Link>
                                </motion.div>
                            ))}

                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.6 }}
                                className="pt-8 border-t border-white/10 flex items-center justify-between"
                            >
                                <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-center w-full">EST. 2026</span>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-auto pb-12"
                        >
                            <p className="text-gray-500 font-mono text-xs">
                                SWAGOD {"//"} EST. 2026 {"//"} WORLDWIDE
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
