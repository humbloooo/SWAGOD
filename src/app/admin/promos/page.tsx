"use client";

import { useState, useEffect } from "react";

interface Promo {
    id?: string;
    code: string;
    discount: number;
    active: boolean;
}

export default function AdminPromos() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [newItem, setNewItem] = useState<Promo>({ code: "", discount: 10, active: true });

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
            await res.json();
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
        <main className="pb-[100px] pt-32 px-6 text-white bg-black">
            <div className="container mx-auto">
                <header className="mb-16">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                        MANAGE // <span className="text-primary">PROMOS</span>
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm italic">CAMPAIGN CONTROLS AND DISCOUNTS</p>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* List */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase border-b border-primary/30 pb-4 text-primary font-mono">ACTIVE_ARCHIVE</h2>
                        {promos.length === 0 && <p className="text-white/40 font-mono italic">NO PROMOS DETECTED.</p>}
                        {promos.map((p, i) => (
                            <div key={i} className={`flex justify-between items-center p-8 border transition-all duration-300 ${p.active ? 'border-primary bg-primary/5' : 'border-white/10 bg-white/5 opacity-40'}`}>
                                <div>
                                    <div className="text-3xl font-black uppercase tracking-tighter">{p.code}</div>
                                    <div className="font-mono text-xs text-primary mt-2">{p.discount}% OFF VOUCHER</div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => toggleActive(i)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-white/20 hover:border-primary hover:text-primary transition-all">
                                        {p.active ? "DISABLE" : "ENABLE"}
                                    </button>
                                    <button onClick={() => handleDelete(i)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-white transition-all">
                                        PURGE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create */}
                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md h-fit">
                        <h2 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4">INITIALIZE // CODE</h2>
                        <form onSubmit={handleSubmit} className="space-y-6 font-mono text-xs uppercase tracking-widest">
                            <div className="space-y-2">
                                <label className="text-white/40">CODE_STRING</label>
                                <input
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all uppercase"
                                    value={newItem.code}
                                    onChange={e => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2026"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-white/40">DISCOUNT_PERCENTAGE</label>
                                <input
                                    type="number"
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all"
                                    value={newItem.discount}
                                    onChange={e => setNewItem({ ...newItem, discount: parseInt(e.target.value) })}
                                    min="1" max="100"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-primary text-black font-black uppercase tracking-widest hover:bg-white transition-all mt-4">
                                DEPLOY PROMO
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
