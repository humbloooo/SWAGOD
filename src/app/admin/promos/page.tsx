"use client";

import { useState, useEffect } from "react";
import { SiteSettings } from "@/lib/types";
import { toast } from "sonner";

interface Promo {
    id?: string;
    code: string;
    discount: number;
    active: boolean;
}

export default function AdminPromos() {
    const [promos, setPromos] = useState<Promo[]>([]);
    const [newItem, setNewItem] = useState<Promo>({ code: "", discount: 10, active: true });
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    useEffect(() => {
        fetch("/api/promos", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => setPromos(Array.isArray(data) ? data : []));

        fetch("/api/settings", { cache: "no-store" })
            .then((res) => res.json())
            .then((data) => setSettings(data))
            .catch(console.error);
    }, []);

    const handleSubmitPromo = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch("/api/promos", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newItem),
        });

        if (res.ok) {
            const updated = await fetch("/api/promos", { cache: "no-store" }).then(r => r.json());
            setPromos(Array.isArray(updated) ? updated : []);
            setNewItem({ code: "", discount: 10, active: true });
            toast.success("PROMO DEPLOYED");
        }
    };

    const handleSettingsSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });
            if (res.ok) toast.success("SOCIAL LINKS SYNCHRONIZED");
            else toast.error("FAILED TO SAVE SOCIALS");
        } catch {
            toast.error("ERROR SAVING SOCIALS");
        }
    };

    const toggleActive = async (index: number) => {
        const itemToUpdate = { ...promos[index], active: !promos[index].active };
        const updatedList = [...promos];
        updatedList[index] = itemToUpdate;
        setPromos(updatedList);

        await fetch("/api/promos", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(itemToUpdate),
        });
    };

    const handleDelete = async (index: number) => {
        if (!confirm("Delete?")) return;
        const item = promos[index];
        const updated = promos.filter((_, i) => i !== index);
        setPromos(updated);

        await fetch(`/api/promos?id=${item.id!}`, {
            method: "DELETE",
        });
        toast.success("PROMO PURGED");
    }

    return (
        <main className="pb-[100px] pt-32 px-6 text-foreground bg-background">
            <div className="container mx-auto">
                <header className="mb-16">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                        MANAGE // <span className="text-primary">PROMOS</span>
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm italic">CAMPAIGN CONTROLS AND SOCIAL REACH</p>
                </header>

                <div className="grid grid-cols-1 gap-12 mb-12">
                    {settings && (
                        <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                            <h2 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">SOCIAL NETWORK DIRECTORY</h2>
                            <form onSubmit={handleSettingsSubmit} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                                    <div className="p-4 border border-foreground/5 bg-background/50 space-y-4">
                                        <div className="flex justify-between items-center w-full">
                                            <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest font-bold">SHOW INSTAGRAM</label>
                                            <input
                                                type="checkbox"
                                                checked={settings.showInstagram !== false}
                                                onChange={e => setSettings({ ...settings, showInstagram: e.target.checked })}
                                                className="w-5 h-5 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest">INSTAGRAM_URI</label>
                                            <input
                                                type="text"
                                                value={settings.socials?.instagram || ""}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    socials: { ...settings.socials, instagram: e.target.value }
                                                })}
                                                className="w-full bg-background border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border border-foreground/5 bg-background/50 space-y-4">
                                        <div className="flex justify-between items-center w-full">
                                            <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest font-bold">SHOW TWITTER (X)</label>
                                            <input
                                                type="checkbox"
                                                checked={settings.showTwitter !== false}
                                                onChange={e => setSettings({ ...settings, showTwitter: e.target.checked })}
                                                className="w-5 h-5 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest">TWITTER_URI</label>
                                            <input
                                                type="text"
                                                value={settings.socials?.twitter || ""}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    socials: { ...settings.socials, twitter: e.target.value }
                                                })}
                                                className="w-full bg-background border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>

                                    <div className="p-4 border border-foreground/5 bg-background/50 space-y-4">
                                        <div className="flex justify-between items-center w-full">
                                            <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest font-bold">SHOW TIKTOK</label>
                                            <input
                                                type="checkbox"
                                                checked={settings.showTiktok !== false}
                                                onChange={e => setSettings({ ...settings, showTiktok: e.target.checked })}
                                                className="w-5 h-5 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                            />
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-foreground/40 font-mono text-[10px] uppercase tracking-widest">TIKTOK_URI</label>
                                            <input
                                                type="text"
                                                value={settings.socials?.tiktok || ""}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    socials: { ...settings.socials, tiktok: e.target.value }
                                                })}
                                                className="w-full bg-background border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Custom Social Nodes */}
                                <div className="mt-4 pt-4 border-t border-foreground/10">
                                    <h4 className="text-foreground/60 font-mono text-sm uppercase tracking-widest mb-4">CUSTOM SOCIAL NODES</h4>
                                    <div className="space-y-4">
                                        {(settings.customSocials || []).map((social, idx) => (
                                            <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-background/50 p-4 border border-foreground/10">
                                                <input
                                                    type="text"
                                                    placeholder="PLATFORM (E.G. YOUTUBE)"
                                                    value={social.name}
                                                    onChange={(e) => {
                                                        const newArr = [...(settings.customSocials || [])];
                                                        newArr[idx].name = e.target.value;
                                                        setSettings({ ...settings, customSocials: newArr });
                                                    }}
                                                    className="w-full md:w-1/3 bg-background border border-foreground/10 p-3 outline-none focus:border-primary font-mono text-xs uppercase"
                                                />
                                                <input
                                                    type="text"
                                                    placeholder="URL"
                                                    value={social.url}
                                                    onChange={(e) => {
                                                        const newArr = [...(settings.customSocials || [])];
                                                        newArr[idx].url = e.target.value;
                                                        setSettings({ ...settings, customSocials: newArr });
                                                    }}
                                                    className="w-full md:w-1/2 bg-background border border-foreground/10 p-3 outline-none focus:border-primary font-mono text-xs"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        const newArr = [...(settings.customSocials || [])];
                                                        newArr.splice(idx, 1);
                                                        setSettings({ ...settings, customSocials: newArr });
                                                    }}
                                                    className="px-4 py-3 bg-red-900 border border-red-500 text-white font-black uppercase text-[10px] tracking-widest hover:bg-red-500 transition-colors w-full md:w-auto"
                                                >
                                                    REMOVE
                                                </button>
                                            </div>
                                        ))}
                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                setSettings({
                                                    ...settings,
                                                    customSocials: [...(settings.customSocials || []), { name: "", url: "" }]
                                                });
                                            }}
                                            className="w-full py-4 border border-foreground/20 text-foreground/60 font-mono uppercase tracking-widest text-[10px] hover:bg-foreground/10 hover:text-foreground transition-all border-dashed"
                                        >
                                            + ADD CUSTOM NODE
                                        </button>
                                    </div>
                                </div>

                                <button type="submit" className="w-full py-5 bg-primary text-background font-black uppercase tracking-widest hover:bg-foreground transition-all mt-4 shadow-lg">
                                    SYNC SOCIAL LINKS
                                </button>
                            </form>
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* List */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold uppercase border-b border-primary/30 pb-4 text-primary font-mono">ACTIVE_GALLERY (VOUCHERS)</h2>
                        {promos.length === 0 && <p className="text-foreground/40 font-mono italic">NO PROMOS DETECTED.</p>}
                        {promos.map((p, i) => (
                            <div key={i} className={`flex justify-between items-center p-8 border transition-all duration-300 ${p.active ? 'border-primary bg-primary/5' : 'border-foreground/10 bg-foreground/5 opacity-40'}`}>
                                <div>
                                    <div className="text-3xl font-black uppercase tracking-tighter">{p.code}</div>
                                    <div className="font-mono text-xs text-primary mt-2">{p.discount}% OFF VOUCHER</div>
                                </div>
                                <div className="flex gap-4">
                                    <button onClick={() => toggleActive(i)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-foreground/20 hover:border-primary hover:text-primary transition-all">
                                        {p.active ? "DISABLE" : "ENABLE"}
                                    </button>
                                    <button onClick={() => handleDelete(i)} className="text-[10px] font-black uppercase tracking-widest px-4 py-2 border border-red-500/30 text-red-500 hover:bg-red-500 hover:text-foreground transition-all">
                                        PURGE
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Create */}
                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md h-fit">
                        <h2 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4">INITIALIZE // CODE</h2>
                        <form onSubmit={handleSubmitPromo} className="space-y-6 font-mono text-xs uppercase tracking-widest">
                            <div className="space-y-2">
                                <label className="text-foreground/40">CODE_STRING</label>
                                <input
                                    className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all uppercase"
                                    value={newItem.code}
                                    onChange={e => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                                    placeholder="SUMMER2026"
                                    required
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-foreground/40">DISCOUNT_PERCENTAGE</label>
                                <input
                                    type="number"
                                    className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all"
                                    value={newItem.discount}
                                    onChange={e => setNewItem({ ...newItem, discount: parseInt(e.target.value) })}
                                    min="1" max="100"
                                    required
                                />
                            </div>
                            <button type="submit" className="w-full py-5 bg-primary text-background font-black uppercase tracking-widest hover:bg-foreground transition-all mt-4">
                                DEPLOY PROMO
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </main>
    );
}
