"use client";

import { useState, useEffect } from "react";

export default function AdminPromos() {
    const [promos, setPromos] = useState<any[]>([]);
    const [newItem, setNewItem] = useState<any>({ code: "", discount: 10, active: true });

    useEffect(() => {
        fetch("/api/promos")
            .then((res) => res.json())
            .then((data) => setPromos(Array.isArray(data) ? data : []));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/promos", {
            method: "POST",
            body: JSON.stringify(newItem),
        });

        if (res.ok) {
            const saved = await res.json();
            // If API returns single item, appned. If array, replace.
            // My API logic was mixed. Let's just refetch to be safe.
            const updated = await fetch("/api/promos").then(r => r.json());
            setPromos(updated);
            setNewItem({ code: "", discount: 10, active: true });
        }
    };

    const toggleActive = async (index: number) => {
        const itemToUpdate = { ...promos[index], active: !promos[index].active };

        // Optimistic UI Update
        const updatedList = [...promos];
        updatedList[index] = itemToUpdate;
        setPromos(updatedList);

        // API Call
        await fetch("/api/promos", {
            method: "PUT",
            body: JSON.stringify(itemToUpdate),
        });
    };

    const handleDelete = async (index: number) => {
        if (!confirm("Delete?")) return;
        const item = promos[index];

        // Optimistic UI Update
        const updated = promos.filter((_, i) => i !== index);
        setPromos(updated);

        // API Call
        await fetch(`/api/promos?id=${item.id}`, {
            method: "DELETE",
        });
    }

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24 px-6">
            <div className="container mx-auto">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
                    Manage // <span className="text-primary">Promos</span>
                </h1>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* List */}
                    <div className="space-y-4">
                        <h2 className="text-xl font-bold uppercase">Active Codes</h2>
                        {promos.length === 0 && <p className="text-gray-500 font-mono">No promos found.</p>}
                        {promos.map((p, i) => (
                            <div key={i} className={`flex justify-between items-center p-4 border ${p.active ? 'border-primary bg-primary/5' : 'border-gray-200 bg-gray-100 opacity-50'}`}>
                                <div>
                                    <div className="text-2xl font-black uppercase tracking-tighter">{p.code}</div>
                                    <div className="font-mono text-sm">{p.discount}% OFF</div>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={() => toggleActive(i)} className="text-xs font-bold underline">
                                        {p.active ? "DISABLE" : "ENABLE"}
                                    </button>
                                    <button onClick={() => handleDelete(i)} className="text-xs font-bold text-red-500 underline">
                                        DELETE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create */}
                    <div className="bg-surface border border-black p-8 h-fit">
                        <h2 className="text-xl font-bold uppercase mb-6">Create New</h2>
                        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-sm">
                            <div>
                                <label className="block mb-1 font-bold">Code</label>
                                <input
                                    className="w-full border p-2 uppercase"
                                    value={newItem.code}
                                    onChange={e => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2026"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block mb-1 font-bold">Discount (%)</label>
                                <input
                                    type="number"
                                    className="w-full border p-2"
                                    value={newItem.discount}
                                    onChange={e => setNewItem({ ...newItem, discount: parseInt(e.target.value) })}
                                    min="1" max="100"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-3 bg-black text-white font-bold uppercase hover:bg-primary transition-colors">
                                Create Promo
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
