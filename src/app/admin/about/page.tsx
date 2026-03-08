"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";

import { AboutData } from "@/lib/types";

export default function AdminAbout() {
    const [data, setData] = useState<AboutData>({ heading: "", paragraphs: [], footer: "" });

    useEffect(() => {
        fetch("/api/about")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        toast.promise(
            async () => {
                const res = await fetch("/api/about", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                });
                if (!res.ok) throw new Error("Failed to save");
                return res;
            },
            {
                loading: 'Saving about page...',
                success: 'About page updated!',
                error: 'Failed to save'
            }
        );
    };

    const updateParagraph = (index: number, value: string) => {
        const newParagraphs = [...data.paragraphs];
        newParagraphs[index] = value;
        setData({ ...data, paragraphs: newParagraphs });
    };

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto max-w-2xl">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
                    Edit // <span className="text-primary">About Us</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-6 font-mono text-sm">
                    <div>
                        <label className="block mb-2 font-bold uppercase">Heading</label>
                        <input
                            className="w-full border p-4 bg-surface"
                            value={data.heading || ""}
                            onChange={e => setData({ ...data, heading: e.target.value })}
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-bold uppercase">Paragraphs</label>
                        <div className="space-y-4">
                            {data.paragraphs?.map((p: string, i: number) => (
                                <div key={i} className="relative group">
                                    <textarea
                                        className="w-full border p-4 bg-surface h-32 pr-12"
                                        value={p}
                                        onChange={e => updateParagraph(i, e.target.value)}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const newP = [...data.paragraphs];
                                            newP.splice(i, 1);
                                            setData({ ...data, paragraphs: newP });
                                        }}
                                        className="absolute top-2 right-2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-500/10"
                                    >
                                        REMOVE
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={() => setData({ ...data, paragraphs: [...(data.paragraphs || []), ""] })}
                                className="w-full py-4 border border-dashed border-gray-300 text-gray-400 hover:text-black hover:border-black transition-all font-mono uppercase text-xs"
                            >
                                + Add Paragraph
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block mb-2 font-bold uppercase">Footer / Tagline</label>
                        <input
                            className="w-full border p-4 bg-surface"
                            value={data.footer || ""}
                            onChange={e => setData({ ...data, footer: e.target.value })}
                        />
                    </div>

                    <button type="submit" className="w-full py-4 bg-background text-foreground font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}
