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
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto max-w-4xl">
                <div className="flex justify-between items-center mb-12">
                    <h1 className="text-4xl font-black uppercase tracking-tighter">
                        Manage // <span className="text-primary">Tours</span>
                    </h1>
                    <button
                        onClick={() => { setIsEditing(true); setNewItem({}); }}
                        className="px-6 py-3 bg-black text-white font-bold uppercase hover:bg-primary transition-colors"
                    >
                        + Add Date
                    </button>
                </div>

                {isEditing && (
                    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
                        <div className="bg-white p-8 max-w-lg w-full">
                            <h2 className="text-2xl font-bold uppercase mb-6">New Tour Date</h2>
                            <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
                                <div>
                                    <label className="block mb-1">Date</label>
                                    <input
                                        type="date"
                                        className="w-full border p-2"
                                        value={newItem.date || ""}
                                        onChange={e => setNewItem({ ...newItem, date: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block mb-1">City</label>
                                        <input
                                            className="w-full border p-2"
                                            value={newItem.city || ""}
                                            onChange={e => setNewItem({ ...newItem, city: e.target.value })}
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block mb-1">Venue</label>
                                        <input
                                            className="w-full border p-2"
                                            value={newItem.venue || ""}
                                            onChange={e => setNewItem({ ...newItem, venue: e.target.value })}
                                            required
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block mb-1">Ticket Link (Optional)</label>
                                    <input
                                        className="w-full border p-2"
                                        value={newItem.ticketLink || ""}
                                        onChange={e => setNewItem({ ...newItem, ticketLink: e.target.value })}
                                        placeholder="https://..."
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        checked={newItem.soldOut}
                                        onChange={e => setNewItem({ ...newItem, soldOut: e.target.checked })}
                                    />
                                    <label>Mark as Sold Out</label>
                                </div>

                                <div className="flex justify-end gap-4 mt-6">
                                    <button type="button" onClick={() => setIsEditing(false)} className="px-6 py-2 border border-black uppercase font-bold">Cancel</button>
                                    <button type="submit" className="px-6 py-2 bg-black text-white uppercase font-bold hover:bg-primary">Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                <div className="space-y-4">
                    {tours.map((tour, i) => (
                        <div key={i} className="flex items-center justify-between p-4 border border-gray-200 bg-surface">
                            <div>
                                <div className="font-mono text-xs text-gray-500">{tour.date}</div>
                                <h3 className="font-bold uppercase text-lg">{tour.city} // {tour.venue}</h3>
                                {tour.soldOut && <span className="text-red-500 font-bold text-xs">SOLD OUT</span>}
                            </div>
                            <button
                                onClick={() => handleDelete(tour.id)}
                                className="text-red-500 hover:text-red-700 font-bold uppercase text-xs border border-red-200 px-3 py-1 hover:bg-red-50"
                            >
                                Delete
                            </button>
                        </div>
                    ))}
                    {tours.length === 0 && (
                        <div className="text-center py-12 text-gray-400 font-mono">
                            No tour dates found.
                        </div>
                    )}
                </div>
            </div>
        </main>
    );
}
