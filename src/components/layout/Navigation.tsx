"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
    { name: "HOME", href: "/" },
    { name: "SHOP", href: "/shop" },
    { name: "TOUR", href: "/tour" },
    { name: "GALLERY", href: "/gallery" },
    { name: "LOGIN", href: "/login" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 w-full h-[60px] bg-background/80 backdrop-blur-md z-50 flex items-center justify-center border-t border-foreground/10"
        >
            <ul className="flex items-center justify-center gap-6 sm:gap-8 md:gap-16 px-4 md:px-6 overflow-x-auto no-scrollbar mask-edges">
                {LINKS.map((link) => (
                    <li key={link.name}>
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
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
}
