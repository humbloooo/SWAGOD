"use client";

import { useState, useEffect } from "react";
import { Feedback } from "@/lib/types";
import { Trash2, Mail, User, Calendar, MessageSquare } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminFeedback() {
    const [feedback, setFeedback] = useState<Feedback[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch("/api/feedback")
            .then((res) => res.json())
            .then((data) => {
                setFeedback(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, []);

    const deleteMessage = async (id: string) => {
        if (!confirm("DELETE THIS MESSAGE ARCHIVE?")) return;
        try {
            await fetch(`/api/feedback?id=${id}`, { method: "DELETE" });
            setFeedback(feedback.filter(f => f.id !== id));
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="text-white font-mono animate-pulse tracking-widest text-2xl uppercase">LOADING INTEL...</div>
        </div>
    );

    return (
        <main className="pb-[60px] md:pb-[100px] pt-24 md:pt-32 px-4 md:px-6">
            <div className="container mx-auto max-w-6xl">
                <header className="mb-10 md:mb-16">
                    <h1 className="text-5xl md:text-8xl font-black uppercase tracking-tighter mb-2 md:mb-4 leading-none glitch-hover inline-block">
                        FEEDBACK
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-[10px] md:text-sm">ARCHIVED CLIENT TRANSMISSIONS</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-8">
                    {feedback.length === 0 && (
                        <div className="col-span-full py-24 border border-white/10 flex flex-col items-center justify-center space-y-4">
                            <MessageSquare size={40} className="text-white/20" />
                            <p className="text-white/30 font-mono uppercase italic tracking-widest text-center text-[10px]">NO DATA RECOVERED.</p>
                        </div>
                    )}

                    <AnimatePresence mode="popLayout">
                        {feedback.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: idx * 0.05 }}
                                className="group relative border border-white/10 bg-white/5 backdrop-blur-md p-4 md:p-8 hover:border-primary transition-all duration-500 overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-2 md:p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => deleteMessage(item.id)}
                                        className="p-1 md:p-2 text-red-500 hover:bg-red-500/10 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4 md:w-5 md:h-5" />
                                    </button>
                                </div>

                                <div className="space-y-4 md:space-y-6">
                                    <div className="flex flex-wrap gap-2 md:gap-4 text-[8px] md:text-[10px] font-mono uppercase tracking-widest text-white/50">
                                        <div className="flex items-center gap-1.5 md:gap-2 border border-white/10 px-1.5 md:px-2 py-0.5 md:py-1 bg-white/5">
                                            <User size={10} className="text-primary md:w-3 md:h-3" /> {item.name}
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2 border border-white/10 px-1.5 md:px-2 py-0.5 md:py-1 bg-white/5">
                                            <Calendar size={10} className="text-primary md:w-3 md:h-3" /> {new Date(item.date).toLocaleDateString()}
                                        </div>
                                        <div className="flex items-center gap-1.5 md:gap-2 border border-white/10 px-1.5 md:px-2 py-0.5 md:py-1 bg-white/5">
                                            <Mail size={10} className="text-primary md:w-3 md:h-3" /> <span className="truncate max-w-[100px] md:max-w-none">{item.email}</span>
                                        </div>
                                    </div>

                                    <div className="relative">
                                        <p className="font-mono text-xs md:text-sm leading-relaxed text-white/80 whitespace-pre-wrap pl-4 md:pl-6 border-l-2 border-primary/30 group-hover:border-primary transition-colors">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </main>
    );
}
