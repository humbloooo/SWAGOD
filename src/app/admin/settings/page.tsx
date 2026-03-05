"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { SiteSettings } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const [isCompact, setIsCompact] = useState(false);
    const router = useRouter();

    useEffect(() => {
        // Apply compact view class to body if active
        if (isCompact) {
            document.body.style.zoom = "0.85";
        } else {
            document.body.style.zoom = "1";
        }
        return () => { document.body.style.zoom = "1"; };
    }, [isCompact]);

    useEffect(() => {
        fetch("/api/settings")
            .then((res) => res.json())
            .then((data) => {
                setSettings(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to load settings");
                setLoading(false);
            });
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const res = await fetch("/api/settings", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(settings),
            });

            if (res.ok) {
                toast.success("SETTINGS SAVED");
                router.refresh();
            } else {
                toast.error("FAILED TO SAVE");
            }
        } catch {
            toast.error("ERROR SAVING SETTINGS");
        }
    };

    if (loading) return <div className="p-24 text-center">LOADING...</div>;
    if (!settings) return <div className="p-24 text-center">ERROR LOADING SETTINGS</div>;

    return (
        <main className="pb-[100px] pt-32 px-6 text-foreground bg-background">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-16">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-4">
                        <div>
                            <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                                GLOBAL // <span className="text-primary">CORE</span>
                            </h1>
                            <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm italic">SYSTEM CONFIGURATION AND PARAMETERS</p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setIsCompact(!isCompact)}
                            className="px-4 py-2 border border-primary/30 bg-primary/5 text-primary font-mono text-[10px] uppercase tracking-widest hover:bg-primary hover:text-black transition-all"
                        >
                            {isCompact ? "NORMAL VIEW" : "COMPACT VIEW (MOBILE)"}
                        </button>
                    </div>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">FOOTER_DATA</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">COPYRIGHT_STRING</label>
                                <input
                                    type="text"
                                    value={settings.footerText}
                                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                                    className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">VISUAL_OVERRIDE</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">HERO_SLOGAN</label>
                                <input
                                    type="text"
                                    value={settings.heroSlogan || ""}
                                    onChange={(e) => setSettings({ ...settings, heroSlogan: e.target.value })}
                                    className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    placeholder="TIMELESS COLLECTIONS // MODERN STYLES"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">HERO_WALLPAPER_SOURCE (DARK MODE)</label>
                                <div className="p-4 border border-foreground/5 bg-background/20">
                                    <ImageUpload
                                        value={settings.heroImage}
                                        onChange={(url) => setSettings({ ...settings, heroImage: url })}
                                        folder="settings"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">HERO_WALLPAPER_SOURCE (LIGHT MODE)</label>
                                <div className="p-4 border border-foreground/5 bg-background/20">
                                    <ImageUpload
                                        value={settings.lightModeWallpaper}
                                        onChange={(url) => setSettings({ ...settings, lightModeWallpaper: url })}
                                        folder="settings"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">HEADER_VIDEO_BACKGROUND (MP4/WEBM)</label>
                                <div className="p-4 border border-foreground/5 bg-background/20">
                                    <ImageUpload
                                        value={settings.headerVideoBg}
                                        onChange={(url) => setSettings({ ...settings, headerVideoBg: url })}
                                        folder="settings"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">SOCIAL_NODES</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="p-4 border border-foreground/5 bg-foreground/5 space-y-4">
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
                                    <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">INSTAGRAM_URI</label>
                                    <input
                                        type="text"
                                        value={settings.socials.instagram}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socials: { ...settings.socials, instagram: e.target.value }
                                        })}
                                        className="w-full bg-background border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div className="p-4 border border-foreground/5 bg-foreground/5 space-y-4">
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
                                    <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">TWITTER_URI</label>
                                    <input
                                        type="text"
                                        value={settings.socials.twitter}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socials: { ...settings.socials, twitter: e.target.value }
                                        })}
                                        className="w-full bg-background border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                            <div className="p-4 border border-foreground/5 bg-foreground/5 space-y-4">
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
                                    <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">TIKTOK_URI</label>
                                    <input
                                        type="text"
                                        value={settings.socials.tiktok}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            socials: { ...settings.socials, tiktok: e.target.value }
                                        })}
                                        className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            </div>
                            {/* Custom Social Nodes */}
                            <div className="col-span-1 md:col-span-2 mt-4 pt-4 border-t border-foreground/10">
                                <h4 className="text-foreground/60 font-mono text-sm uppercase tracking-widest mb-4">CUSTOM SOCIAL NODES</h4>
                                <div className="space-y-4">
                                    {(settings.customSocials || []).map((social, idx) => (
                                        <div key={idx} className="flex flex-col md:flex-row gap-4 items-start md:items-center bg-foreground/5 p-4 border border-foreground/10">
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
                        </div>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <h2 className="text-8xl font-black">$$$</h2>
                        </div>
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">REVENUE // PSYCHOLOGY</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <label className="flex items-center gap-4 group cursor-pointer p-4 border border-foreground/5 bg-foreground/5 hover:border-primary/30 transition-all">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showScarcity ?? true}
                                    onChange={(e) => setSettings({ ...settings, showScarcity: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">ACTIVATE_SCARCITY</span>
                                    <span className="text-[8px] text-foreground/40 font-mono uppercase tracking-[0.2em] mt-1">SHOWS "ONLY X LEFT" ALERTS</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer p-4 border border-foreground/5 bg-foreground/5 hover:border-primary/30 transition-all">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showUrgency ?? true}
                                    onChange={(e) => setSettings({ ...settings, showUrgency: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">ACTIVATE_URGENCY</span>
                                    <span className="text-[8px] text-foreground/40 font-mono uppercase tracking-[0.2em] mt-1">SHOWS COUNTDOWN TIMERS</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer p-4 border border-foreground/5 bg-foreground/5 hover:border-primary/30 transition-all">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showSocialProof ?? true}
                                    onChange={(e) => setSettings({ ...settings, showSocialProof: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">ACTIVATE_SOCIAL_PROOF</span>
                                    <span className="text-[8px] text-foreground/40 font-mono uppercase tracking-[0.2em] mt-1">SHOWS RECENT PURCHASES</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer p-4 border border-foreground/5 bg-foreground/5 hover:border-primary/30 transition-all">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showPersonalization ?? true}
                                    onChange={(e) => setSettings({ ...settings, showPersonalization: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">ACTIVATE_PERSONALIZATION</span>
                                    <span className="text-[8px] text-foreground/40 font-mono uppercase tracking-[0.2em] mt-1">CUSTOMIZES CONTENT FOR RETURNING USERS</span>
                                </div>
                            </label>
                        </div>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">COMMUNICATION_ARRAY</h3>
                        <div className="space-y-6">
                            <label className="flex items-center gap-4 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showSocials ?? true}
                                    onChange={(e) => setSettings({ ...settings, showSocials: e.target.checked })}
                                />
                                <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">ACTIVATE_SOCIAL_LINKS</span>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.maintenanceMode || false}
                                    onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                                />
                                <div className="flex flex-col">
                                    <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">ACTIVATE_MAINTENANCE_MODE</span>
                                    <span className="text-[8px] text-red-500 font-mono uppercase tracking-[0.2em] mt-1">WARNING: THIS LOCKS THE STORE FROM PUBLIC ACCESS</span>
                                </div>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-foreground/5 border border-foreground/10 checked:bg-primary accent-primary"
                                    checked={settings.showMarquee || false}
                                    onChange={(e) => setSettings({ ...settings, showMarquee: e.target.checked })}
                                />
                                <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">ACTIVATE_MARQUEE_BANNER</span>
                            </label>

                            {settings.showMarquee && (
                                <div className="space-y-2 pt-4">
                                    <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">MARQUEE_TEXT_CONTENT (// DELIMITED)</label>
                                    <input
                                        type="text"
                                        value={settings.marqueeText || ""}
                                        onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value })}
                                        placeholder="WORLDWIDE SHIPPING // NEW DROP AVAILABLE"
                                        className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-foreground/5 border border-foreground/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-foreground/10 pb-4 text-primary font-mono">LIMIT_PARAMETERS</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-foreground/40 font-mono text-xs uppercase tracking-widest">LATEST_DROPS_QUERY_LIMIT (MIN_3)</label>
                                <input
                                    type="number"
                                    min="3"
                                    className="w-full bg-foreground/5 border border-foreground/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    value={settings.latestDropsLimit || 7}
                                    onChange={e => setSettings({ ...settings, latestDropsLimit: Math.max(3, parseInt(e.target.value) || 3) })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-6 bg-primary text-background font-black uppercase tracking-[0.3em] hover:bg-foreground transition-all shadow-xl glitch-hover"
                    >
                        SYNC_SYSTEM_CHANGES
                    </button>
                </form >
            </div>
        </main>
    );
}
