"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminBackButton() {
    const router = useRouter();
    const pathname = usePathname();

    // If we're at the root of admin, "back" means the store
    // Otherwise, "back" usually means returning to the dashboard
    const isMainAdmin = pathname === "/admin";

    const handleBack = () => {
        if (isMainAdmin) {
            router.push("/");
        } else {
            router.push("/admin");
        }
    };

    return (
        <motion.button
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={handleBack}
            className="fixed top-20 left-6 z-[60] flex items-center gap-2 bg-primary text-white px-4 py-2 font-mono text-xs font-bold uppercase tracking-widest hover:bg-black transition-colors shadow-lg group"
        >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {isMainAdmin ? "Return to Store" : "Back to Dashboard"}
        </motion.button>
    );
}
