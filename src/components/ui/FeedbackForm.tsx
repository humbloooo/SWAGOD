"use client";

import { useState, useEffect } from "react";

import { useSession } from "next-auth/react";

export default function FeedbackForm() {
    const { data: session } = useSession();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    // Sync session data once loaded to avoid hydration mismatch
    useEffect(() => {
        if (session?.user) {
            setTimeout(() => {
                if (session.user?.name) setName(session.user.name);
                if (session.user?.email) setEmail(session.user.email);
            }, 0);
        }
    }, [session]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            await fetch("/api/feedback", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, message }),
            });
            setStatus("success");
            setMessage("");
        } catch {
            setStatus("error");
        }
    };

    return (
        <section className="py-24 bg-background text-foreground">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <header className="mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter mb-4">
                        GET IN <span className="text-primary italic">TOUCH</span>
                    </h2>
                    <p className="font-mono text-[10px] uppercase tracking-[0.4em] text-white/40 italic">
                        {"//"} WE VALUE YOUR FEEDBACK AND SUGGESTIONS
                    </p>
                </header>

                {status === "success" ? (
                    <div className="p-12 border border-primary bg-primary/5 text-primary font-mono text-sm uppercase tracking-widest glow-primary">
                        MESSAGE SENT. THANK YOU FOR REACHING OUT.
                        <button
                            onClick={() => setStatus("idle")}
                            className="block mx-auto mt-6 text-[10px] underline hover:text-white transition-colors"
                        >
                            SEND ANOTHER MESSAGE
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 text-left">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                placeholder="FULL NAME"
                                className="w-full bg-white/5 border border-white/10 p-4 font-mono text-[10px] uppercase tracking-widest focus:border-primary focus:outline-none transition-colors"
                                required
                                suppressHydrationWarning
                            />
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="EMAIL ADDRESS"
                                className="w-full bg-white/5 border border-white/10 p-4 font-mono text-[10px] uppercase tracking-widest focus:border-primary focus:outline-none transition-colors"
                                required
                                suppressHydrationWarning
                            />
                        </div>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="MESSAGE CONTENT..."
                            className="w-full h-40 bg-white/5 border border-white/10 p-4 font-mono text-[10px] uppercase tracking-widest focus:border-primary focus:outline-none transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="w-full py-5 bg-foreground text-background font-black uppercase tracking-[0.3em] text-xs hover:bg-primary hover:text-white transition-all duration-500 disabled:opacity-50 flex items-center justify-center gap-3 group"
                        >
                            {status === "submitting" ? "SENDING..." : "SEND FEEDBACK"}
                            <span className="inline-block group-hover:translate-x-2 transition-transform">→</span>
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
