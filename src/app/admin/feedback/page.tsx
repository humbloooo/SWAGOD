"use client";

import { useState, useEffect } from "react";
import { Feedback } from "@/lib/types";

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

    if (loading) return <div className="p-24 text-center">LOADING...</div>;

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
                    Client // <span className="text-primary">Feedback</span>
                </h1>

                <div className="space-y-4">
                    {feedback.length === 0 && <p className="text-gray-500 font-mono">No feedback received yet.</p>}
                    {feedback.map((item) => (
                        <div key={item.id} className="border border-black p-6 bg-surface">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-bold text-lg uppercase">{item.name}</h3>
                                    <p className="font-mono text-sm text-gray-500">{item.email}</p>
                                </div>
                                <span className="font-mono text-xs text-gray-400">
                                    {new Date(item.date).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="font-mono text-sm leading-relaxed whitespace-pre-wrap mb-4">
                                {item.message}
                            </p>
                            <button
                                onClick={async () => {
                                    if (!confirm("Delete this message?")) return;
                                    await fetch(`/api/feedback?id=${item.id}`, { method: "DELETE" });
                                    setFeedback(feedback.filter(f => f.id !== item.id));
                                }}
                                className="text-xs font-bold text-red-500 underline"
                            >
                                DELETE MESSAGE
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
