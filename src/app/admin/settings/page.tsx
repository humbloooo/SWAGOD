"use client";

import { useState, useEffect } from "react";
import ImageUpload from "@/components/admin/ImageUpload";
import { SiteSettings } from "@/lib/types";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function AdminSettings() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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
        <main className="pb-[100px] pt-32 px-6 text-white bg-black">
            <div className="container mx-auto max-w-4xl">
                <header className="mb-16">
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-4 leading-none">
                        GLOBAL // <span className="text-primary">CORE</span>
                    </h1>
                    <p className="text-primary font-mono uppercase tracking-[0.2em] text-sm italic">SYSTEM CONFIGURATION AND PARAMETERS</p>
                </header>

                <form onSubmit={handleSubmit} className="space-y-12">
                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4 text-primary font-mono">FOOTER_DATA</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">COPYRIGHT_STRING</label>
                                <input
                                    type="text"
                                    value={settings.footerText}
                                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4 text-primary font-mono">VISUAL_OVERRIDE</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">HERO_WALLPAPER_SOURCE (DARK MODE)</label>
                                <div className="p-4 border border-white/5 bg-black/20">
                                    <ImageUpload
                                        value={settings.heroImage}
                                        onChange={(url) => setSettings({ ...settings, heroImage: url })}
                                        folder="settings"
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">HERO_WALLPAPER_SOURCE (LIGHT MODE)</label>
                                <div className="p-4 border border-white/5 bg-black/20">
                                    <ImageUpload
                                        value={settings.lightModeWallpaper}
                                        onChange={(url) => setSettings({ ...settings, lightModeWallpaper: url })}
                                        folder="settings"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4 text-primary font-mono">SOCIAL_NODES</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">INSTAGRAM_URI</label>
                                <input
                                    type="text"
                                    value={settings.socials.instagram}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, instagram: e.target.value }
                                    })}
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">TWITTER_URI</label>
                                <input
                                    type="text"
                                    value={settings.socials.twitter}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, twitter: e.target.value }
                                    })}
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">TIKTOK_URI</label>
                                <input
                                    type="text"
                                    value={settings.socials.tiktok}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, tiktok: e.target.value }
                                    })}
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4 text-primary font-mono">COMMUNICATION_ARRAY</h3>
                        <div className="space-y-6">
                            <label className="flex items-center gap-4 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-white/5 border border-white/10 checked:bg-primary accent-primary"
                                    checked={settings.showSocials ?? true}
                                    onChange={(e) => setSettings({ ...settings, showSocials: e.target.checked })}
                                />
                                <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">ACTIVATE_SOCIAL_LINKS</span>
                            </label>

                            <label className="flex items-center gap-4 group cursor-pointer">
                                <input
                                    type="checkbox"
                                    className="w-6 h-6 bg-white/5 border border-white/10 checked:bg-primary accent-primary"
                                    checked={settings.showMarquee || false}
                                    onChange={(e) => setSettings({ ...settings, showMarquee: e.target.checked })}
                                />
                                <span className="font-black uppercase tracking-widest group-hover:text-primary transition-colors">ACTIVATE_MARQUEE_BANNER</span>
                            </label>

                            {settings.showMarquee && (
                                <div className="space-y-2 pt-4">
                                    <label className="text-white/40 font-mono text-xs uppercase tracking-widest">MARQUEE_TEXT_CONTENT (// DELIMITED)</label>
                                    <input
                                        type="text"
                                        value={settings.marqueeText || ""}
                                        onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value })}
                                        placeholder="WORLDWIDE SHIPPING // NEW DROP AVAILABLE"
                                        className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-white/5 border border-white/10 p-10 backdrop-blur-md">
                        <h3 className="text-xl font-black uppercase mb-8 border-b border-white/10 pb-4 text-primary font-mono">LIMIT_PARAMETERS</h3>
                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-white/40 font-mono text-xs uppercase tracking-widest">LATEST_DROPS_QUERY_LIMIT (MIN_3)</label>
                                <input
                                    type="number"
                                    min="3"
                                    className="w-full bg-white/5 border border-white/10 p-4 focus:border-primary outline-none transition-all font-mono text-sm"
                                    value={settings.latestDropsLimit || 7}
                                    onChange={e => setSettings({ ...settings, latestDropsLimit: Math.max(3, parseInt(e.target.value) || 3) })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-6 bg-primary text-black font-black uppercase tracking-[0.3em] hover:bg-white transition-all shadow-xl glitch-hover"
                    >
                        SYNC_SYSTEM_CHANGES
                    </button>
                </form >
            </div >
        </main >
    );
}
