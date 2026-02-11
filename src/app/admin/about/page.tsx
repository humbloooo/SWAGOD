"use client";

import { useState, useEffect } from "react";

export default function AdminAbout() {
    const [data, setData] = useState<any>({ heading: "", paragraphs: [], footer: "" });

    useEffect(() => {
        fetch("/api/about")
            .then((res) => res.json())
            .then((data) => setData(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch("/api/about", {
            method: "POST",
            body: JSON.stringify(data),
        });
        alert("Saved!");
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
                                <textarea
                                    key={i}
                                    className="w-full border p-4 bg-surface h-32"
                                    value={p}
                                    onChange={e => updateParagraph(i, e.target.value)}
                                />
                            ))}
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

                    <button type="submit" className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors">
                        Save Changes
                    </button>
                </form>
            </div>
        </main>
    );
}
