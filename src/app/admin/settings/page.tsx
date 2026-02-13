"use client";

import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Navigation from "@/components/Navigation";
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
        } catch (error) {
            toast.error("ERROR SAVING SETTINGS");
        }
    };

    if (loading) return <div className="p-24 text-center">LOADING...</div>;
    if (!settings) return <div className="p-24 text-center">ERROR LOADING SETTINGS</div>;

    return (
        <main className="min-h-screen bg-background pb-[60px] pt-24">
            <Header />
            <div className="container mx-auto px-6 max-w-2xl">
                <h1 className="text-4xl font-black uppercase tracking-tighter mb-12">
                    Admin // <span className="text-primary">Settings</span>
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="bg-surface border border-black p-8">
                        <h3 className="font-bold uppercase mb-6">Footer Content</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono uppercase mb-2">Copyright Text</label>
                                <input
                                    type="text"
                                    value={settings.footerText}
                                    onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-black p-8">
                        <h3 className="font-bold uppercase mb-6">Hero Wallpaper</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono uppercase mb-2">Desktop Background</label>
                                <ImageUpload
                                    value={settings.heroImage}
                                    onChange={(url) => setSettings({ ...settings, heroImage: url })}
                                    folder="settings"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-surface border border-black p-8">
                        <h3 className="font-bold uppercase mb-6">Social Links</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-xs font-mono uppercase mb-2">Instagram URL</label>
                                <input
                                    type="text"
                                    value={settings.socials.instagram}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, instagram: e.target.value }
                                    })}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase mb-2">Twitter / X URL</label>
                                <input
                                    type="text"
                                    value={settings.socials.twitter}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, twitter: e.target.value }
                                    })}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none font-mono text-sm"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-mono uppercase mb-2">TikTok URL</label>
                                <input
                                    type="text"
                                    value={settings.socials.tiktok}
                                    onChange={(e) => setSettings({
                                        ...settings,
                                        socials: { ...settings.socials, tiktok: e.target.value }
                                    })}
                                    className="w-full p-3 border border-gray-200 focus:border-black outline-none font-mono text-sm"
                                />
                            </div>
                        </div>
                    </div>



                    <div className="bg-surface border border-black p-8">
                        <h3 className="font-bold uppercase mb-6">Marquee Banner</h3>
                        <div className="space-y-4">
                            <label className="flex items-center gap-2 border p-4 cursor-pointer hover:bg-gray-100">
                                <input
                                    type="checkbox"
                                    checked={settings.showMarquee || false}
                                    onChange={(e) => setSettings({ ...settings, showMarquee: e.target.checked })}
                                />
                                <span className="font-bold uppercase">Show Banner</span>
                            </label>

                            {settings.showMarquee && (
                                <div>
                                    <label className="block text-xs font-mono uppercase mb-2">Banner Text (use // to separate)</label>
                                    <input
                                        type="text"
                                        value={settings.marqueeText || ""}
                                        onChange={(e) => setSettings({ ...settings, marqueeText: e.target.value })}
                                        placeholder="WORLDWIDE SHIPPING // NEW DROP AVAILABLE"
                                        className="w-full p-3 border border-gray-200 focus:border-black outline-none font-mono text-sm"
                                    />
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="bg-surface border border-black p-8">
                        <h3 className="font-bold uppercase mb-6">Latest Drops</h3>
                        <div className="space-y-4">
                            <div className="mb-6">
                                <label className="block mb-1">Latest Drops Limit (Min 3)</label>
                                <input
                                    type="number"
                                    min="3"
                                    className="w-full border p-2"
                                    value={settings.latestDropsLimit || 7}
                                    onChange={e => setSettings({ ...settings, latestDropsLimit: Math.max(3, parseInt(e.target.value) || 3) })}
                                />
                            </div>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest hover:bg-primary transition-colors"
                    >
                        Save Changes
                    </button>
                </form >
            </div >
            <Navigation />
        </main >
    );
}
