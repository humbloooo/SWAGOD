"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import Search from "@/components/Search";
import { useAppStore } from "@/lib/store";
import { Search as SearchIcon, Heart } from "lucide-react";

const MENU_LINKS = [
    { name: "HOME", href: "/" },
    { name: "COLLECTIONS", href: "/#latest-drops" },
    { name: "SHOP", href: "/shop" },
    { name: "TOUR", href: "/tour" },
    { name: "GALLERY", href: "/archive" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const [isWishlistOpen, setIsWishlistOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const cartItems = useAppStore((state) => state.items);
    const wishlistItems = useAppStore((state) => state.wishlistItems);

    // Hydration fix for persist
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const [settings, setSettings] = useState<any>(null);

    useEffect(() => {
        setMounted(true);
        fetch("/api/settings").then(res => res.json()).then(data => setSettings(data));
    }, []);

    const itemCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;
    const wishlistCount = mounted ? wishlistItems.length : 0;
    const marqueeText = settings?.marqueeText || "WORLDWIDE SHIPPING AVAILABLE // FREE SHIPPING ON ORDERS OVER R2000 // NEW DROP: 'FUTURE REFLECTION' LIVE NOW // LIMITED QUANTITIES // WORLDWIDE SHIPPING AVAILABLE // FREE SHIPPING ON ORDERS OVER R2000";

    return (
        <>
            <header className="fixed top-0 left-0 w-full h-16 bg-primary z-50 flex items-center justify-between px-6 shadow-md">
                <Link href="/" className="text-white font-black text-xl tracking-tighter hover:scale-105 transition-transform">
                    SWAGOD
                </Link>

                <div className="flex items-center gap-4 md:gap-6">
                    {/* Item 24: Currency Toggle Signal */}
                    <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-white/60 border-r border-white/20 pr-4 mr-2">
                        <span className="text-white">ZAR</span>
                        <span className="opacity-40">USD</span>
                    </div>

                    <button
                        onClick={() => setIsSearchOpen(true)}
                        className="text-white hover:opacity-80 transition-opacity"
                        aria-label="Search Collection"
                    >
                        <SearchIcon size={20} className="icon-industrial" />
                    </button>

                    <button
                        onClick={() => setIsWishlistOpen(true)}
                        className="relative text-white hover:opacity-80 transition-opacity"
                        aria-label="View Saved Items"
                    >
                        <Heart size={20} className={cn("icon-industrial", wishlistCount > 0 ? "fill-white" : "")} />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center border border-primary glow-primary">
                                {wishlistCount}
                            </span>
                        )}
                    </button>

                    <button
                        onClick={() => setIsCartOpen(true)}
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
                                R {cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0).toFixed(2)}
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
            </header>

            {/* MARQUEE BANNER - Dynamic */}
            {settings?.showMarquee && (
                <div className="fixed top-16 left-0 w-full z-[40] bg-black text-white text-[10px] font-bold py-1 overflow-hidden whitespace-nowrap border-b border-gray-800">
                    <div className="animate-marquee inline-block">
                        <span className="mx-4 uppercase">{marqueeText}</span>
                    </div>
                </div>
            )}

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
            <WishlistDrawer isOpen={isWishlistOpen} onClose={() => setIsWishlistOpen(false)} />
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
                        <div className="flex flex-col space-y-8">
                            {[
                                { l: "Home", h: "/" },
                                { l: "Shop", h: "/shop" },
                                { l: "Tour", h: "/tour" },
                                { l: "Archive", h: "/archive" },
                                { l: "Login", h: "/login" },
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
                                        className="text-6xl font-black uppercase text-transparent stroke-white hover:text-primary transition-colors tracking-tighter"
                                        style={{ WebkitTextStroke: "1px white" }}
                                        onClick={() => setIsOpen(false)}
                                    >
                                        {item.l}
                                    </Link>
                                </motion.div>
                            ))}
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="absolute bottom-12 left-12"
                        >
                            <p className="text-gray-500 font-mono text-xs">
                                SWAGOD // EST. 2026 // WORLDWIDE
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
