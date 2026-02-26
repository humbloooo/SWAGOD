"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { Settings, ExternalLink } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminQuickLinks() {
    const { data: session } = useSession();

    // In a real app, you'd check a role or a specific list
    const isAdmin = session?.user?.email && (
        session.user.email.endsWith("@swagod.com") ||
        session.user.email === "admin@swagod.co.za"
    );

    if (!isAdmin) return null;

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            className="fixed bottom-40 right-6 z-[60] flex flex-col gap-2"
        >
            <Link
                href="/admin"
                className="group flex items-center gap-3 bg-primary text-black px-4 py-3 font-black text-[10px] uppercase tracking-widest shadow-2xl hover:bg-white transition-all"
            >
                <Settings size={16} />
                <span>ADMIN PANEL</span>
            </Link>
            <Link
                href="/admin/products"
                className="group flex items-center gap-3 bg-black/80 backdrop-blur-md text-white border border-white/10 px-4 py-3 font-black text-[10px] uppercase tracking-widest hover:border-primary transition-all"
            >
                <ExternalLink size={16} />
                <span>QUICK INV_MGMT</span>
            </Link>
        </motion.div>
    );
}
