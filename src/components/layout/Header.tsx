"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ShoppingBag, Search as SearchIcon, User as UserIcon, LogOut, Settings as SettingsIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { signOut, useSession } from "next-auth/react";
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
        fetch("/api/settings", { cache: "no-store" })
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
                animate="visible"
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="fixed top-0 left-0 w-full h-16 z-50 flex items-center justify-between px-4 md:px-6 border-b border-foreground/5 overflow-hidden"
            >
                {settings?.headerVideoBg ? (
                    <>
                        <video
                            src={settings.headerVideoBg}
                            autoPlay loop muted playsInline
                            className="absolute inset-0 w-full h-full object-cover -z-20 opacity-70"
                        />
                        <div className="absolute inset-0 w-full h-full bg-background/30 backdrop-blur-sm -z-10" />
                    </>
                ) : (
                    <div className="absolute inset-0 w-full h-full bg-background/80 backdrop-blur-md -z-10" />
                )}

                {/* Left Side: Navigation Menu Toggle */}
                <div className="flex items-center w-[100px] z-10">
                    <button
                        onClick={() => setIsOpen(true)}
                        className="text-foreground hover:text-primary transition-colors flex items-center gap-2"
                        aria-label="Open Navigation Menu"
                        suppressHydrationWarning
                    >
                        <Menu size={28} className="icon-industrial" suppressHydrationWarning />
                    </button>
                </div>

                {/* Center: Logo & Brand Name */}
                <div className="absolute left-1/2 -translate-x-1/2 flex items-center justify-center gap-2">
                    <Link href="/" className="flex items-center gap-3 hover:scale-105 transition-transform group">
                        <div className="relative w-8 h-8 rounded-full overflow-hidden border border-foreground/10 shadow-sm glow-primary bg-white dark:bg-black transition-colors group-hover:border-primary">
                            <Image src="/assets/swagod-logo.png" alt="Swagod Logo" fill className="object-cover" suppressHydrationWarning />
                        </div>
                        <span className="text-foreground font-black text-lg sm:text-xl tracking-widest uppercase group-hover:text-primary transition-colors hidden sm:block">SWAGOD</span>
                    </Link>
                </div>

                {/* Right Side: Currency & Cart */}
                <div className="flex items-center justify-end w-[100px] sm:w-[150px] md:w-[250px] gap-2 md:gap-5">
                    <div className="hidden lg:flex items-center gap-2 font-mono text-[10px] text-foreground/40 border-r border-foreground/10 pr-4 mr-2">
                        <button onClick={() => setCurrency("ZAR")} className={`${currency === "ZAR" ? 'text-primary font-bold' : 'opacity-40 hover:opacity-100'} transition-all`}>ZAR</button>
                        <span className="opacity-20">/</span>
                        <button onClick={() => setCurrency("USD")} className={`${currency === "USD" ? 'text-primary font-bold' : 'opacity-40 hover:opacity-100'} transition-all`}>USD</button>
                    </div>

                    <button
                        onClick={() => {
                            if (window.navigator.vibrate) window.navigator.vibrate(10);
                            setIsSearchOpen(true);
                        }}
                        className="text-foreground hover:text-primary transition-colors"
                        aria-label="Search Collection"
                        suppressHydrationWarning
                    >
                        <SearchIcon size={20} className="icon-industrial" suppressHydrationWarning />
                    </button>

                    <UserPortal />

                    <button
                        onClick={() => {
                            if (window.navigator.vibrate) window.navigator.vibrate(10);
                            openCart();
                        }}
                        className="group relative flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                        aria-label="View Cart"
                        suppressHydrationWarning
                    >
                        <div className="relative">
                            <ShoppingBag size={20} className="icon-industrial" suppressHydrationWarning />
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
            <AnimatePresence>
                {mounted && settings?.showMarquee && !hidden && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed top-16 left-0 w-full z-[40] bg-primary text-white text-[10px] font-bold py-1 overflow-hidden whitespace-nowrap border-b border-white/10"
                    >
                        <div className="animate-marquee inline-block">
                            <span className="mx-4 uppercase">{marqueeText}</span>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

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
                        className="fixed inset-y-0 left-0 w-[85vw] md:w-[40vw] bg-background/95 backdrop-blur-md z-[60] border-r border-foreground/10 flex flex-col px-8 md:px-12 shadow-[0_0_40px_rgba(255,100,0,0.15)] text-foreground"
                    >
                        <div className="absolute top-6 left-8 right-8 flex items-center justify-between z-[70]">
                            <ThemeToggle />
                            <button
                                onClick={() => setIsOpen(false)}
                                className="text-foreground hover:text-primary transition-colors"
                            >
                                <X size={32} />
                            </button>
                        </div>
                        <div className="flex flex-col space-y-6 md:space-y-8 overflow-y-auto no-scrollbar pt-24 pb-10">
                            {[
                                { l: "Home", h: "/" },
                                { l: "Collections", h: "/shop" },
                                { l: "Tour", h: "/tour" },
                                { l: "Gallery", h: "/gallery" },
                                { l: "Login", h: "/login" },
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
                                        className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-black uppercase text-foreground hover:text-primary transition-colors tracking-widest drop-shadow-[0_0_10px_rgba(255,255,255,0.2)] hover:drop-shadow-[0_0_15px_rgba(255,100,0,0.8)] leading-tight"
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
                                className="pt-8 border-t border-foreground/10 flex items-center justify-start mt-8"
                            >
                                <span className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest text-left w-full">EST. 2026</span>
                            </motion.div>
                        </div>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.7 }}
                            className="mt-auto pb-12"
                        >
                            <p className="text-foreground/50 font-mono text-xs uppercase tracking-widest">
                                SWAGOD {"//"} EST. 2026 {"//"} WORLDWIDE
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

function UserPortal() {
    const { data: session } = useSession();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const isAdmin = session?.user?.email === "kuntatswelope9@gmail.com" || (session?.user as { role?: string })?.role === "admin";

    return (
        <div className="relative">
            {session ? (
                <button
                    onClick={() => {
                        if (window.navigator.vibrate) window.navigator.vibrate(10);
                        setShowUserMenu(!showUserMenu);
                    }}
                    className="flex items-center gap-2 group"
                >
                    <div className="w-8 h-8 rounded-full border border-foreground/10 overflow-hidden group-hover:border-primary transition-all">
                        {session.user?.image ? (
                            <Image src={session.user.image} alt="User" width={32} height={32} className="object-cover" />
                        ) : (
                            <div className="w-full h-full bg-foreground/5 flex items-center justify-center">
                                <UserIcon size={14} className="text-foreground/40" />
                            </div>
                        )}
                    </div>
                </button>
            ) : (
                <Link
                    href="/login"
                    onClick={() => { if (window.navigator.vibrate) window.navigator.vibrate(10); }}
                    className="text-[10px] font-mono font-black uppercase tracking-widest hover:text-primary transition-colors border border-foreground/10 px-3 py-1 bg-foreground/5"
                >
                    LOGIN
                </Link>
            )}

            <AnimatePresence>
                {showUserMenu && session && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 z-40 bg-black/5 md:hidden"
                            onClick={() => setShowUserMenu(false)}
                        />
                        <motion.div
                            initial={{ opacity: 0, y: 10, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 10, scale: 0.95 }}
                            className="absolute top-12 right-0 w-64 bg-background/95 backdrop-blur-xl border border-foreground/10 shadow-2xl z-50 p-6 flex flex-col gap-4 text-foreground"
                        >
                            <div className="pb-4 border-b border-foreground/10">
                                <p className="text-[8px] font-mono text-foreground/40 uppercase tracking-widest">AUTHORIZED_CITIZEN</p>
                                <p className="font-black uppercase truncate">{session.user?.name}</p>
                            </div>

                            <div className="flex flex-col gap-1">
                                {isAdmin && (
                                    <Link
                                        href="/admin"
                                        onClick={() => setShowUserMenu(false)}
                                        className="flex items-center gap-3 p-2 hover:bg-primary/10 hover:text-primary transition-colors text-[10px] font-black uppercase tracking-widest"
                                    >
                                        <SettingsIcon size={14} />
                                        ADMIN_PANEL
                                    </Link>
                                )}
                                <Link
                                    href="/gallery"
                                    onClick={() => { if (window.navigator.vibrate) window.navigator.vibrate(5); }}
                                    className="px-6 py-2 text-xs font-mono font-bold tracking-[0.2em] border border-foreground/20 rounded hover:border-foreground hover:bg-foreground hover:text-background transition-all"
                                >
                                    MY_GALLERY<ShoppingBag size={14} />
                                </Link>
                                <button
                                    onClick={() => {
                                        if (window.navigator.vibrate) window.navigator.vibrate(20);
                                        signOut();
                                    }}
                                    className="flex items-center gap-3 p-2 hover:bg-red-500/10 text-red-500 transition-colors text-[10px] font-black uppercase tracking-widest text-left"
                                >
                                    <LogOut size={14} />
                                    TERMINATE_SESSION
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
