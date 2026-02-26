"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { toast } from "sonner";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

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

        toast.promise(
            async () => {
                const res = await fetch("/api/archives", {
                    method: "POST",
                    body: JSON.stringify(newItem),
                });
                if (!res.ok) throw new Error("Failed to add archive");
                return res;
            },
            {
                loading: 'ADDING ITEM...',
                success: async () => {
                    const updated = await fetch("/api/archives").then(r => r.json());
                    setArchives(updated);
                    setIsEditing(false);
                    setNewItem({});
                    return 'ITEM ADDED';
                },
                error: 'FAILED TO ADD ITEM'
            }
        );
    };

    return (
        <main className="min-h-screen bg-black pb-[60px] pt-24 px-6">
            <div className="container mx-auto">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        STORE // <span className="text-primary">ARCHIVE</span>
                    </h1>
                    <button
                        onClick={() => { setIsEditing(true); setNewItem({}); }}
                        className="px-6 py-3 bg-primary text-black font-bold uppercase hover:bg-white transition-colors"
                    >
                        + ADD ITEM
                    </button>
                </div>

                <AnimatePresence>
                    {isEditing && (
                        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-4">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                className="bg-black border border-white/20 p-8 max-w-xl w-full relative"
                            >
                                <button onClick={() => setIsEditing(false)} className="absolute top-6 right-6 text-white/40 hover:text-white transition-colors">
                                    <X size={24} />
                                </button>
                                <h2 className="text-2xl font-black uppercase mb-6">NEW ARCHIVE ITEM</h2>
                                <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm uppercase">
                                    <div>
                                        <label className="block mb-1 text-white/40">TITLE</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-3 outline-none focus:border-primary transition-colors"
                                            value={newItem.title || ""}
                                            onChange={e => setNewItem({ ...newItem, title: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-white/40">IMAGE</label>
                                        <ImageUpload
                                            value={newItem.image}
                                            onChange={(url) => setNewItem({ ...newItem, image: url })}
                                            folder="archives"
                                        />
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-2 mt-2 text-[10px] text-white/40 outline-none"
                                            placeholder="OR PASTE URL..."
                                            value={newItem.image || ""}
                                            onChange={e => setNewItem({ ...newItem, image: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1 text-white/40">DESCRIPTION</label>
                                        <textarea
                                            className="w-full bg-white/5 border border-white/10 p-3 h-24 outline-none focus:border-primary transition-colors resize-none"
                                            value={newItem.description || ""}
                                            onChange={e => setNewItem({ ...newItem, description: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="flex justify-end gap-4 mt-6">
                                        <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-white/20 uppercase font-black tracking-widest hover:bg-white/5 transition-colors">CANCEL</button>
                                        <button type="submit" className="px-6 py-2 bg-primary text-black uppercase font-black tracking-widest hover:bg-white transition-colors">SAVE</button>
                                    </div>
                                </form>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {archives.map((item, i) => (
                        <div key={i} className="relative aspect-[3/4] group border border-white/10 overflow-hidden">
                            <img src={item.image} alt={item.title} className="w-full h-full object-cover grayscale group-hover:grayscale-0 group-hover:scale-105 transition-all duration-500" />
                            <div className="absolute bottom-0 left-0 bg-black/80 backdrop-blur-md text-white p-3 text-[10px] w-full flex flex-col gap-1">
                                <div className="font-black truncate uppercase">{item.title}</div>
                                <div className="flex justify-between items-center">
                                    <span className="text-primary font-bold">LIKES: {item.likes?.length || 0}</span>
                                    <button
                                        onClick={async (e) => {
                                            e.stopPropagation();
                                            if (!confirm("DELETE?")) return;
                                            toast.promise(
                                                async () => {
                                                    const res = await fetch(`/api/archives?id=${item.id}`, { method: "DELETE" });
                                                    if (!res.ok) throw new Error("Failed");
                                                },
                                                {
                                                    loading: 'DELETING...',
                                                    success: () => {
                                                        setArchives(archives.filter(a => a.id !== item.id));
                                                        return 'DELETED';
                                                    },
                                                    error: 'FAILED TO DELETE'
                                                }
                                            );
                                        }}
                                        className="text-red-500 hover:text-white transition-colors font-black"
                                    >
                                        [DEL]
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </main>
    );
}
