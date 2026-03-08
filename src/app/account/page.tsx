"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { User, Package, LogOut, Settings, CreditCard } from "lucide-react";
import Navigation from "@/components/layout/Navigation";

export default function AccountPage() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/login");
        }
    }, [status, router]);

    if (status === "loading") {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
        );
    }

    if (!session) return null;

    return (
        <main className="min-h-screen pt-32 pb-24 bg-background">
            <div className="container mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-4xl mx-auto"
                >
                    <header className="mb-12">
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center">
                                <User size={32} className="text-primary" />
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter">
                                    THE {"//"} <span className="text-primary">ACCOUNT</span>
                                </h1>
                                <p className="font-mono text-sm text-foreground/40 uppercase tracking-widest italic">USER_ID: {session.user?.email}</p>
                            </div>
                        </div>
                    </header>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                        {/* Profile Info */}
                        <div className="col-span-1 md:col-span-2 space-y-8">
                            <div className="bg-foreground/5 border border-foreground/10 p-8 rounded-sm backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-foreground/10 group-hover:text-primary transition-colors">SECURE_PROFILE</div>
                                <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em] font-black mb-6 italic">PROFILE_DATA</h2>
                                <div className="space-y-6">
                                    <div>
                                        <label className="block font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-1">NAME_ID</label>
                                        <p className="text-xl font-black uppercase tracking-tight">{session.user?.name || "UNSPECIFIED"}</p>
                                    </div>
                                    <div>
                                        <label className="block font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-1">EMAIL_ADDRESS</label>
                                        <p className="text-xl font-black uppercase tracking-tight">{session.user?.email || "UNSPECIFIED"}</p>
                                    </div>
                                    <div>
                                        <label className="block font-mono text-[10px] text-foreground/40 uppercase tracking-widest mb-1">MEMBER_SINCE</label>
                                        <p className="text-xl font-black uppercase tracking-tight">EST. 2026</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground/5 border border-foreground/10 p-8 rounded-sm backdrop-blur-sm relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 font-mono text-[10px] text-foreground/10 group-hover:text-primary transition-colors">ACQUISITIONS</div>
                                <h2 className="text-sm font-mono text-primary uppercase tracking-[0.3em] font-black mb-6 italic">ORDER_HISTORY</h2>
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Package size={48} className="text-foreground/10 mb-4" />
                                    <p className="font-mono text-[10px] text-foreground/40 uppercase tracking-[0.2em]">NO_TRANSACTIONS_FOUND</p>
                                    <button
                                        onClick={() => router.push('/shop')}
                                        className="mt-6 px-6 py-2 bg-primary text-black font-mono text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform"
                                    >
                                        REPLENISH_STOCK
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Actions */}
                        <div className="space-y-4">
                            {[
                                { icon: Settings, label: "SETTINGS", action: () => { } },
                                { icon: CreditCard, label: "PAYMENTS", action: () => { } },
                                { icon: LogOut, label: "LOG_OUT", action: () => signOut({ callbackUrl: '/' }), color: "text-red-500" },
                            ].map((item) => (
                                <button
                                    key={item.label}
                                    onClick={item.action}
                                    className="w-full flex items-center justify-between p-4 bg-foreground/5 border border-foreground/10 hover:border-primary/50 transition-all group"
                                >
                                    <div className="flex items-center gap-4">
                                        <item.icon size={18} className={item.color || "text-foreground group-hover:text-primary transition-colors"} />
                                        <span className={`font-mono text-[10px] font-black tracking-widest ${item.color || "text-foreground group-hover:text-primary"} transition-colors`}>{item.label}</span>
                                    </div>
                                    <span className="text-primary opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </motion.div>
            </div>
            <Navigation />
        </main>
    );
}
