"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search as SearchIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
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
                className="fixed top-0 left-0 w-full h-16 bg-primary z-50 flex items-center justify-between px-4 md:px-6 shadow-md"
            >
                {/* Left Side: Navigation Menu Toggle */}
                <div className="flex items-center w-[100px]">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-white hover:opacity-80 transition-opacity flex items-center gap-2"
                        aria-label="Open Navigation Menu"
                    >
                        <Menu size={28} className="icon-industrial" />
                    </button>
                </div>

                {/* Center: Logo & Brand Name */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                    <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-sm glow-primary bg-white">
                            <Image src="/assets/swagod-logo.png" alt="Swagod Logo" fill className="object-cover" />
                        </div>
                        <span className="text-white font-black text-xl tracking-widest uppercase">SWAGOD</span>
                    </Link>
                </div>

                {/* Right Side: Tools, Currency, Theme & Cart */}
                <div className="flex items-center justify-end w-[150px] md:w-[250px] gap-3 md:gap-5">
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
                </div>
            </motion.header>

            {/* MARQUEE BANNER - Dynamic */}
            {mounted && settings?.showMarquee && (
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
                        initial={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}
                        exit={{ clipPath: "polygon(0 0, 0 0, 0 100%, 0 100%)" }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="fixed inset-y-0 left-0 w-[85vw] md:w-[40vw] bg-black/95 backdrop-blur-md z-[60] border-r border-white/10 flex flex-col px-8 md:px-12 shadow-[0_0_40px_rgba(255,100,0,0.15)]"
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute top-6 right-6 text-white hover:text-primary transition-colors"
                        >
                            <X size={32} />
                        </button>
                        <div className="flex flex-col space-y-6 md:space-y-8 overflow-y-auto pt-24 pb-10">
                            {[
                                { l: "Home", h: "/" },
                                { l: "Collections", h: "/shop" },
                                { l: "Tour", h: "/tour" },
                                { l: "Archive", h: "/archive" },
                                { l: "Admin Login", h: "/login" },
                            ].map((item, i) => (
                                <motion.div
                                    key={item.l}
                                    initial={{ x: -30, opacity: 0 }}
                                    animate={{ x: 0, opacity: 1 }}
                                    exit={{ x: -20, opacity: 0 }}
                                    transition={{ delay: i * 0.1, duration: 0.3 }}
                                >
                                    <Link
                                        href={item.h}
                                        className="text-4xl md:text-5xl lg:text-6xl font-black uppercase text-transparent stroke-white hover:text-primary transition-colors tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] hover:drop-shadow-[0_0_15px_rgba(255,100,0,0.8)] leading-tight"
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
                                className="pt-8 border-t border-white/10 flex items-center justify-start mt-8"
                            >
                                <span className="text-white/40 font-mono text-[10px] uppercase tracking-widest text-left w-full">EST. 2026</span>
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
