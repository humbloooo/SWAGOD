"use client"; // Verified directive placement

import { motion } from "framer-motion";
import ChangelogWidget from "@/components/ui/ChangelogWidget";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import { ShieldAlert, Terminal, Activity, Zap, RotateCcw } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminDeveloper() {
    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6 font-mono">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-12 flex justify-between items-end border-b border-foreground/10 pb-8">
                    <div>
                        <div className="flex items-center gap-3 text-red-500 mb-4 animate-pulse">
                            <ShieldAlert size={24} />
                            <span className="text-[10px] font-black uppercase tracking-[0.3em]">RESTRICTED_AREA // DANGER_ZONE</span>
                        </div>
                        <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter leading-none">
                            DEVELOPER <span className="text-foreground/20">{"//"}</span> <span className="text-primary text-3xl">ROOT_ACCESS</span>
                        </h1>
                    </div>
                    <Link href="/admin" className="text-[10px] font-black uppercase tracking-widest text-foreground/40 hover:text-primary transition-colors border border-foreground/10 px-4 py-2 hover:bg-foreground/5">
                        [ BACK_TO_DASHBOARD ]
                    </Link>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-12">
                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <Terminal size={20} className="text-primary" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter">PRIMARY_LOGS</h2>
                            </div>
                            <div className="bg-foreground/[0.02] border border-foreground/10 p-8 rounded-sm">
                                <ChangelogWidget />
                            </div>
                        </section>

                        <section>
                            <div className="flex items-center gap-4 mb-8">
                                <Activity size={20} className="text-primary" />
                                <h2 className="text-2xl font-black uppercase tracking-tighter">LIVE_METRICS</h2>
                            </div>
                            <AdminAnalytics />
                        </section>
                    </div>

                    <div className="space-y-8">
                        <div className="bg-primary/5 border border-primary/20 p-6">
                            <h3 className="text-primary font-black text-xs uppercase tracking-widest mb-6">SYSTEM_HEALTH</h3>
                            <div className="space-y-4">
                                {[
                                    { label: "DATABASE", status: "STABLE", color: "text-green-500" },
                                    { label: "ENCRYPTION", status: "AES-256", color: "text-primary" },
                                    { label: "AUTH_SHIELD", status: "ACTIVE", color: "text-green-500" },
                                    { label: "ASSET_LOAD", status: "OPTIMIZED", color: "text-blue-500" },
                                ].map((item) => (
                                    <div key={item.label} className="flex justify-between items-center border-b border-foreground/5 pb-2">
                                        <span className="text-[10px] text-foreground/40 font-black">{item.label}</span>
                                        <span className={`text-[10px] font-black ${item.color}`}>{item.status}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="bg-foreground/5 border border-foreground/10 p-6">
                            <h3 className="text-foreground/40 font-black text-xs uppercase tracking-widest mb-6">NETWORK_TRAFFIC</h3>
                            <div className="h-32 flex items-end gap-1 mb-6">
                                {[...Array(20)].map((_, i) => (
                                    <motion.div
                                        key={i}
                                        initial={{ height: 0 }}
                                        animate={{ height: `${20 + (i * 7) % 80}%` }}
                                        transition={{ repeat: Infinity, duration: 1, repeatType: "reverse", delay: i * 0.05 }}
                                        className="flex-1 bg-primary/20"
                                    />
                                ))}
                            </div>
                            <div className="flex items-center gap-2 text-[8px] font-black text-primary animate-pulse">
                                <Zap size={10} />
                                <span>INTERCEPTING_PACKETS...</span>
                            </div>
                        </div>

                        <ResetDatabaseControl />
                    </div>
                </div>
            </div>
        </main>
    );
}

function ResetDatabaseControl() {
    const [isConfirming, setIsConfirming] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleReset = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('/api/admin/developer/reset', { method: 'POST' });
            if (!res.ok) throw new Error('Reset failed');

            toast.success("SYSTEM_FACTORY_RESET_SUCCESSFUL");
            router.push('/admin');
            router.refresh();
        } catch (error) {
            console.error(error);
            toast.error("CRITICAL_SYSTEM_FAILURE: RESET_FAILED");
        } finally {
            setIsLoading(false);
            setIsConfirming(false);
        }
    };

    return (
        <div className="p-6 border border-red-500/20 bg-red-500/5">
            <h3 className="text-red-500 font-black text-xs uppercase tracking-widest mb-4">CRITICAL_ACTIONS</h3>
            {!isConfirming ? (
                <button
                    onClick={() => setIsConfirming(true)}
                    className="w-full py-4 bg-red-500 text-black font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black hover:text-red-500 transition-all border border-red-500 flex items-center justify-center gap-2"
                >
                    <RotateCcw size={14} />
                    INITIALIZE_FACTORY_RESET
                </button>
            ) : (
                <div className="space-y-4">
                    <p className="text-[8px] text-red-500 font-bold uppercase tracking-widest animate-pulse">
                        WARNING: THIS ACTION WILL PERMANENTLY DELETE ALL PRODUCTS AND RESTORE SETTINGS TO DEFAULT. THIS CANNOT BE UNDONE.
                    </p>
                    <div className="grid grid-cols-2 gap-2">
                        <button
                            onClick={handleReset}
                            disabled={isLoading}
                            className="py-3 bg-red-900 text-white font-black text-[10px] uppercase tracking-widest hover:bg-red-500 hover:text-black transition-all border border-red-500 disabled:opacity-50"
                        >
                            {isLoading ? "WIPING..." : "CONFIRM_ERASE"}
                        </button>
                        <button
                            onClick={() => setIsConfirming(false)}
                            disabled={isLoading}
                            className="py-3 bg-transparent text-foreground/40 font-black text-[10px] uppercase tracking-widest hover:text-foreground transition-all border border-foreground/10"
                        >
                            ABORT_MISSION
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
