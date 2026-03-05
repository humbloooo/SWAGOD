"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "CART", href: "#", isCart: true },
    { name: "TOUR", href: "/tour" },
    { name: "GALLERY", href: "/gallery" },
    { name: "LOGIN", href: "/login" },
];

import { useAppStore } from "@/lib/store";

export default function Navigation() {
    const pathname = usePathname();
    const { openCart, items } = useAppStore();

    return (
        <motion.nav
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 w-full h-[60px] bg-background/80 backdrop-blur-md z-50 flex items-center justify-center px-4 border-t border-foreground/10"
        >
            <ul className="flex items-center gap-8 md:gap-16">
                {LINKS.map((link) => (
                    <li key={link.name}>
                        {link.isCart ? (
                            <button
                                onClick={openCart}
                                className="relative text-foreground/60 font-black text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.3em] hover:text-primary transition-colors flex flex-col items-center gap-1"
                            >
                                <span className="relative">
                                    {link.name}
                                    {items.length > 0 && (
                                        <span className="absolute -top-4 -right-4 bg-primary text-background text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center animate-pulse">
                                            {items.reduce((acc, i) => acc + i.quantity, 0)}
                                        </span>
                                    )}
                                </span>
                            </button>
                        ) : (
                            <Link
                                href={link.href}
                                className={cn(
                                    "relative text-foreground/60 font-black text-[10px] md:text-[12px] tracking-[0.2em] md:tracking-[0.3em] hover:text-primary transition-colors",
                                    pathname === link.href && "text-primary"
                                )}
                            >
                                {link.name}
                                {pathname === link.href && (
                                    <motion.div
                                        layoutId="underline"
                                        className="absolute -bottom-1 left-0 w-full h-[1px] bg-primary glow-primary"
                                    />
                                )}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
}
