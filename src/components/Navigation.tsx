"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
    { name: "MERCH", href: "/merch" },
    { name: "TOUR", href: "/tour" },
    { name: "ARCHIVE", href: "/archive" },
];

export default function Navigation() {
    const pathname = usePathname();

    return (
        <motion.nav
            initial={{ y: 60 }}
            animate={{ y: 0 }}
            transition={{ delay: 0.5, stiffness: 400, damping: 30 }}
            className="fixed bottom-0 left-0 w-full h-[60px] bg-primary z-50 flex items-center justify-center px-4"
        >
            <ul className="flex items-center gap-8 md:gap-16">
                {LINKS.map((link) => (
                    <li key={link.name}>
                        <Link
                            href={link.href}
                            className={cn(
                                "relative text-white font-bold text-[12px] tracking-widest hover:opacity-80 transition-opacity",
                                pathname === link.href && "opacity-100"
                            )}
                        >
                            {link.name}
                            {pathname === link.href && (
                                <motion.div
                                    layoutId="underline"
                                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                                />
                            )}
                            {/* Fake active state for demo if not strictly matching */}
                            <div className="absolute -bottom-1 left-0 w-0 h-[1px] bg-white group-hover:w-full transition-all duration-300" />
                        </Link>
                    </li>
                ))}
            </ul>
        </motion.nav>
    );
}
