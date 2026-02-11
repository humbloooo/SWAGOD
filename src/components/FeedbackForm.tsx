"use client";

import { useState } from "react";

export default function FeedbackForm() {
    const [message, setMessage] = useState("");
    const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setStatus("submitting");

        try {
            await fetch("/api/feedback", {
                method: "POST",
                body: JSON.stringify({ message }),
            });
            setStatus("success");
            setMessage("");
        } catch (error) {
            setStatus("error");
        }
    };

    return (
        <section className="py-24 bg-black text-white">
            <div className="container mx-auto px-6 max-w-2xl text-center">
                <h2 className="text-3xl font-black uppercase tracking-tighter mb-8">
                    Shape the Future // Give Feedback
                </h2>

                {status === "success" ? (
                    <div className="p-8 border border-green-500 text-green-500 font-mono">
                        MESSAGE RECEIVED. TRANSMISSION ENDED.
                        <button
                            onClick={() => setStatus("idle")}
                            className="block mx-auto mt-4 text-xs underline"
                        >
                            Send another
                        </button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            placeholder="TELL US WHAT YOU WANT TO SEE..."
                            className="w-full h-32 bg-transparent border border-white/20 p-4 font-mono text-sm focus:border-primary focus:outline-none transition-colors"
                            required
                        />
                        <button
                            type="submit"
                            disabled={status === "submitting"}
                            className="px-12 py-4 bg-white text-black font-bold uppercase tracking-widest hover:bg-primary hover:text-white transition-colors disabled:opacity-50"
                        >
                            {status === "submitting" ? "Transmitting..." : "Submit Feedback"}
                        </button>
                    </form>
                )}
            </div>
        </section>
    );
}
