"use client";

import { useState, useEffect } from "react";
import { TourEvent } from "@/lib/types";
import { toast } from "sonner";

export default function AdminTour() {
    const [tours, setTours] = useState<TourEvent[]>([]);
    const [isEditing, setIsEditing] = useState(false);
    const [newItem, setNewItem] = useState<Partial<TourEvent>>({});

    useEffect(() => {
        fetch("/api/tour")
            .then((res) => res.json())
            .then((data) => setTours(data));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/tour", {
            method: "POST",
            body: JSON.stringify(newItem),
        });

        if (res.ok) {
            toast.success("Tour date added");
            // Refresh
            const updated = await fetch("/api/tour").then(r => r.json());
            setTours(updated);
            setIsEditing(false);
            setNewItem({});
        } else {
            toast.error("Failed to add tour");
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this date?")) return;
        await fetch(`/api/tour?id=${id}`, { method: "DELETE" });
        setTours(tours.filter(t => t.id !== id));
        toast.success("Deleted");
    };

    return (
        <main className="pb-[100px] pt-32 px-6 text-white bg-black">
            <div className="container mx-auto max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-16">
                    <header>
                        <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                            TOUR // <span className="text-primary">DATES</span>
                        </h1>
                        <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm italic">SCHEDULING AND VENUE LOGISTICS</p>
                    </header>
                    <button
                        onClick={() => { setIsEditing(true); setNewItem({}); }}
                        className="px-10 py-5 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-all shadow-xl glitch-hover"
                    >
                        + ADD NEW EVENT
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[100] flex items-center justify-center p-6">
                        <div className="bg-black border border-white/20 p-10 max-w-xl w-full relative shadow-2xl">
                            <h2 className="text-4xl font-black uppercase tracking-tighter mb-10 border-b border-white/10 pb-4">INITIALIZE // EVENT</h2>
                            <form onSubmit={handleSubmit} className="space-y-8 font-mono text-xs uppercase tracking-widest">
                                <div className="space-y-2">
                                    <label className="text-white/40">TEMPORAL_MARKER (DATE)</label>
                                    <input
                                        type="date"
                                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all uppercase"
                                        value={newItem.date || ""}
                                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-2">
                                        <label className="text-white/40">CITY_NODE</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                            value={newItem.city || ""}
                                            onChange={e => setNewItem({ ...newItem, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <label className="text-white/40">VENUE_STATION</label>
                                        <input
                                            className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                            value={newItem.venue || ""}
                                            onChange={e => setNewItem({ ...newItem, venue: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-white/40">PURCHASE_LINK_URI (OPTIONAL)</label>
                                    <input
                                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                        value={newItem.ticketLink || ""}
                                        onChange={e => setNewItem({ ...newItem, ticketLink: e.target.value })}
                                        placeholder="HTTPS://..."
                                    />
                                </div>
                                <label className="flex items-center gap-4 group cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="w-6 h-6 bg-white/5 border border-white/10 checked:bg-primary accent-primary"
                                        checked={newItem.soldOut || false}
                                        onChange={e => setNewItem({ ...newItem, soldOut: e.target.checked })}
                                    />
                                    <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">MARK_AS_SOLD_OUT</span>
                                </label>

                                <div className="flex justify-end gap-6 pt-10">
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(false)}
                                        className="px-10 py-5 border border-white/20 font-black tracking-widest hover:bg-white/5 transition-all text-[10px]"
                                    >
                                        ABORT
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-10 py-5 bg-primary text-black font-black tracking-widest hover:bg-white transition-all text-[10px]"
                                    >
                                        EXECUTE_WRITE
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="space-y-6">
                    {tours.map((tour, i) => (
                        <div key={i} className="flex items-center justify-between p-8 border border-white/10 bg-white/5 backdrop-blur-md hover:border-primary transition-all duration-300 group">
                            <div>
                                <div className="font-mono text-[10px] text-primary mb-2 uppercase tracking-widest">{tour.date}</div>
                                <h3 className="font-black uppercase text-2xl tracking-tighter group-hover:text-primary transition-colors">{tour.city} // {tour.venue}</h3>
                                {tour.soldOut && <span className="inline-block mt-2 px-3 py-1 bg-red-500/10 text-red-500 border border-red-500/20 font-black text-[10px] tracking-widest">SOLD_OUT</span>}
                            </div>
                            <button
                                onClick={() => handleDelete(tour.id)}
                                className="px-6 py-2 border border-red-500/30 text-red-500 font-black uppercase text-[10px] tracking-widest hover:bg-red-500 hover:text-white transition-all"
                            >
                                PURGE
                            </button>
                        </div>
                    ))}
                    {tours.length === 0 && (
                        <div className="text-center py-24 border border-white/10 border-dashed opacity-30 font-mono uppercase tracking-[0.3em] italic">
                            NO TOUR DATA RECOVERED.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
