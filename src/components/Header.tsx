"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import CartDrawer from "@/components/CartDrawer";
import { useCartStore } from "@/lib/store";

const MENU_LINKS = [
    { name: "HOME", href: "/" },
    { name: "LATEST DROPS", href: "/#latest-drops" },
    { name: "SHOP", href: "/shop" },
    { name: "TOUR", href: "/tour" },
    { name: "ARCHIVE", href: "/archive" },
];

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);
    const [isCartOpen, setIsCartOpen] = useState(false);
    const cartItems = useCartStore((state) => state.items);
    // Hydration fix for persist
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const itemCount = mounted ? cartItems.reduce((acc, item) => acc + item.quantity, 0) : 0;

    return (
        <>
            {/* MARQUEE BANNER */}
            <div className="fixed top-0 left-0 w-full z-[60] bg-primary text-white text-[10px] font-bold py-1 overflow-hidden whitespace-nowrap">
                <div className="animate-marquee inline-block">
                    <span className="mx-4">WORLDWIDE SHIPPING AVAILABLE</span>
                    <span className="mx-4">//</span>
                    <span className="mx-4">FREE SHIPPING ON ORDERS OVER R2000</span>
                    <span className="mx-4">//</span>
                    <span className="mx-4">NEW DROP: "FUTURE REFLECTION" LIVE NOW</span>
                    <span className="mx-4">//</span>
                    <span className="mx-4">LIMITED QUANTITIES</span>
                    <span className="mx-4">//</span>
                    <span className="mx-4">WORLDWIDE SHIPPING AVAILABLE</span>
                    <span className="mx-4">//</span>
                    <span className="mx-4">FREE SHIPPING ON ORDERS OVER R2000</span>
                </div>
            </div>

            <header className="fixed top-6 left-0 w-full h-16 bg-primary z-50 flex items-center justify-between px-6 shadow-md">
                <Link href="/" className="text-white font-black text-xl tracking-tighter">
                    SWAGOD
                </Link>

                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsCartOpen(true)}
                        className="relative text-white hover:opacity-80 transition-opacity"
                    >
                        <ShoppingBag size={24} />
                        {itemCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-black text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border border-primary">
                                {itemCount}
                            </span>
                        )}
                    </button>
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-white hover:opacity-80 transition-opacity"
                    >
                        <Menu size={32} />
                    </button>
                </div>
            </header>

            <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />

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
