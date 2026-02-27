"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { SiteSettings } from "@/lib/types";

export default function Footer() {
    const [settings, setSettings] = useState<SiteSettings | null>(null);

    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setTimeout(() => setMounted(true), 0);
        fetch("/api/settings")
            .then(res => res.json())
            .then(data => setSettings(data))
            .catch(err => console.error("Failed to load settings", err));
    }, []);

    const year = new Date().getFullYear();

    return (
        <footer className="bg-background text-foreground pt-24 pb-12 border-t border-foreground/10 dark:border-gray-900">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-24">
                    <div className="col-span-1 md:col-span-2">
                        <Link href="/" className="text-4xl font-black tracking-tighter mb-4 block">
                            SWAGOD
                        </Link>
                        <p className="text-gray-500 max-w-sm font-mono text-sm">
                            WEAR THE FUTURE. FEAR THE PAST.
                            <br />
                            EST. {year}
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold uppercase mb-6 text-gray-400 text-xs tracking-widest">Shop</h4>
                        <ul className="space-y-4 font-mono text-xs text-gray-300">
                            <li><Link href="/shop" className="hover:text-primary transition-colors">ALL PRODUCTS</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">CLOTHING</Link></li>
                            <li><Link href="/shop" className="hover:text-primary transition-colors">ACCESSORIES</Link></li>
                        </ul>
                    </div>

                    {mounted && settings?.showSocials !== false && (
                        <div>
                            <h4 className="font-bold uppercase mb-6 text-foreground/50 text-xs tracking-widest">Connect</h4>
                            <ul className="space-y-4 font-mono text-xs text-foreground/70">
                                {mounted && settings?.socials ? (
                                    <>
                                        <li><a href={settings.socials.instagram} target="_blank" className="hover:text-primary transition-colors">INSTAGRAM</a></li>
                                        <li><a href={settings.socials.twitter} target="_blank" className="hover:text-primary transition-colors">TWITTER</a></li>
                                        <li><a href={settings.socials.tiktok} target="_blank" className="hover:text-primary transition-colors">TIKTOK</a></li>
                                    </>
                                ) : (
                                    <li className="text-foreground/40">UNLINKED</li>
                                )}
                            </ul>
                        </div>
                    )}

                    <div>
                        <h4 className="font-bold uppercase mb-6 text-gray-400 text-xs tracking-widest">Transmissions</h4>
                        <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest mb-4">RECEIVE ARCHIVE NOTIFICATIONS:</p>
                        <div className="flex bg-gray-900/50 border border-gray-800 focus-within:border-primary transition-colors">
                            <input
                                type="email"
                                placeholder="ACCESS@PROTO.COL"
                                className="bg-transparent border-none px-3 py-2 font-mono text-[10px] w-full focus:outline-none uppercase"
                            />
                            <button className="px-3 py-2 bg-primary text-black font-black text-[10px] uppercase hover:bg-white transition-colors">JOIN</button>
                        </div>
                    </div>
                </div>

                <div className="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono text-gray-600">
                    <p>{(mounted && settings?.footerText) || `© ${year} SWAGOD. ALL RIGHTS RESERVED.`}</p>
                    <div className="flex gap-4">
                        <Link href="/privacy" className="hover:text-primary transition-colors">PRIVACY POLICY</Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">TERMS OF SERVICE</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
