"use client";

import { useState, useEffect } from "react";

export default function AdminArchives() {
    const [archives, setArchives] = useState<any[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newItem, setNewItem] = useState<any>({});

    useEffect(() => {
        fetch("/api/archives")
            .then((res) => res.json())
            .then((data) => setArchives(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/archives", {
            method: "POST",
            body: JSON.stringify(newItem),
        });

        if (res.ok) {
            const updated = await fetch("/api/archives").then(r => r.json());
            setArchives(updated);
            setIsEditing(false);
            setNewItem({});
        }
    };

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Manage // <span className="text-primary">Archives</span>
                    </h1>
                    <button
                        onClick={() => { setIsEditing(true); setNewItem({}); }}
                        className="px-6 py-3 bg-black text-white font-bold uppercase hover:bg-primary transition-colors"
                    >
                        + Add Entry
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-white p-8 max-w-xl w-full">
                            <h2 className="text-2xl font-bold uppercase mb-6">New Archive Entry</h2>
                            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
                                <div>
                                    <label className="block mb-1">Title</label>
                                    <input
                                        className="w-full border p-2"
                                        value={newItem.title || ""}
                                        onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Image Path</label>
                                    <input
                                        className="w-full border p-2"
                                        value={newItem.image || ""}
                                        onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block mb-1">Description (Hover Text)</label>
                                    <textarea
                                        className="w-full border p-2 h-24"
                                        value={newItem.description || ""}
                                        onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="flex justify-end gap-4 mt-6">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-black uppercase font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {archives.map((item, i) => (
                        <div key={i} className="relative aspect-[3/4] group">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                            <div className="absolute bottom-0 left-0 bg-black text-white p-2 text-xs w-full flex justify-between items-center">
                                <div className="font-bold truncate pr-2">{item.title}</div>
                                <button
                                    onClick={async (e) => {
                                        e.stopPropagation();
                                        if (!confirm("Delete?")) return;
                                        await fetch(`/api/archives?id=${item.id}`, { method: "DELETE" });
                                        setArchives(archives.filter(a => a.id !== item.id));
                                    }}
                                    className="text-red-500 hover:text-red-400 uppercase font-black"
                                >
                                    [DEL]
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
